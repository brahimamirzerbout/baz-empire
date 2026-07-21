import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  DollarSign, Scale, Trophy, Target, Percent, Timer, ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { deals, salesAnalytics, i18n, fmtDA, type Lang } from '../data/mockData'
import { chartPalette, tooltipStyle } from '../data/theme'

export default function Dashboard() {
  const { lang } = useOutletContext<{ lang: Lang }>()
  const tr = i18n[lang]

  const openDeals = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost')
  const wonDeals = deals.filter((d) => d.stage === 'won')
  const lostDeals = deals.filter((d) => d.stage === 'lost')

  const pipelineValue = openDeals.reduce((s, d) => s + d.valueDA, 0)
  const weighted = Math.round(openDeals.reduce((s, d) => s + (d.valueDA * d.probability) / 100, 0))
  const bookings = wonDeals.reduce((s, d) => s + d.valueDA, 0)
  const winRate = wonDeals.length + lostDeals.length > 0
    ? ((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100).toFixed(0)
    : '0'
  const avgDeal = wonDeals.length ? Math.round(bookings / wonDeals.length) : 0
  const quota = ((bookings / salesAnalytics.kpis.quotaTeamDA) * 100).toFixed(0)

  const kpiCards = [
    { label: tr.pipelineValue, value: fmtDA(pipelineValue, lang), change: '+18%', up: true, icon: DollarSign, color: 'text-brand-400' },
    { label: tr.weighted, value: fmtDA(weighted, lang), change: '+11%', up: true, icon: Scale, color: 'text-ember-400' },
    { label: tr.bookings, value: fmtDA(bookings, lang), change: '+24%', up: true, icon: Trophy, color: 'text-emerald-400' },
    { label: tr.winRate, value: `${winRate}%`, change: '+6%', up: true, icon: Percent, color: 'text-amber-400' },
    { label: tr.avgDeal, value: fmtDA(avgDeal, lang), change: '+9%', up: true, icon: Target, color: 'text-brand-300' },
    { label: tr.cycle, value: `${salesAnalytics.kpis.avgCycleDays} j`, change: '-3j', up: true, icon: Timer, color: 'text-ember-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Quota banner */}
      <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-surface-300">{lang === 'fr' ? 'Atteinte du quota équipe' : 'تحقيق حصة الفريق'}</span>
          <span className="text-sm font-bold text-white">{fmtDA(bookings, lang)} / {fmtDA(salesAnalytics.kpis.quotaTeamDA, lang)} · {quota}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-surface-800 overflow-hidden">
          <div className="h-full aether-gradient rounded-full" style={{ width: `${Math.min(Number(quota), 100)}%` }} />
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="bg-surface-900 border border-surface-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-surface-400">{kpi.label}</span>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-white">{kpi.value}</span>
              <span className={`flex items-center text-xs font-medium mb-1 ${kpi.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bookings + product mix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-surface-900 border border-surface-800 rounded-xl p-5">
          <h3 className="text-sm font-medium text-surface-400 mb-4">{lang === 'fr' ? 'Ventes signées (bookings)' : 'المبيعات المُوقّعة'}</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={salesAnalytics.bookings}>
              <defs>
                <linearGradient id="bkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartPalette.violet} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartPalette.violet} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.grid} />
              <XAxis dataKey="month" stroke={chartPalette.axis} fontSize={12} />
              <YAxis stroke={chartPalette.axis} fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${Number(value).toLocaleString()} DA`, lang === 'fr' ? 'Ventes' : 'مبيعات']} />
              <Area type="monotone" dataKey="value" stroke={chartPalette.violet} strokeWidth={2} fill="url(#bkGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
          <h3 className="text-sm font-medium text-surface-400 mb-4">{lang === 'fr' ? 'Revenu par produit' : 'الدخل حسب المنتج'}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={salesAnalytics.byProduct} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {salesAnalytics.byProduct.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${Number(value)}%`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {salesAnalytics.byProduct.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                  <span className="text-surface-300">{p.name}</span>
                </div>
                <span className="text-white font-medium">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Forecast + win/loss */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
          <h3 className="text-sm font-medium text-surface-400 mb-4">{lang === 'fr' ? 'Prévision (engagé vs best-case)' : 'التوقعات'}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesAnalytics.forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.grid} />
              <XAxis dataKey="month" stroke={chartPalette.axis} fontSize={12} />
              <YAxis stroke={chartPalette.axis} fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${Number(value).toLocaleString()} DA`]} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="committed" fill={chartPalette.violet} radius={[4, 4, 0, 0]} name={lang === 'fr' ? 'Engagé' : 'ملتزم'} />
              <Bar dataKey="bestCase" fill={chartPalette.ember} radius={[4, 4, 0, 0]} opacity={0.6} name={lang === 'fr' ? 'Best-case' : 'أفضل حالة'} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
          <h3 className="text-sm font-medium text-surface-400 mb-4">{lang === 'fr' ? 'Gagné / Perdu par raison' : 'مكتسب / خاسر حسب السبب'}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesAnalytics.winLoss} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.grid} />
              <XAxis type="number" stroke={chartPalette.axis} fontSize={12} />
              <YAxis type="category" dataKey="reason" stroke={chartPalette.axis} fontSize={11} width={90} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="won" stackId="a" fill={chartPalette.success} radius={[0, 0, 0, 0]} name={lang === 'fr' ? 'Gagné' : 'مكتسب'} />
              <Bar dataKey="lost" stackId="a" fill={chartPalette.danger} radius={[0, 4, 4, 0]} name={lang === 'fr' ? 'Perdu' : 'خاسر'} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
