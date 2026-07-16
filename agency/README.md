# 🚀 Marketing Agency Workstation — Quick Reference

## Run Setup First
```bash
sudo bash ~/agency-setup.sh
source ~/.bash_aliases
```

---

## 📁 Directory Structure
```
~/agency/
├── clients/           # Client workspaces
│   └── _example-client/
│       ├── briefs/    # Client briefs
│       ├── assets/    # Client assets
│       ├── reports/   # Client reports
│       ├── approvals/ # Approval docs
│       └── site/      # Client website files
├── templates/         # Reusable templates
│   ├── proposals/     # Proposal & brief templates
│   ├── reports/       # Monthly report template
│   └── social-media/  # Content calendar template
├── scripts/           # Automation scripts
│   ├── seo/           # SEO audit & recon tools
│   ├── social/        # Content generator
│   ├── content/       # Email campaign builder
│   ├── analytics/     # Lighthouse, competitor, tracker
│   └── deployment/    # Site deploy script
├── assets/            # Shared agency assets
│   ├── fonts/
│   ├── images/
│   ├── icons/
│   ├── logos/
│   ├── videos/
│   └── stock/
├── reports/           # All reports
│   ├── monthly/
│   ├── weekly/
│   └── ad-hoc/
├── config/            # Config files
└── notes/             # Quick notes
```

---

## 🛠️ Tools & Commands

### Client Management
| Command | What it does |
|---------|-------------|
| `newclient <name>` | Create a new client workspace |
| `client <name>` | Jump to client directory |
| `agency-status` | Show agency overview |
| `invoice <num> <client>` | Generate invoice template |

### SEO & Web Analysis
| Command | What it does |
|---------|-------------|
| `seo-audit <url>` | Full SEO audit of a website |
| `recon <domain>` | Domain OSINT & recon |
| `recon <domain> --full` | Full recon with subdomains & ports |
| `lh-check <url>` | Lighthouse performance audit |
| `lh-check <url> --benchmark` | Run 3 audits and average scores |
| `competitor <your-url> <comp1> [comp2...]` | Compare your site vs competitors |

### Content & Social
| Command | What it does |
|---------|-------------|
| `content "topic"` | Generate Instagram posts |
| `content "topic" -p twitter` | Generate Twitter posts |
| `content "topic" -p linkedin -n 10` | Generate 10 LinkedIn posts |
| `content "topic" --calendar` | Generate weekly content calendar |
| `content "topic" --all` | Generate for all platforms |
| `content "topic" -j` | Output as JSON |

### Email Campaigns
| Command | What it does |
|---------|-------------|
| `email-camp "product"` | Generate cold outreach emails |
| `email-camp "product" -t newsletter` | Newsletter template |
| `email-camp "product" -t promo -a ecommerce` | Promo for e-commerce |
| `email-camp "product" -t welcome` | Welcome email series |
| `email-camp "product" -t follow_up` | Follow-up sequence |

### Project Tracker
| Command | What it does |
|---------|-------------|
| `task-add <client> <task>` | Add a task |
| `task-add <client> <task> -p HIGH` | Add high-priority task |
| `tasks` | List all tasks |
| `tasks --client <name>` | Filter by client |
| `task-done <id>` | Complete a task |
| `tracker start <id>` | Move task to in-progress |
| `task-report` | Generate status report |

### Deployment
| Command | What it does |
|---------|-------------|
| `deploy <client>` | Deploy client site to local nginx |
| `deploy <client> --surge` | Deploy to surge.sh (free hosting) |

### Quick Notes
| Command | What it does |
|---------|-------------|
| `note "Meeting with John"` | Add timestamped note |

---

## 🖥️ Local Dev Server
- **Local site:** http://localhost:8080
- **Client site:** http://localhost:8080/clientname/
- **Nginx config:** /etc/nginx/sites-available/agency-local
- **Web root:** /var/www/agency/local/public/

---

## 📦 Installed Software (after setup)
| Category | Tools |
|----------|-------|
| **Design** | GIMP, Inkscape, Kdenlive, ImageMagick |
| **Office** | LibreOffice, Pandoc |
| **SEO** | Lighthouse, custom audit scripts |
| **Dev** | Node 24, Python 3.13, nginx, Git |
| **Browser** | Chromium + Firefox |
| **Automation** | Playwright (Python), Selenium drivers |
| **Hosting** | nginx (local), surge.sh (free hosting) |

---

## 💡 Tips
1. **New client?** Run `newclient <name>` — it creates the whole folder structure
2. **Need to demo a site?** Run `deploy <client> --surge` for instant free hosting
3. **Content ideas?** Run `content "<topic>" --calendar` for a week of posts
4. **Competitor research?** Run `competitor <your-url> <their-url>` for side-by-side comparison
5. **Track everything** — use `task-add` and `task-report` to stay organized