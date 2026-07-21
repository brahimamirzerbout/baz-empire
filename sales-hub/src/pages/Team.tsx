import { useOutletContext } from 'react-router-dom'
import { Trophy, Crown } from 'lucide-react'
import { reps, deals, activities, fmtDA, type Lang } from '../data/mockData'

export default function Team() {
  const { lang } = useOutletContext<{ lang: Lang }>()

  const rows = reps.map((r) => {
    const own = deals.filter((d) => d.ownerId === r.id)
    const won = own.filter((d) => d.stage === 'won')
    const open = own.filter((d) => d.stage !== 'won' && d.stage !== 'lost')
    const wonDA = won.reduce((s, d) => s + d.valueDA, 0)
    const openDA = open.reduce((s, d) => s + d.valueDA, 0)
    const attain = r.quotaDA ? (wonDA / r.quotaDA) * 100 : 0
    const acts = activities.filter((a) => a.ownerId === r.id).length
    return { rep: r, wonCount: won.length, openCount: open.length, wonDA, openDA, attain, acts }
  }).sort((a, b) => b.wonDA - a.wonDA)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {rows.map((row, i) => (
          <div key={row.rep.id} className="bg-surface-900 border border-surface-800 rounded-xl p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <span className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-extrabold text-white" style={{ background: row.rep.color }}>{row.rep.initials}</span>
                {i === 0 && <Crown className="absolute -top-2 -end-1 w-5 h-5 text-amber-400" fill="currentColor" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white">{row.rep.name}</p>
                <p className="text-xs text-surface-400">{row.rep.role}</p>
              </div>
              <div className="text-end">
                <p className="text-lg font-extrabold text-emerald-400">{fmtDA(row.wonDA, lang)}</p>
                <p className="text-[11px] text-surface-500 inline-flex items-center gap-1"><Trophy className="w-3 h-3" />{row.wonCount} {lang === 'fr' ? 'gagnés' : 'مكتسب'}</p>
              </div>
            </div>

            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-surface-400">{lang === 'fr' ? 'Atteinte quota' : 'تحقيق الحصة'}</span>
              <span className="text-white font-medium">{row.attain.toFixed(0)}% · {fmtDA(row.rep.quotaDA, lang)}</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-surface-800 overflow-hidden mb-4">
              <div className={`h-full rounded-full ${row.attain >= 100 ? 'bg-emerald-500' : 'aether-gradient'}`} style={{ width: `${Math.min(row.attain, 100)}%` }} />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-surface-800/50 rounded-lg py-2">
                <p className="text-sm font-bold text-white">{row.openCount}</p>
                <p className="text-[11px] text-surface-400">{lang === 'fr' ? 'Ouverts' : 'مفتوحة'}</p>
              </div>
              <div className="bg-surface-800/50 rounded-lg py-2">
                <p className="text-sm font-bold text-brand-300">{fmtDA(row.openDA, lang)}</p>
                <p className="text-[11px] text-surface-400">{lang === 'fr' ? 'Pipeline' : 'خط الأنابيب'}</p>
              </div>
              <div className="bg-surface-800/50 rounded-lg py-2">
                <p className="text-sm font-bold text-ember-400">{row.acts}</p>
                <p className="text-[11px] text-surface-400">{lang === 'fr' ? 'Activités' : 'أنشطة'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
