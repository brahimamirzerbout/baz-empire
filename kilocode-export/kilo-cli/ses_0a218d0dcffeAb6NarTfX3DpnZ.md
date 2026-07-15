# New session - 2026-07-13T23:54:19.811Z
- **id**: `ses_0a218d0dcffeAb6NarTfX3DpnZ`
- **agent**: code  |  **model**: {"id":"kilo-auto/free","providerID":"kilo","variant":"default"}
- **directory**: `/home/uzer`
- **project**: /home/uzer
- **created**: 2026-07-13T23:54:19.811000+00:00  |  **updated**: 2026-07-14T00:06:06.895000+00:00
- **cost**: $0.0000  |  **tokens**: in=54260 out=888 reason=836
- **messages**: 14  |  **parts**: 42  |  **todos**: 0

## Transcript

### [user] 2026-07-13T23:54:19.959000+00:00  

https://github.com/decolua/9router.git

### [assistant] 2026-07-13T23:54:20.134000+00:00  @glm-5.2

### [user] 2026-07-13T23:55:20.295000+00:00  

can we use it to have unlimited ai coding

### [user] 2026-07-13T23:59:32.764000+00:00  

check it

### [assistant] 2026-07-13T23:59:32.869000+00:00  @kilo-auto/free


> _reasoning_: The user is asking about a GitHub repository (decolua/9router) and wants to know if it can be used for "unlimited AI coding". They want me to check it.

Let me fetch the repository to understand what it is.

**tool `webfetch`** error
```input
{
  "url": "https://github.com/decolua/9router"
}
```
```output

```


### [assistant] 2026-07-14T00:00:10.820000+00:00  @kilo-auto/free


> _reasoning_: The webfetch timed out. Let me try using the GitHub API or a different approach. Let me try using bash with git clone or curl to get the README.

**tool `bash`** completed
```input
{
  "command": "curl -s -L \"https://raw.githubusercontent.com/decolua/9router/main/README.md\" 2>/dev/null | head -200",
  "description": "Fetch README from 9router repo",
  "timeout": 30000
}
```
```output
404: Not Found
```


### [assistant] 2026-07-14T00:00:19.087000+00:00  @kilo-auto/free


> _reasoning_: Let me try to get the repo info using the GitHub API.

**tool `bash`** completed
```input
{
  "command": "curl -s \"https://api.github.com/repos/decolua/9router\" 2>/dev/null",
  "description": "Fetch repo info via GitHub API",
  "timeout": 30000
}
```
```output
{
  "id": 1128025899,
  "node_id": "R_kgDOQzxPKw",
  "name": "9router",
  "full_name": "decolua/9router",
  "private": false,
  "owner": {
    "login": "decolua",
    "id": 8282593,
    "node_id": "MDQ6VXNlcjgyODI1OTM=",
    "avatar_url": "https://avatars.githubusercontent.com/u/8282593?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/decolua",
    "html_url": "https://github.com/decolua",
    "followers_url": "https://api.github.com/users/decolua/followers",
    "following_url": "https://api.github.com/users/decolua/following{/other_user}",
    "gists_url": "https://api.github.com/users/decolua/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/decolua/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/decolua/subscriptions",
    "organizations_url": "https://api.github.com/users/decolua/orgs",
    "repos_url": "https://api.github.com/users/decolua/repos",
    "events_url": "https://api.github.com/users/decolua/events{/privacy}",
    "received_events_url": "https://api.github.com/users/decolua/received_events",
    "type": "User",
    "user_view_type": "public",
    "site_admin": false
  },
  "html_url": "https://github.com/decolua/9router",
  "description": "Unlimited FREE AI coding. Connect Claude Code, Codex, Cursor, Cline, Copilot, Antigravity to FREE Claude/GPT/Gemini via 40+ providers. Auto-fallback, RTK -40% tokens, never hit limits.",
  "fork": false,
  "url": "https://api.github.com/repos/decolua/9rou
... [+4528 chars truncated]
```


### [assistant] 2026-07-14T00:00:23.625000+00:00  @kilo-auto/free


> _reasoning_: I now have the basic repo info. Let me fetch the README and maybe some key files to understand what it does and whether it's legitimate/safe. Let me try different branches or paths for the README.

**tool `bash`** completed
```input
{
  "command": "curl -s -L \"https://raw.githubusercontent.com/decolua/9router/master/README.md\" 2>/dev/null | head -300",
  "description": "Fetch README from master branch",
  "timeout": 30000
}
```
```output
<div align="center">
  <img src="./images/9router.png?1" alt="9Router Dashboard" width="800"/>
  
  # 9Router - FREE AI Router & Token Saver
  
  **Never stop coding. Save 20-40% tokens with RTK + auto-fallback to FREE & cheap AI models.**
  
  **Connect All AI Code Tools (Claude Code, Cursor, Antigravity, Copilot, Codex, Gemini, OpenCode, Cline, OpenClaw...) to 40+ AI Providers & 100+ Models.**
  
  [![npm](https://img.shields.io/npm/v/9router.svg)](https://www.npmjs.com/package/9router)
  [![Downloads](https://img.shields.io/npm/dm/9router.svg)](https://www.npmjs.com/package/9router)
  [![Docker Pulls](https://img.shields.io/docker/pulls/decolua/9router.svg?logo=docker&label=Docker%20pulls)](https://hub.docker.com/r/decolua/9router)
  [![GHCR](https://img.shields.io/badge/GHCR-decolua%2F9router-blue?logo=github)](https://github.com/decolua/9router/pkgs/container/9router)
  [![License](https://img.shields.io/npm/l/9router.svg)](https://github.com/decolua/9router/blob/main/LICENSE)

<a href="https://trendshift.io/repositories/22628" target="_blank"><img src="https://trendshift.io/api/badge/repositories/22628" alt="decolua%2F9router | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/></a>

[🚀 Quick Start](#-quick-start) • [💡 Features](#-key-features) • [📖 Setup](#-setup-guide) • [🌐 Website](https://9router.com)

[🇻🇳 Tiếng Việt](./i18n/README.vi.md) • [🇨🇳 中文](./i18n/README.zh-CN.md) • [🇯🇵 日本語](./i18n/README.ja-JP.md) • [🇷🇺 Русский](./i18n/README.ru.md)

<
... [+9709 chars truncated]
```

**tool `bash`** completed
```input
{
  "command": "curl -s -L \"https://raw.githubusercontent.com/decolua/9router/main/README.md\" 2>/dev/null | head -300",
  "description": "Fetch README from main branch",
  "timeout": 30000
}
```
```output
404: Not Found
```


### [assistant] 2026-07-14T00:00:32.974000+00:00  @kilo-auto/free


> _reasoning_: I have enough information now. Let me also look at the package.json or some code to understand the architecture better, particularly around how it works with providers and any security concerns.

**tool `bash`** completed
```input
{
  "command": "curl -s \"https://api.github.com/repos/decolua/9router/contents/\" 2>/dev/null | head -100",
  "description": "List root files in repo",
  "timeout": 30000
}
```
```output
[
  {
    "name": ".dockerignore",
    "path": ".dockerignore",
    "sha": "5b921cd983cbbe568c02afb3da0e9fa6e2585bc2",
    "size": 374,
    "url": "https://api.github.com/repos/decolua/9router/contents/.dockerignore?ref=master",
    "html_url": "https://github.com/decolua/9router/blob/master/.dockerignore",
    "git_url": "https://api.github.com/repos/decolua/9router/git/blobs/5b921cd983cbbe568c02afb3da0e9fa6e2585bc2",
    "download_url": "https://raw.githubusercontent.com/decolua/9router/master/.dockerignore",
    "type": "file",
    "_links": {
      "self": "https://api.github.com/repos/decolua/9router/contents/.dockerignore?ref=master",
      "git": "https://api.github.com/repos/decolua/9router/git/blobs/5b921cd983cbbe568c02afb3da0e9fa6e2585bc2",
      "html": "https://github.com/decolua/9router/blob/master/.dockerignore"
    }
  },
  {
    "name": ".env.example",
    "path": ".env.example",
    "sha": "6ed8f81e868c0d9456be98f8f866dd8255ba196f",
    "size": 1328,
    "url": "https://api.github.com/repos/decolua/9router/contents/.env.example?ref=master",
    "html_url": "https://github.com/decolua/9router/blob/master/.env.example",
    "git_url": "https://api.github.com/repos/decolua/9router/git/blobs/6ed8f81e868c0d9456be98f8f866dd8255ba196f",
    "download_url": "https://raw.githubusercontent.com/decolua/9router/master/.env.example",
    "type": "file",
    "_links": {
      "self": "https://api.github.com/repos/decolua/9router/contents/.env.example?ref=master",
      "gi
... [+3382 chars truncated]
```


### [assistant] 2026-07-14T00:00:47.512000+00:00  @kilo-auto/free


> _reasoning_: I have enough information to provide a useful answer. Let me summarize what I've found:

1. **9Router** is an open-source (MIT licensed) project by `decolua` with 22,065 stars and 3,729 forks.
2. It's a local proxy/router for AI APIs, written in JavaScript/Node.js.
3. It connects AI coding tools (Claude Code, Cursor, Cline, Copilot, Codex, etc.) to 40+ AI providers.
4. Key features: RTK Token Saver, auto-fallback between providers, multi-account round-robin.
5. The project is public and open source, but the actual `9router-app` package is private (mentioned in README).
6. It runs locally on `localhost:20128` as a proxy.

This is NOT "unlimited free AI coding" in the sense of breaking into systems. It's a legitimate open-source tool that:
- Acts as a local API proxy/router
- Helps manage multiple AI provider accounts
- Compresses tokens to save costs
- Falls back to cheaper/free providers when paid quotas run out
- Provides an OpenAI-compatible API endpoint

It's essentially a smart local proxy with account management and token optimization. The "unlimited" claim comes from rotating between multiple free-tier accounts across providers, not from exploiting anything.

I should give a concise answer about what it actually is and whether it works for "unlimited" coding.

This is a **local AI API proxy/router** (MIT license, 22k+ stars). It is not a hack or exploit — it works by:

1. Running a local server (`localhost:20128`) that proxies requests from your coding tools (Claude Code, Cursor, Copilot, etc.) to 40+ AI providers
2. **Auto-fallback** between your own accounts (subscription → cheap → free tiers) when limits hit
3. **RTK Token Saver** compressing tool outputs to cut token usage 20-40%
4. **Multi-account rotation** so you can chain multiple free-tier accounts across providers

Can it give you "unlimited" AI coding?

**Yes, effectively — but not by magic.** The "unlimited" claim comes from rotating across many free-tier accounts (Kiro, OpenCode Free, Vertex free credits, etc.) and never exhausting a single quota. It does not break provider terms or grant free access to paid models.

**Caveats:**
- You still need valid accounts/keys for the providers you use
- Free tiers have real rate limits; "unlimited" depends on how many free accounts you can maintain
- It runs locally and stores credentials — review the code before using with paid keys
- The actual commercial app (`9router-app`) is private; the repo is the open-source proxy core

If you want, I can clone the repo and review the code for security/risks.


### [user] 2026-07-14T00:03:53.009000+00:00  

npm i -g cline

### [assistant] 2026-07-14T00:03:53.172000+00:00  @kilo-auto/free


> _reasoning_: The user just ran a command to install Cline globally with npm. They didn't ask a question, but based on the previous conversation about 9router, they might be trying to set up the workflow. The command output isn't shown, so I don't know if it succeeded or failed. I should check if the installation worked and provide relevant next steps or information about using Cline.

**tool `bash`** completed
```input
{
  "command": "which cline && cline --version",
  "description": "Check if Cline installed successfully"
}
```
```output
(no output)
```


### [assistant] 2026-07-14T00:05:53.086000+00:00  @kilo-auto/free


> _reasoning_: The user ran `npm i -g cline` but didn't provide the output. I checked if it installed, but `which cline` returned nothing and `cline --version` also produced no output. This could mean:
1. The command is still running or hasn't finished
2. It failed silently
3. The binary is named differently or installed in a non-standard location

Let me check npm global install location and list recently installed packages to verify.

**tool `bash`** completed
```input
{
  "command": "npm list -g --depth=0 2>/dev/null | grep -i cline",
  "description": "Check if Cline is in global npm packages"
}
```
```output
(no output)
```

**tool `bash`** completed
```input
{
  "command": "npm config get prefix && ls -la \"$(npm config get prefix)/bin/\" 2>/dev/null | grep -i cline",
  "description": "Check npm bin directory for cline"
}
```
```output
/home/uzer/.local/share/fnm/node-versions/v22.23.0/installation

```


### [assistant] 2026-07-14T00:06:01.699000+00:00  @kilo-auto/free


> _reasoning_: Cline is not installed globally. The user ran `npm i -g cline` but it didn't complete or failed. I should inform them and help troubleshoot. Since they didn't ask a specific question, I should check if there was an error or if the command is still running. Actually, looking at the conversation, the user just pasted the command without context. I should let them know it doesn't appear to be installed and offer to help run it again or check for errors.

Cline does not appear to be installed. The previous `npm i -g cline` command either failed or did not complete successfully.

To troubleshoot, run:
```bash
npm install -g cline
```

If it fails, share the error output and I can help resolve it.

