---
name: create-pr
description: Use when the user wants to create a pull request. Generates a GitHub PR creation URL with title and description pre-filled based on recent commits.
---

# Create Pull Request URL

Generate a GitHub PR creation URL from the current branch.

## Steps

1. Run the following commands to gather info:
   - `git remote get-url origin` — get repo URL
   - `git branch --show-current` — get current branch name
   - `git log origin/main..HEAD --oneline` — list commits to include in the PR

2. Construct the GitHub PR URL with title and body as query parameters so the user can open it on mobile and create the PR with one click:
   ```
   https://github.com/{owner}/{repo}/compare/{branch}?expand=1&title={title}&body={body}
   ```
   - Extract `{owner}` and `{repo}` from the remote URL (strip `.git` suffix if present).
   - URL-encode both `{title}` and `{body}` (spaces → `%20`, newlines → `%0A`, `#` → `%23`, etc.).

3. Based on the commits, write:
   - **Title**: short summary of the changes (under 70 chars)
   - **Description**: bullet points of what changed and why

4. Present to the user:
   - The clickable one-click PR creation URL (with title and body embedded as query parameters)
   - The PR title and description in plain text for reference
   - Write the description in the same language as the current conversation
