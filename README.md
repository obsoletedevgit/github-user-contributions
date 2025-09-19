# GitHub User Contributions

A web app to view GitHub users’ contributions in a clean, interactive interface.  
Built with **Node.js, Express, HTML, CSS, and JavaScript**.

---

## 🌟 Features

- Enter a GitHub username or profile URL to see all repos they have contributed to.  
- Supports custom domain URLs: `https://ghc.obsoletedev.com/username`.  
- Shows repository information including:
  - Repo name (clickable to GitHub)  
  - Description  
  - Stars  
  - Primary language with color indicator  
- Sort repositories by:
  - Stars (ascending/descending)  
  - Name (A–Z / Z–A)  
- Animated cards for smooth transitions.  
- Persistent **search history** using `localStorage`.  
- Responsive Poimandres-inspired dark theme.

---

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/obsoletedevgit/github-user-contributions.git
cd github-user-contributions
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm run start
```

4. Open your browser and go to:
```http
http://localhost:3000
```

## 🛠 Usage

- Enter a GitHub username or URL in the search bar.

- Click Search or press Enter.

- View user contributions as cards with repo information.

- Use the Sort By dropdown in the header to organize repos.

- Click a repo card to open the repository on GitHub.

- Recent searches appear as buttons below the search bar for quick access.

Supports URLs like:

- https://github.com/octocat → loads octocat

- https://ghc.obsoletedev.com/octocat → also loads octocat

## ⚡ Tech Stack

Backend: Node.js, Express, node-fetch

Frontend: HTML, CSS, JavaScript

Persistence: localStorage for search history

## 📁 Project Structure
```bash
github-user-contributions/
├─ backend/
│  └─ server.js         # Express server
├─ frontend/
│  ├─ index.html        # Main HTML file
│  ├─ style.css         # Stylesheet
│  ├─ script.js         # Frontend JS
│  └─ icons/            # GitHub/star SVG icons
├─ package.json
├─ README.md
├─ LICENSE
├─ .gitignore
└─ package-lock.json
```

## 🐛 Issues / Contributions

- Report bugs or request features on [GitHub Issues](https://github.com/obsoletedevgit/github-user-contributions/issues)
- Contributions are welcome via pull requests.

Built with 💜 by ObsoleteDev & contributors