// server.js
const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.static("frontend"));

const repoCache = new Map();
const CACHE_TTL = 1000 * 60 * 60;

async function fetchWithAuth(url) {
    const res = await fetch(url, {
        headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
            "User-Agent": "github-contrib-viewer",
        },
    });
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    return res.json();
}

async function getRepoMetadata(repoName) {
    const cached = repoCache.get(repoName);

    // Return cache if fresh
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }

    // Otherwise fetch from GitHub
    const repoData = await fetchWithAuth(
        `https://api.github.com/repos/${repoName}`
    );

    const metadata = {
        name: repoData.full_name,
        url: repoData.html_url,
        description: repoData.description,
        stars: repoData.stargazers_count,
        language: repoData.language,
    };

    // Save to cache
    repoCache.set(repoName, { data: metadata, timestamp: Date.now() });

    return metadata;
}

app.get("/repos/:username", async (req, res) => {
    const { username } = req.params;
    try {
        const repos = new Map();

        // Fetch multiple pages of events (3 pages → ~90 events)
        for (let page = 1; page <= 3; page++) {
            const events = await fetchWithAuth(
                `https://api.github.com/users/${username}/events/public?page=${page}`
            );

            for (const event of events) {
                if (
                    event.repo &&
                    (event.type === "PushEvent" ||
                        event.type === "PullRequestEvent")
                ) {
                    if (!repos.has(event.repo.name)) {
                        const metadata = await getRepoMetadata(event.repo.name);
                        repos.set(event.repo.name, metadata);
                    }
                }
            }
        }

        res.json({ repos: Array.from(repos.values()) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get(/(.*)/, (req, res) => {
    res.sendFile(path.resolve('frontend/index.html'));
});

setInterval(() => {
    for (const [key, value] of repoCache.entries()) {
        if (Date.now() - value.timestamp > CACHE_TTL) {
            repoCache.delete(key);
        }
    }
}, CACHE_TTL);

app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)
);
