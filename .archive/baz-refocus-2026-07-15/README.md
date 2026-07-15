# BAZ Refocus — code for all 9 parts

Built from the Seth Godin inspection. One audience, one offer, one channel.
Zero dependencies (Node built-ins only).

## Run it
```bash
cd ~/baz-refocus
node server.js          # → http://localhost:4173
```
Test the permission asset:
```bash
curl -X POST localhost:4173/api/subscribe \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada","email":"ada@founder.dev","source":"test"}'
curl localhost:4173/api/subscribers
```

## The 9 parts → files
| # | Part | File |
|---|------|------|
| 1 | Smallest viable audience + single hero offer | `strategy/positioning.md`, `assets/positioning.ts` |
| 2 | Kill 80% of the menu (one hero offer) | `assets/positioning.ts` (`heroOffer.hiddenServices`), `index.html` |
| 3 | Agency or product decision | `strategy/decision.md`, `assets/positioning.ts` (`decision`) |
| 4 | Park the side projects | `strategy/parked-projects.md`, `parked.html` |
| 5 | "Intensity beats extensity" brand | `assets/positioning.ts` (`brand`), `manifesto.html` |
| 6 | Permission asset (email list) | `server.js` (`/api/subscribe`), `index.html` (#join), `data/subscribers.json` |
| 7 | Story-driven landing, no feature grid | `index.html` |
| 8 | One-channel playbook | `strategy/one-channel-playbook.md`, `playbook.html` |
| 9 | Client-success seat (the missing hire) | `roles/client-success.md` |
| 10 | Ogilvy × Godin collaboration | `strategy/ogilvy-godin.md` |
| 11 | Ogilvy brand layer (big idea, voice, 360°) | `assets/brand-system.ts` |
| 12 | 360° brand experience page | `brand.html` |
| 13 | Ogilvy creative brief | `brief.html` |

## Layout
```
baz-refocus/
├── server.js              # static + /api/subscribe (Part 6)
├── styles.css             # BAZ brand system (navy + gold)
├── index.html             # story landing + signup (Parts 2,6,7)
├── manifesto.html         # intensity beats extensity (Part 5)
├── parked.html            # focused portfolio (Part 4)
├── playbook.html          # one-channel plan (Part 8)
├── assets/positioning.ts  # GODIN layer: single source of truth (Parts 1,2,3,5)
├── assets/brand-system.ts # OGILVY layer: big idea, voice, 360° (Parts 10,11)
├── data/subscribers.json  # permission asset store (Part 6)
├── strategy/              # positioning, decision, parked, playbook, ogilvy-godin
├── roles/client-success.md# the missing seat (Part 9)
├── brand.html             # 360° brand experience (Ogilvy × Godin)
└── brief.html             # creative brief (Ogilvy)
```
