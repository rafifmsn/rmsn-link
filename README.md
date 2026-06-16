# RMSN-Link

A high-performance, serverless, and completely free link shortener built using Astro 6, Tailwind CSS v4, and GitHub repo as the database. This project is designed for users who want 100% control over their data with zero hosting costs.

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

This project is built on a "Local-First" security model. Since there is no database or backend server, your credentials and data remain under your direct control.

### GitHub Token Protection
Your GitHub Personal Access Token (PAT) is the key to your "database." To protect it from casual exposure, we implement a **Symmetric XOR Obfuscation** layer:

* **Static Key Obfuscation:** The script uses an internal `OBS_KEY` constant which serves as the "password" for both the encryption and decryption processes.
* **XOR Operation:** This is a bitwise operation where each character of your token is shifted against a corresponding character in the key. It is computationally inexpensive and perfectly reversible.
* **Base64 Wrapper:** After the XOR shift, the resulting string is wrapped in `btoa()` (Base64). This ensures the scrambled data is stored as a stable ASCII string safe to persist in the browser (we store it encrypted in IndexedDB).
* **Deterministic Flow:** This process is strictly deterministic—the same token always produces the same encrypted string, allowing for seamless retrieval without a backend.

**Logic Flow:**
* **Storage:** `Token` + `Static Key` → `XOR Bitshift` → `Base64 Encode` → `IndexedDB` (encrypted).
* **Retrieval:** `IndexedDB` → `Base64 Decode` → `XOR Bitshift` (with same Key) → `Original Token`.

* **Clearing Saved Token:** To remove a previously saved token from the browser, use the trash icon next to the Token field in the dashboard — this clears the stored token from IndexedDB.

### Why This Matters for Static Apps
In a pure frontend environment (Astro/Static HTML), true "unbreakable" encryption is impossible because the "lock" and the "key" are both delivered to the user's browser. However, this method provides a solid defense against:
* **Malicious Extensions:** Many browser extensions scan local storage for strings starting with `ghp_` (the standard GitHub prefix). By obfuscating it, that signature disappears.
* **Shoulder Surfing:** If someone views your browser's DevTools, they see a scrambled Base64 string instead of your actual credential.
* **Accidental Leaks:** If you share a screenshot of your local storage for debugging, your token remains hidden.

### Infrastructure Security
* **No Middleman:** Your token never touches a third-party server. The browser communicates directly with `api.github.com`.
* **Zero Trust:** For maximum security, it is **highly recommended** to protect your deployment with **Cloudflare Zero Trust**. This ensures that even with obfuscation, the dashboard interface is only accessible by authorized users.

## Tech Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | Astro 6.1.5 (TypeScript) |
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
