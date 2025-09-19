const searchInput = document.getElementById("username");
const searchBtn = document.getElementById("search");
const spinner = document.getElementById("spinner");
const repoList = document.getElementById("repos");
const sortSelect = document.getElementById("sort-select");
const historyContainer = document.getElementById("history-buttons");

let currentRepos = [];
const LOCAL_STORAGE_KEY = "github_search_history";
let searchHistory = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
const MAX_HISTORY = 5;

let githubIconSVG = "";
let starIconSVG = "";

// Map languages to colors
const langColors = {
    JavaScript: "#f7df1e",
    TypeScript: "#2d79c7",
    Python: "#3572A5",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051",
    Java: "#b07219",
    C: "#555555",
    Go: "#00add8",
    Ruby: "#701516",
    PHP: "#4F5D95",
};

function extractUsername(input) {
    input = input.trim();

    try {
        const url = new URL(input);

        // Convert custom domain to github.com
        if (url.hostname === "ghc.obsoletedev.com") {
            url.hostname = "github.com";
        }

        // Extract first path part
        const pathParts = url.pathname.split("/").filter(Boolean);
        if (pathParts.length > 0) return pathParts[0];
    } catch (err) {
        // Not a URL, assume plain username
        return input;
    }

    return input;
}

async function loadIcon(filename) {
    const res = await fetch(`/icons/${filename}`);
    if (!res.ok) throw new Error(`Failed to load icon: ${filename}`);
    return await res.text();
}

async function preloadIcons() {
    githubIconSVG = await loadIcon("github.svg");
    starIconSVG = await loadIcon("star.svg");
}

function addToHistory(username) {
    // Remove if already exists
    searchHistory = searchHistory.filter((u) => u !== username);
    searchHistory.unshift(username); // add to front
    if (searchHistory.length > MAX_HISTORY) searchHistory.pop();

    // Save to localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(searchHistory));

    renderHistory();
}

function renderHistory() {
    historyContainer.innerHTML = "";
    searchHistory.forEach((username) => {
        const btn = document.createElement("button");
        btn.textContent = username;
        btn.addEventListener("click", () => {
            searchInput.value = username;
            fetchRepos(username);
        });
        historyContainer.appendChild(btn);
    });
}

async function fetchRepos(username) {
    if (!username || username.trim() === "") return; // <-- add this
    username = username.trim();

    addToHistory(username);

    repoList.innerHTML = "";
    spinner.classList.remove("hidden");

    try {
        const res = await fetch(`/repos/${username}`);
        // Only parse if response is OK
        if (!res.ok) throw new Error("GitHub API error");
        const data = await res.json();
        currentRepos = data.repos || [];
        renderRepos(currentRepos);
    } catch (err) {
        const li = document.createElement("li");
        li.classList.add("repo-card", "empty");
        li.textContent = `Error: ${err.message}`;
        repoList.appendChild(li);
    } finally {
        spinner.classList.add("hidden");
    }
}

function renderRepos(repos) {
    const sortValue = sortSelect.value;
    let sortedRepos = [...repos];

    switch (sortValue) {
        case "stars-desc":
            sortedRepos.sort((a, b) => b.stars - a.stars);
            break;
        case "stars-asc":
            sortedRepos.sort((a, b) => a.stars - b.stars);
            break;
        case "name-asc":
            sortedRepos.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case "name-desc":
            sortedRepos.sort((a, b) => b.name.localeCompare(a.name));
            break;
    }

    repoList.innerHTML = "";

    sortedRepos.forEach((repo, index) => {
        const li = document.createElement("li");
        li.classList.add("repo-card");

        li.innerHTML = `
      <a href="${repo.url}" target="_blank">${githubIconSVG}${repo.name}</a>
      <p>${repo.description || "No description provided"}</p>
      <div class="repo-meta">
        <span>${starIconSVG}${repo.stars}</span>
        <span><span class="lang-dot" style="background:${
            langColors[repo.language] || "#7a818e"
        }"></span>${repo.language || "Unknown"}</span>
      </div>
    `;

        li.style.animationDelay = `${index * 0.1}s`;
        repoList.appendChild(li);
    });

    repoList.scrollIntoView({ behavior: "smooth" });
}

// Search button click
searchBtn.addEventListener("click", () => {
    const username = extractUsername(searchInput.value);
    if (!username) return;
    fetchRepos(username);
});
// Press Enter to search
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const username = extractUsername(searchInput.value);
        if (!username) return;
        fetchRepos(username);
    }
});

sortSelect.addEventListener("change", () => {
    if (currentRepos.length > 0) renderRepos(currentRepos);
});

preloadIcons();
renderHistory();

document.addEventListener("DOMContentLoaded", () => {
    const currentURL = window.location.href;
    const username = extractUsername(currentURL);

    if (username) {
        searchInput.value = username;
        fetchRepos(username);
    }
});
