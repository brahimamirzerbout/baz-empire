# 🌐 Zerbout Digital — Agency Website

## What This Is

A complete, production-ready marketing agency website designed to **dominate the Algerian market** by exploiting every gap we found in the competitive intelligence:

### Competitive Advantages Built In

| Feature | Why It Works | Based On |
|---------|-------------|-----------|
| **QR-first positioning** | 0/27 competitors offer this | Full competitive analysis |
| **Published pricing** | Only 1/27 agencies shows prices | Diamond Agency charges 20K-80K DA |
| **Free tier** | Nobody offers free entry | We hook with free QR |
| **FR/AR bilingual** | Most agencies are French-only | Only FAN + KYO offer Arabic |
| **24h delivery** | Others take 2-4 weeks | All competitors are slow |
| **Restaurant specialization** | ATAKOR mentions restaurants but no QR | Gap in the market |
| **NFC cards** | Nobody in Algeria sells these | Zero competition |
| **Competitor comparison table** | Shows exactly how we beat each agency | Intelligence report |

### Strategy Applied from Each Competitor

| We Learned From | What We Copied | What We Improved |
|---------------|----------------|------------------|
| **KYO Conseil** | Inbound methodology language | Made it simpler, faster, cheaper |
| **HiveDigit** | "Partner" positioning + AI mentions | Added actual AI (QrCreator) |
| **FAN Advertising** | Full-service positioning + dual social media | Made it focused (QR → upsell) |
| **ATAKOR** | Restaurant vertical + 29 years credibility | We're faster and cheaper |
| **SHIFTIN** | Tech-forward language + impressive clients | We have a platform, they have hours |
| **Diamond** | Published pricing (20K-80K DA) | We beat their prices |
| **ADS Media** | ROI language + Google Ads positioning | We drive organic + QR traffic |

### Target Market Positioning

The site specifically targets:
- **Restaurants & cafés** — the underserved market (ATAKOR mentions them but offers no QR)
- **Retail shops** — need vitrines (nobody specializes)
- **Service businesses** — need online presence (most agencies ignore SMBs)
- **Event organizers** — need QR tickets/invitations (nobody does this)
- **Independent professionals** — need digital business cards (NFC + QR)

### Pricing Strategy

| Plan | Price | What It Beats | Strategy |
|------|-------|---------------|----------|
| **Free** | 0 DA | Everyone | Hook — prove value, then upsell |
| **QR Starter** | 5,000 DA | Diamond's 20,000 DA | 4x cheaper than cheapest competitor |
| **Croissance** | 25,000 DA/mo | KYO's ~50,000 DA/mo | Half the price, more specific |
| **Premium** | 50,000 DA/mo | KYO's ~100,000 DA/mo | Half the price with QR included |

## Files

- `index.html` — Complete responsive website (FR/AR bilingual)
- `public/favicon.svg` — Brand favicon (QR code icon)

## How to View

```bash
cd ~/agency/clients/agency-site
python3 -m http.server 8080
# Open http://localhost:8080
```

## How to Deploy

### Option 1: nginx (already configured on this machine)
```bash
sudo cp -r ~/agency/clients/agency-site/public/* /var/www/agency/local/public/
# Already serves at http://localhost:8080
```

### Option 2: Surge.sh (free, instant)
```bash
npm install -g surge
cd ~/agency/clients/agency-site
surge . zerbout-digital.surge.sh
```

### Option 3: Connect to QrCreator
Add a link from QrCreator's landing page to this agency site, and vice versa.

## Key Differentiators Written Into the Copy

1. **"Agence #1 en QR Marketing en Algérie"** — claim the position
2. **"0 agences concurrentes offrent ceci"** — the QR gap, proven by our research
3. **"1 agence sur 27 affiche ses prix"** — transparency as competitive advantage
4. **"24h" vs "2-4 semaines"** — speed kills competitors
5. **"À partir de 5 000 DA"** — beats Diamond's 20,000 DA entry point
6. **"Gratuit"** — nobody else offers free

## Next Steps

1. Replace placeholder phone numbers with real ones
2. Add real contact form backend (Formspree/Netlify Forms)
3. Add Google Analytics + Search Console
4. Add real client testimonials
5. Add portfolio/case studies
6. Connect to QrCreator as the QR platform
7. Set up email (contact@zerbout.digital)
8. Add social media links (Facebook, Instagram, TikTok)
9. Create the French blog content from the SEO strategy doc
10. Add hreflang tags for FR/AR SEO