# ============================================================
# Marketing Agency Bash Aliases & Functions
# ============================================================

# --- Agency Directory Shortcuts ---
alias agency='cd ~/agency'
alias clients='cd ~/agency/clients'
alias services='cd ~/agency/services'
alias reports='cd ~/agency/reports'
alias pipeline='cd ~/agency/operations'
alias qr='cd ~/agency/services/qr-solutions && cd ~/Projects/QuickQr 2>/dev/null || cd ~/Projects/QuickQr'

# --- Quick Client Access ---
client() {
    cd ~/agency/clients/"$1" 2>/dev/null || {
        mkdir -p ~/agency/clients/"$1"/{briefs,campaigns,assets,deliverables,reports}
        cd ~/agency/clients/"$1"
        echo "✅ Created client workspace: $1"
    }
}
complete -W "$(ls ~/agency/clients/ 2>/dev/null)" client

# --- New Client (with full brief) ---
newclient() {
    local name="${1:?Usage: newclient <client-name>}"
    mkdir -p ~/agency/clients/"$name"/{briefs,campaigns,assets,deliverables,reports}
    cp ~/agency/templates/proposals/agency-client-brief.md ~/agency/clients/"$name"/briefs/brief.md
    echo "# $name — Agency Workspace" > ~/agency/clients/"$name"/notes.md
    echo "✅ Client '$name' created at ~/agency/clients/$name"
    cd ~/agency/clients/"$name"
}

# --- Pipeline (Sales) ---
alias pipe='python3 ~/agency/operations/pipeline.py'
alias pipe-add='python3 ~/agency/operations/pipeline.py add'
alias pipe-list='python3 ~/agency/operations/pipeline.py list'
alias pipe-advance='python3 ~/agency/operations/pipeline.py advance'
alias pipe-report='python3 ~/agency/operations/pipeline.py report'

# --- Pricing ---
alias price='python3 ~/agency/operations/price.py'
alias price-list='python3 ~/agency/operations/price.py list'
alias price-qr='python3 ~/agency/operations/price.py calc --service qr-solution'
alias price-full='python3 ~/agency/operations/price.py calc --service full-stack'

# --- SEO & Web Tools ---
alias seo-audit='bash ~/agency/scripts/seo/seo-audit.sh'
alias recon='python3 ~/agency/scripts/seo/recon.py'
alias lh-check='python3 ~/agency/scripts/analytics/lh-check.py'
alias competitor='python3 ~/agency/scripts/analytics/competitor-analysis.py'

# --- Content & Social ---
alias content='python3 ~/agency/scripts/social/content-gen.py'
alias email-camp='python3 ~/agency/scripts/content/email-campaign.py'

# --- Project Tracker ---
alias tracker='python3 ~/agency/scripts/analytics/tracker.py'
alias tasks='python3 ~/agency/scripts/analytics/tracker.py list'
alias task-add='python3 ~/agency/scripts/analytics/tracker.py add'
alias task-done='python3 ~/agency/scripts/analytics/tracker.py done'
alias task-report='python3 ~/agency/scripts/analytics/tracker.py report'

# --- Deployment ---
alias deploy='bash ~/agency/scripts/deployment/deploy.sh'

# --- Quick Serve ---
alias serve='python3 -m http.server 8080'
alias serve-client='python3 -m http.server 8080 --directory'

# --- Nginx ---
alias nginx-start='sudo systemctl start nginx'
alias nginx-stop='sudo systemctl stop nginx'
alias nginx-restart='sudo systemctl restart nginx'
alias nginx-status='sudo systemctl status nginx'
alias nginx-logs='sudo tail -f /var/log/nginx/error.log'

# --- Git ---
alias gs='git status'
alias ga='git add'
alias gc='git commit -m'
alias gp='git push'
alias gl='git log --oneline -10'
alias gd='git diff'

# --- Quick Notes ---
note() {
    local notefile=~/agency/notes/"$(date +%Y-%m-%d).md"
    mkdir -p ~/agency/notes
    echo "## $(date +%H:%M) — $1" >> "$notefile"
    echo "Note added to $notefile"
}

# --- Agency Status ---
agency-status() {
    echo "📊 Agency Status"
    echo "================"
    echo "Clients:     $(ls ~/agency/clients/ 2>/dev/null | grep -v _example | grep -v qrcreator | wc -l) active"
    echo "Tasks:       $(python3 ~/agency/scripts/analytics/tracker.py list 2>/dev/null | grep -c TODO || echo 0)"
    echo "Reports:     $(ls ~/agency/reports/ 2>/dev/null | wc -l)"
    echo "Disk:        $(du -sh ~/agency 2>/dev/null | cut -f1)"
    echo ""
    echo "🔗 QR Platform: ~/Projects/QuickQr"
    echo "   Status: $(cd ~/Projects/QuickQr 2>/dev/null && git status --short | head -3 || echo 'Not checked')"
    echo ""
    echo "Recent clients:"
    ls -1t ~/agency/clients/ 2>/dev/null | head -5
}

# --- Generate Invoice ---
invoice() {
    local num="${1:?Usage: invoice <number> <client> <amount>}"
    local client="${2:-client}"
    local amount="${3:-0}"
    local date=$(date +%Y-%m-%d)
    local due=$(date -d "+30 days" +%Y-%m-%d)
    local file=~/agency/clients/$client/invoices/INV-$num.md
    mkdir -p ~/agency/clients/$client/invoices
    cat > "$file" << INV
# INVOICE #$num
**Date:** $date
**Client:** $client
**Due:** $due

| Description | Qty | Rate | Amount |
|-------------|-----|------|--------|
| Marketing services | 1 | $amount DZD | $amount DZD |

**Subtotal:** $amount DZD
**Total:** $amount DZD

**Payment terms:** Net 30
**Payment method:** CCP / BaridiMob
INV
    echo "✅ Invoice created: $file"
}

# --- Quick Proposal ---
propose() {
    local client="${1:?Usage: propose <client>}"
    local service="${2:-full-stack}"
    local date=$(date +%Y-%m-%d)
    local file=~/agency/clients/$client/proposals/proposal-$date.md
    mkdir -p ~/agency/clients/$client/proposals
    cp ~/agency/templates/proposals/proposal-template.md "$file"
    echo "✅ Proposal template created: $file"
    echo "   Edit it: nano $file"
}

# --- Color prompt ---
export PS1='\[\033[01;31m\]☠\[\033[01;34m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '

# --- History ---
export HISTSIZE=10000
export HISTFILESIZE=20000
export HISTCONTROL=ignoreboth:erasedups
export HISTIGNORE="ls:ll:cd:pwd:exit:clear:history"
export HISTTIMEFORMAT="%F %T "

# --- Path ---
export PATH="$PATH:/usr/local/bin:/opt/bin"

echo "🚀 Agency loaded! Type 'agency-status' for overview."