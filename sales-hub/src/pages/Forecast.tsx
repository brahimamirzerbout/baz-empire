import { useOutletContext } from 'react-router-dom'
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  deals, stageMeta, salesAnalytics, repById, fmtDA, type DealStage, type Lang,
} from '../data/mockData'
import { chartPalette, tooltipStyle } from '../data/theme'

const funnelStages: DealStage[] = ['lead', 'contacted', 'demo', 'proposal', 'negotiation', 'won']

export default function Forecast() {
  const { lang } = useOutletContext<{ lang: Lang }>()

  const open = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost')
  const weighted = Math.round(open.reduce((s, d) => s + (d.valueDA * d.probability) / 100, 0))
  const committed = open.filter((d) => d.probability >= 60).reduce((s, d) => s + d.valueDA, 0)
  const bestCase = open.reduce((s, d) => s + d.valueDA, 0)

  const closing = [...open].sort((a, b) => +new Date(a.expectedClose) - +new Date(b.expectedClose))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
          <p className="text-xs text-surface-400">{lang === 'fr' ? 'Engagé (≥60%)' : 'ملتزم'}</p>
          <p className="text-xl font-bold text-emerald-400">{fmtDA(committed, lang)}</p>
        </div>
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
          <p className="text-xs text-surface-400">{lang === 'fr' ? 'Pondéré' : 'مرجّح'}</p>
          <p className="text-xl font-bold text-brand-300">{fmtDA(weighted, lang)}</p>
        </div>
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
          <p className="text-xs text-surface-400">{lang === 'fr' ? 'Best-case' : 'أفضل حالة'}</p>
          <p className="text-xl font-bold text-ember-400">{fmtDA(bestCase, lang)}</p>
        </div>
      </div>

      <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-surface-400 mb-4">{lang === 'fr' ? 'Trajectoire de prévision' : 'مسار التوقعات'}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={salesAnalytics.forecast}>
            <defs>
              <linearGradient id="fcGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartPalette.ember} stopOpacity={0.25} />
                <stop offset="95%" stopColor={chartPalette.ember} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.grid} />
            <XAxis dataKey="month" stroke={chartPalette.axis} fontSize={12} />
            <YAxis stroke={chartPalette.axis} fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${Number(value).toLocaleString()} DA`]} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="bestCase" stroke={chartPalette.ember} strokeWidth={2} fill="url(#fcGrad)" name={lang === 'fr' ? 'Best-case' : 'أفضل حالة'} />
            <Line type="monotone" dataKey="committed" stroke={chartPalette.success} strokeWidth={2} dot={{ fill: chartPalette.success, r: 4 }} name={lang === 'fr' ? 'Engagé' : 'ملتزم'} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Funnel */}
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
          <h3 className="text-sm font-medium text-surface-400 mb-4">{lang === 'fr' ? 'Entonnoir du pipeline' : 'قمع خط الأنابيب'}</h3>
          <div className="space-y-2">
            {funnelStages.map((stage) => {
              const items = deals.filter((d) => d.stage === stage)
              const value = items.reduce((s, d) => s + d.valueDA, 0)
              const maxValue = Math.max(...funnelStages.map((st) => deals.filter((d) => d.stage === st).reduce((s, d) => s + d.valueDA, 0)), 1)
              const cfg = stageMeta[stage]
              return (
                <div key={stage}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={cfg.color}>{lang === 'fr' ? cfg.fr : cfg.ar}</span>
                    <span className="text-surface-400">{items.length} · {fmtDA(value, lang)}</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-surface-800 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.max((value / maxValue) * 100, 4)}%`, background: cfg.dot }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Closing soon */}
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
          <h3 className="text-sm font-medium text-surface-400 mb-4">{lang === 'fr' ? 'Clôtures à venir' : 'إغلاقات قادمة'}</h3>
          <div className="space-y-2">
            {closing.map((d) => {
              const rep = repById(d.ownerId)
              const cfg = stageMeta[d.stage]
              return (
                <div key={d.id} className="flex items-center gap-3 py-2 border-b border-surface-800/60 last:border-0">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white truncate">{d.account}</p>
                    <p className="text-[11px] text-surface-500">{d.expectedClose} · {rep?.initials}</p>
                  </div>
                  <div className="text-end flex-shrink-0">
                    <p className="text-sm font-semibold text-brand-300">{fmtDA(d.valueDA, lang)}</p>
                    <p className="text-[11px] text-surface-500">{d.probability}%</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
