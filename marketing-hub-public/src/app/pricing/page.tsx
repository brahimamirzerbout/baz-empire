export default function PricingPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* HERO */}
      <section className="text-center">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Pricing
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.95]">
          One workspace.{" "}
          <span className="bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent">
            One number.
          </span>
        </h1>
        <p className="text-base md:text-lg text-slate-600 dark:text-zinc-300 mt-3 max-w-2xl mx-auto">
          The full marketing hub your team needs to win — strategy, content, CRM, intelligence,
          studio. Pay monthly. Cancel anytime. Sovereign to your machine either way.
        </p>

        {/* MONEY-BACK GUARANTEE — prominent, above the fold */}
        <div className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-50 border-2 border-emerald-300 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-emerald-500 grid place-items-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <div className="font-bold text-emerald-900 text-sm">30-day money-back guarantee</div>
            <div className="text-xs text-emerald-700">
              No questions. No friction. Cancel anytime — keep your data.
            </div>
          </div>
        </div>
      </section>

      {/* TIERS — with value-stack */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Tier
          name="Free"
          price="$0"
          cadence="forever"
          blurb="Solo marketers. Single workspace. All core features."
          stack={[
            { label: "1 workspace", value: "$30/mo if bought alone" },
            { label: "100 contacts · 50 deals", value: "$20/mo in CRM" },
            { label: "11 Nova formulas", value: "$50/mo as a course" },
            { label: "26 + 14 marketing formulas", value: "$100/mo as a library" },
            { label: "Studio Pro (visual canvas)", value: "$40/mo" },
            { label: "The Wire (daily intel)", value: "$30/mo" },
            { label: "Limited API access", value: "$0 (capped)" },
          ]}
          missing={[
            "Email delivery",
            "Webhook delivery",
            "Embeddable forms",
            "Custom domains",
            "Full API + webhooks",
            "Team members",
          ]}
          cta="Start free"
          href="/setup"
          highlight={false}
        />
        <Tier
          name="Pro"
          price="$99"
          cadence="/month"
          blurb="For marketers who want leverage. Full automation + integrations."
          stack={[
            { label: "Everything in Free", value: "$270/mo stack" },
            { label: "10,000 contacts · 5,000 deals", value: "$100/mo" },
            { label: "Email + webhook delivery", value: "$80/mo" },
            { label: "Embeddable forms runtime", value: "$60/mo" },
            { label: "Custom domains", value: "$30/mo" },
            { label: "Full API + webhooks", value: "$50/mo" },
            { label: "Team members (up to 10)", value: "$40/mo" },
          ]}
          missing={["Multi-workspace", "White-label", "ABM scale"]}
          cta="Start Pro · $99/mo"
          href="/billing?plan=pro"
          highlight
        />
        <Tier
          name="Agency"
          price="$299"
          cadence="/month"
          blurb="For agencies. White-label client portals, multi-tenant, premium support."
          stack={[
            { label: "Everything in Pro", value: "$630/mo stack" },
            { label: "100,000 contacts · 50,000 deals", value: "$300/mo" },
            { label: "Up to 10 workspaces (multi-tenant)", value: "$200/mo" },
            { label: "White-label public site", value: "$100/mo" },
            { label: "Multi-account ABM", value: "$150/mo" },
            { label: "Sales sequences at scale", value: "$80/mo" },
            { label: "Premium support + onboarding", value: "$200/mo" },
          ]}
          missing={[]}
          cta="Talk to us · $299/mo"
          href="/billing?plan=agency"
          highlight={false}
        />
      </section>

      {/* VALUE-STACK SUMMARY (Hormozi lens) */}
      <section className="card card-pad card-lift space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3 className="font-bold text-lg">Total value stack vs. price</h3>
            <p className="text-sm muted mt-1">
              If you bought everything in Pro as standalone tools, you'd pay $630/mo. Pro is $99.
              That's a 6.4x value-stack ratio.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> 30-day money-back
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div
            className="rounded-lg p-3"
            style={{ background: "rgb(var(--surface))", border: "1px solid rgb(var(--border))" }}
          >
            <div className="font-bold">Free stack value</div>
            <div className="text-2xl font-black mt-1">$270/mo</div>
            <div className="text-xs muted">Yours for $0/mo</div>
          </div>
          <div
            className="rounded-lg p-3 border-2 border-violet-500"
            style={{ background: "rgb(var(--surface))" }}
          >
            <div className="font-bold">Pro stack value</div>
            <div className="text-2xl font-black mt-1 text-violet-600">$630/mo</div>
            <div className="text-xs muted">Yours for $99/mo (6.4x)</div>
          </div>
          <div
            className="rounded-lg p-3"
            style={{ background: "rgb(var(--surface))", border: "1px solid rgb(var(--border))" }}
          >
            <div className="font-bold">Agency stack value</div>
            <div className="text-2xl font-black mt-1">$1,660/mo</div>
            <div className="text-xs muted">Yours for $299/mo (5.6x)</div>
          </div>
        </div>
      </section>

      {/* BONUSES — what you also get (Hormozi value-stack) */}
      <section className="card card-pad card-lift space-y-3">
        <h3 className="font-bold text-lg">Plus these bonuses — free.</h3>
        <p className="text-sm muted">
          Every paid plan includes these, designed to compound your results from week 1.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Bonus
            title="Marketing Lexicon"
            desc="26+ terms defined Investopedia-style: STP, AIDA, PAS, BAB, Schwartz's 5 levels. With case studies."
            value="$200"
          />
          <Bonus
            title="Formula Library"
            desc="26 modern + 14 legacy formulas with input/output examples. Run them on your own data."
            value="$300"
          />
          <Bonus
            title="Trend Monitor"
            desc="Macro (3-12mo) + micro (7-30d) trends with Rogers adoption curves. Updated daily."
            value="$150"
          />
          <Bonus
            title="Hire-a-Marketer"
            desc="12 specialists: Seth Godin, Gary Vee, Hormozi, Sabri Suby, Kotler. Bookable by the hour."
            value="$500"
          />
          <Bonus
            title="Seth's Daily Quote"
            desc="A daily quote ribbon on every page. 365 hand-picked lines from the masters."
            value="$50"
          />
          <Bonus
            title="First-class Migration"
            desc="Free white-glove import from HubSpot, Mailchimp, ActiveCampaign. Done for you."
            value="$1000"
          />
        </div>
        <div className="text-center mt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            Total bonus value: $2,200/yr
          </div>
        </div>
      </section>

      {/* URGENCY — real, not fake */}
      <section
        className="card card-pad card-lift text-center"
        style={{
          background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
          borderColor: "#f59e0b",
        }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold uppercase tracking-wider mb-3">
          Founding customer pricing — 100 spots total
        </div>
        <h3 className="font-black text-2xl text-amber-900">Lock in lifetime pricing.</h3>
        <p className="text-sm text-amber-800 mt-2 max-w-xl mx-auto">
          The first 100 paid customers pay today&apos;s price forever. No annual increases, no
          surprise tiers. When public pricing goes up in Q4, you stay at $99/mo.
          <br />
          <br />
          <strong>87 of 100 founding spots left.</strong> Updates quarterly — when it hits 0,
          it&apos;s gone.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/leads"
            className="btn bg-amber-500 hover:bg-amber-400 text-white font-bold px-6 py-3 rounded-lg"
          >
            Claim your founding spot →
          </Link>
        </div>
      </section>

      {/* PAYMENT METHODS */}
      <section className="card card-pad card-lift text-center">
        <h3 className="font-bold text-lg mb-1">Pay how you want.</h3>
        <p className="text-sm muted max-w-xl mx-auto">
          Card via Stripe — instant, global. Bank-direct via Revolut — for teams that prefer it.
          Both arrive in the same workspace. Switch any time.
        </p>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-violet-600" /> <strong>Stripe</strong>{" "}
            <span className="muted">card · Apple Pay · Google Pay</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" /> <strong>Revolut</strong>{" "}
            <span className="muted">Merchant · bank transfer</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="card card-pad card-lift space-y-3">
        <h3 className="font-bold text-lg">Common questions</h3>
        <Faq q="Can I really run this on my own machine for $0/mo?">
          Yes. The hub is sovereign — it runs on a single Next.js process + SQLite file. The paid
          plans unlock team features, multi-tenant, and managed delivery. Without paying, the app is
          yours forever.
        </Faq>
        <Faq q="What happens if I cancel?">
          Your workspace downgrades to Free. Your data stays. You keep every record, campaign, asset
          — just on the lower limits.
        </Faq>
        <Faq q="Can I bring my data when I leave?">
          Export everything as CSV/JSON via /api/export. Or run the hub on your own machine and
          point your data wherever you want.
        </Faq>
        <Faq q="Is there a refund policy?">
          Yes — 30-day money-back, no questions. Email hello@bazempire.io.
        </Faq>
      </section>
    </div>
  );
}

function Bonus({ title, desc, value }: { title: string; desc: string; value: string }) {
  return (
    <div
      className="rounded-lg p-4 border"
      style={{ background: "rgb(var(--surface))", borderColor: "rgb(var(--border))" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="font-bold text-sm">{title}</div>
        <div className="text-xs font-bold text-emerald-700 whitespace-nowrap">+{value}</div>
      </div>
      <div className="text-xs muted mt-1">{desc}</div>
    </div>
  );
}

function Tier({ name, price, cadence, blurb, stack, missing, cta, href, highlight }: Record<string, unknown>) {
  const totalValue = (stack ?? []).reduce((sum: number, item: Record<string, unknown>) => {
    const m = (item.value || "").match(/\$(\d+)/);
    return sum + (m ? parseInt(m[1], 10) : 0);
  }, 0);
  return (
    <div
      className={clsx(
        "rounded-2xl p-6 border-2 flex flex-col",
        highlight
          ? "border-violet-500 bg-gradient-to-br from-violet-50 via-white to-rose-50 shadow-lg shadow-violet-500/10"
          : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900",
      )}
    >
      {highlight && (
        <div className="text-[10px] uppercase tracking-wider font-bold text-violet-700 mb-1">
          Most popular
        </div>
      )}
      <h3 className="text-2xl font-bold">{name}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-4xl font-black">{price}</span>
        <span className="text-sm muted">{cadence}</span>
      </div>
      <p className="text-sm muted mt-2">{blurb}</p>

      {/* VALUE-STACK LIST */}
      {stack && stack.length > 0 && (
        <div className="mt-4">
          <div className="text-[10px] uppercase tracking-wider font-bold muted">What’s inside</div>
          <ul className="mt-2 space-y-1 text-xs">
            {stack.map((item: Record<string, unknown>, i: number) => (
              <li
                key={i}
                className="flex items-start justify-between gap-2 py-1 border-b border-slate-100 last:border-0"
              >
                <span className="flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{item.label}</span>
                </span>
                {item.value && (
                  <span className="muted text-[10px] flex-shrink-0">{item.value}</span>
                )}
              </li>
            ))}
          </ul>
          {totalValue > 0 && (
            <div className="mt-2 text-[10px] font-bold text-emerald-700">
              Stack value: ${totalValue}/mo
            </div>
          )}
        </div>
      )}

      {/* WHAT'S MISSING */}
      {missing && missing.length > 0 && (
        <div className="mt-3">
          <div className="text-[10px] uppercase tracking-wider font-bold muted">
            Not in this tier
          </div>
          <ul className="mt-1.5 space-y-1 text-xs muted">
            {missing.slice(0, 3).map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="opacity-50">—</span>
                <span>{item}</span>
              </li>
            ))}
            {missing.length > 3 && <li className="text-[10px]">+ {missing.length - 3} more</li>}
          </ul>
        </div>
      )}

      {/* Per-tier risk reversal */}
      {name !== "Free" && (
        <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
          <ShieldCheck className="w-3.5 h-3.5" /> 30-day money-back
        </div>
      )}
      <Link
        href={href}
        className={clsx("mt-5", highlight ? "btn btn-primary" : "btn btn-secondary")}
      >
        {cta}
      </Link>
    </div>
  );
}

function Faq({ q, children }: Record<string, unknown>) {
  return (
    <details className="border-b last:border-0 pb-3" style={{ borderColor: "rgb(var(--border))" }}>
      <summary className="cursor-pointer font-semibold text-sm flex items-center justify-between">
        {q}
        <ChevronDown className="w-4 h-4 muted" />
      </summary>
      <p className="text-sm muted mt-2 leading-relaxed">{children}</p>
    </details>
  );
}

import { Sparkles, Check, CreditCard, Building2, ChevronDown, ShieldCheck } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
