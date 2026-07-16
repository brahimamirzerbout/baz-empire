# 🏢 Agency Operations Manual

## How We Make Money

**We sell marketing outcomes, not tools.** QrCreator is one weapon in our arsenal.

## The Funnel: How QR Becomes Revenue

```
🆓 FREE QR CODE (hook)
        ↓
 💎 Branded QR page (5,000 DZD)
        ↓
 📱 Social media management (10,000+ DZD/mo)
        ↓
 📈 Full marketing retainer (25,000+ DZD/mo)
```

## Sales Conversation Flow

### 1. Lead comes in (Instagram, referral, walk-in)
```
"We noticed your restaurant doesn't have a digital menu.
 We can set one up for you in 24 hours — for free."
```

### 2. They try it → They love it → Upsell
```
"Great, your QR menu is live! Want us to:
 • Match it to your brand colors? (5,000 DZD)
 • Add an ordering system? (10,000 DZD)
 • Run your Instagram for the month? (15,000 DZD)"
```

### 3. Monthly retainer
```
"For 25,000 DZD/month, we handle:
 • QR menu updates
 • 12 Instagram posts
 • 4 Facebook posts
 • Monthly analytics report
 • Google My Business optimization"
```

## Service Pricing Quick Reference

| Service | One-Time | Monthly Retainer |
|---------|----------|-----------------|
| QR Solution | 5K–30K DZD | 5K DZD/mo |
| Web Design | 15K–80K DZD | 10K DZD/mo |
| SEO | 10K–50K DZD | 15K DZD/mo |
| Social Media | 10K–35K DZD | 15K DZD/mo |
| Branding | 10K–50K DZD | 5K DZD/mo |
| Content | 5K–30K DZD | 10K DZD/mo |
| Email Marketing | 8K–40K DZD | 12K DZD/mo |
| **Full Stack** | **30K–120K DZD** | **50K DZD/mo** |

## Tools We Use

| Purpose | Tool | Location |
|---------|------|----------|
| QR Platform | QrCreator | ~/Projects/QuickQr |
| SEO Audit | seo-audit.sh | ~/agency/scripts/seo/ |
| Competitor Analysis | competitor-analysis.py | ~/agency/scripts/analytics/ |
| Lighthouse | lh-check.py | ~/agency/scripts/analytics/ |
| Content Generator | content-gen.py | ~/agency/scripts/social/ |
| Email Campaigns | email-campaign.py | ~/agency/scripts/content/ |
| Project Tracker | tracker.py | ~/agency/scripts/analytics/ |
| Pipeline Manager | pipeline.py | ~/agency/operations/ |
| Pricing Calculator | price.py | ~/agency/operations/ |
| Design | GIMP + Inkscape | Installed (run agency-setup.sh) |
| Dev Server | nginx | localhost:8080 |

## Quick Commands

```bash
# Pipeline
python3 ~/agency/operations/pipeline.py add "Restaurant Le Jardin" qr-solution --value 15000 --source instagram
python3 ~/agency/operations/pipeline.py list
python3 ~/agency/operations/pipeline.py advance 1
python3 ~/agency/operations/pipeline.py report

# Pricing
python3 ~/agency/operations/price.py calc --service qr-solution --scope medium --client smb
python3 ~/agency/operations/price.py calc --service full-stack --scope large --client enterprise
python3 ~/agency/operations/price.py list

# Tasks
task-add "restaurant-le-jardin" "Create QR menu" -p HIGH
task-add "restaurant-le-jardin" "Set up Instagram" -p MED

# Content
content "menu restaurant numérique" -p instagram --calendar
content "QR code vitrine business" -p linkedin -n 5

# SEO
seo-audit https://client-site.com
competitor https://qrcreator.xyz https://competitor1.com https://competitor2.com
recon client-domain.com
```