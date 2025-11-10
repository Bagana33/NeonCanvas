NeonCanvas — Quick publish guide
================================

This folder contains the static site (HTML/CSS/JS). The following files were added to help publish the project to free hosting.

Files created
- `CNAME` — placeholder for a custom domain (replace with your domain if you have one)
- `publish.sh` — quick publish script (zsh-compatible). Usage documented below.
- `README.md` — this file (instructions).

Prerequisites
- Git installed and configured (git user.email and user.name)
- A GitHub account (for GitHub Pages) or a Cloudflare account (for Cloudflare Pages) if you want a custom domain + reliable hosting
- Optional: a free domain from Freenom (e.g. .tk / .ml / .ga / .cf / .gq)

Recommended quick paths
1) Quick (no custom domain): GitHub Pages (fastest)
   - Create a new GitHub repository and push this project. See the "Quick publish" section below.
   - GitHub Pages will host at `https://<username>.github.io/<repo>/` (or at `https://<username>.github.io/` if you name your repo `<username>.github.io`).

2) Free custom domain (recommended): Freenom + Cloudflare Pages
   - Register a free domain at Freenom.
   - Add domain to Cloudflare, update Freenom nameservers to Cloudflare's.
   - Deploy to Cloudflare Pages (connect GitHub). Cloudflare will serve at your custom domain with HTTPS.

Quick publish (script)
----------------------
Make the script executable and run it. The script will initialize a git repo (if needed), create a commit, and push to a remote if you provide one.

Usage (from repository root):

```bash
# make script executable once
chmod +x publish.sh

# Option A: you already created a GitHub repo and have the remote URL
./publish.sh git@github.com:YOUR_USERNAME/YOUR_REPO.git main

# Option B: no remote yet — script will init and commit; then it prints the commands to add a remote & push
./publish.sh
```

What the script does
- git init (if no .git)
- git add --all; git commit -m "Site: initial publish"
- if a remote URL is provided as the first argument, it adds it as origin and pushes to given branch (defaults to main)
- otherwise it prints the commands you need to run to add the remote and push

CNAME (custom domain)
----------------------
If you want to use a custom domain for GitHub Pages or another host, replace the contents of `CNAME` with your domain on a single line, e.g.:

```
yourdomain.tld
```

For GitHub Pages specifically: add `CNAME` with your domain and create a DNS A/CNAME record as documented by GitHub (A records for apex domain, CNAME for www).

Cloudflare Pages and Netlify
----------------------------
- Cloudflare Pages: connect to your GitHub repo, deploy. Then add your custom domain in the Pages settings — Cloudflare will verify and issue TLS automatically if your domain is using Cloudflare nameservers.
- Netlify: connect the repo, deploy, then add custom domain and configure DNS records or delegate DNS to Netlify.

Notes / Caveats
- Freenom domains are free but sometimes unreliable (short registration term or reclaim). Consider moving to a paid domain later.
- If you use Cloudflare and point nameservers to Cloudflare, TLS and CDN are automatic.
- If you want me to prepare the repo (README, .gitignore) and create a minimal CNAME value, I can — but I cannot create a GitHub repo or change DNS for you.

Need help? Tell me:
- Which provider you prefer (GitHub Pages / Cloudflare Pages / Netlify)
- Whether you have a domain ready (if yes, paste it)

I can then provide the exact DNS records/commands and a small checklist you can follow step-by-step.