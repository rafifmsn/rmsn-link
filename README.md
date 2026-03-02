# RMSN-Link

A high-performance, serverless, and completely free link shortener built using **Astro 5**, **Tailwind CSS v4**, and **GitHub** as a decentralized database. This project is designed for users who want 100% control over their data with zero hosting costs.

## How It Works

This project leverages a "Client-to-CDN" pattern:
1. **Creation:** The admin dashboard uses your GitHub Personal Access Token (PAT) to commit a JSON file directly to your chosen repository via the GitHub API.
2. **Storage:** Links are stored as JSON files in a time-structured directory: `data/YYYY/MM/ULID.json`. 
3. **Resolution:** The `404.astro` page acts as a "Smart Resolver." It detects the storage location, fetches the raw data from GitHub's CDN, and performs the redirect.

## Resolver Flow

When someone clicks a link, the `404.astro` script executes this logic in order:

1. **Priority 1 (The Hash):** Does the URL have `#u=` and `&r=`? If yes, it fetches from that user/repo immediately. This is the "portable" version that works for any GitHub repo without registration.
2. **Priority 2 (The Prefix):** Is there a "folder" before the ID (like `/r/` or `/dl/`)? If yes, it checks `domains.json` for a matching prefix to find the repo.
3. **Priority 3 (The Default):** Is it just `domain.com/ID`? If yes, it checks `domains.json` for the entry marked `"default": true`.
4. **Fallback:** If all the above fail (or the file doesn't exist on GitHub), the system waits 5 seconds and redirects the user to the home page.

## Privacy & Security

Security is handled entirely on the client side:
* **No Backend:** Your GitHub Token never touches a third-party server.
* **Direct Communication:** The browser communicates directly with `api.github.com`.
* **Zero Trust:** It is highly recommended to protect your deployment with **Cloudflare Zero Trust** to ensure only you can access the creation interface.

## Tech Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | Astro 5.0 (TypeScript) |
| **Styling** | Tailwind CSS v4 (Alpha/Vite Engine) |
| **Icons** | Iconoir |
| **Deployment** | Cloudflare Pages |
| **Database** | GitHub Repositories (via Raw CDN) |
| **ID Strategy** | ULID (10-character Timestamp) |

## Data Structure

Links are organized to prevent GitHub directory throttling and ensure fast API lookups:

```text
repository-root/
└── data/
    └── 2026/
        └── 02/
            └── 01KGK9DBCY.json
```

**JSON Schema:**

```json
{
  "target": "https://rafifmsn.com/absolute-path",
  "repoUser": "rafifmsn",
  "repoName": "rmsn-link",
  "created": "2026-02-05T08:00:00Z"
}
```

## Setup & Configuration

## 1. Repository Setup

- Create a public GitHub repository to hold your link data.
- Configure `public/domains.json` in your Astro project:

```json
[
  {
    "prefix": "",
    "name": "Default",
    "user": "your-user",
    "repo": "your-link-repo",
    "default": true
  },
  {
    "prefix": "dl",
    "name": "Downloads",
    "user": "your-user",
    "repo": "another-repo"
  }
]
```

## 2. Deployment

- Connect your repository to Cloudflare Pages.
- Build Settings:
  - Framework: `Astro`
  - Build Command: `npm run build`
  - Output Directory: `dist`

3. Usage
- Open your deployed dashboard.
- Enter your PAT and Destination URL.
- The "Smart Match" logic automatically detects if you are using a registered repo and generates a clean URL. Otherwise, it generates a portable Hash-based URL.
