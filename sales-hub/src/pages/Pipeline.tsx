import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { ChevronRight, ChevronLeft, X, TrendingUp, Scale, Trophy } from 'lucide-react'
import {
  deals as initialDeals, stageMeta, sourceColors, repById,
  fmtDA, type Deal, type DealStage, type Lang,
} from '../data/mockData'

const flowStages: DealStage[] = ['lead', 'contacted', 'demo', 'proposal', 'negotiation', 'won']

export default function Pipeline() {
  const { lang } = useOutletContext<{ lang: Lang }>()
  const [dealList, setDealList] = useState<Deal[]>(initialDeals)

  const move = (id: string, dir: 'next' | 'prev') => {
    setDealList((prev) => prev.map((d) => {
      if (d.id !== id) return d
      const idx = flowStages.indexOf(d.stage)
      if (idx === -1) return d
      const ni = dir === 'next' ? Math.min(idx + 1, flowStages.length - 1) : Math.max(idx - 1, 0)
      const stage = flowStages[ni]
      return { ...d, stage, probability: stageMeta[stage].prob }
    }))
  }

  const markLost = (id: string) => {
    setDealList((prev) => prev.map((d) => (d.id === id ? { ...d, stage: 'lost', probability: 0 } : d)))
  }

  const open = dealList.filter((d) => d.stage !== 'won' && d.stage !== 'lost')
  const pipelineValue = open.reduce((s, d) => s + d.valueDA, 0)
  const weighted = Math.round(open.reduce((s, d) => s + (d.valueDA * d.probability) / 100, 0))
  const wonValue = dealList.filter((d) => d.stage === 'won').reduce((s, d) => s + d.valueDA, 0)

  const columns: DealStage[] = [...flowStages, 'lost']

  const stat = (icon: typeof TrendingUp, label: string, value: string, cls: string) => {
    const Icon = icon
    return (
      <div className="bg-surface-900 border border-surface-800 rounded-xl p-5 flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cls}`}><Icon className="w-5 h-5" /></div>
        <div><p className="text-xs text-surface-400">{label}</p><p className="text-xl font-bold text-white">{value}</p></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stat(TrendingUp, lang === 'fr' ? 'Valeur pipeline' : 'قيمة خط الأنابيب', fmtDA(pipelineValue, lang), 'bg-brand-500/15 text-brand-300')}
        {stat(Scale, lang === 'fr' ? 'Pipeline pondéré' : 'خط أنابيب مرجّح', fmtDA(weighted, lang), 'bg-ember-500/15 text-ember-400')}
        {stat(Trophy, lang === 'fr' ? 'Gagné (mois)' : 'مكتسب (الشهر)', fmtDA(wonValue, lang), 'bg-emerald-500/15 text-emerald-400')}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
        {columns.map((stage) => {
          const cfg = stageMeta[stage]
          const items = dealList.filter((d) => d.stage === stage)
          const colValue = items.reduce((s, d) => s + d.valueDA, 0)
          return (
            <div key={stage} className="space-y-3">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${cfg.bg}`}>
                <span className="w-2 h-2 rounded-full" style={{ background: cfg.dot }} />
                <span className={`text-sm font-semibold ${cfg.color}`}>{lang === 'fr' ? cfg.fr : cfg.ar}</span>
                <span className="ms-auto text-xs text-surface-400 bg-surface-800 rounded-full px-2 py-0.5">{items.length}</span>
              </div>
              {items.length > 0 && (
                <p className="px-1 text-[11px] text-surface-500">{fmtDA(colValue, lang)}</p>
              )}
              <div className="space-y-2">
                {items.map((d) => {
                  const rep = repById(d.ownerId)
                  return (
                    <div key={d.id} className="bg-surface-900 border border-surface-800 rounded-xl p-3 space-y-2">
                      <p className="text-sm font-medium text-white leading-snug">{d.account}</p>
                      <p className="text-xs text-surface-400">{d.product}</p>
                      <div className="flex items-center flex-wrap gap-1.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${sourceColors[d.source]}`}>{d.source}</span>
                        <span className="text-[11px] text-surface-500">{d.city}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-brand-300">{fmtDA(d.valueDA, lang)}</span>
                        <span className="text-[11px] text-surface-500">{d.probability}%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {rep && (
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: rep.color }} title={rep.name}>{rep.initials}</span>
                        )}
                        <div className="ms-auto flex gap-1">
                          <button onClick={() => move(d.id, 'prev')} disabled={stage === 'lead' || stage === 'lost'} className="p-1 text-surface-400 hover:text-white hover:bg-surface-700 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title={lang === 'fr' ? 'Reculer' : 'رجوع'}><ChevronLeft className="w-4 h-4" /></button>
                          <button onClick={() => move(d.id, 'next')} disabled={stage === 'won' || stage === 'lost'} className="p-1 text-surface-400 hover:text-white hover:bg-surface-700 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title={lang === 'fr' ? 'Avancer' : 'تقدّم'}><ChevronRight className="w-4 h-4" /></button>
                          <button onClick={() => markLost(d.id)} disabled={stage === 'won' || stage === 'lost'} className="p-1 text-surface-400 hover:text-red-400 hover:bg-surface-700 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title={lang === 'fr' ? 'Marquer perdu' : 'وضع كخاسر'}><X className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {items.length === 0 && (
                  <div className="py-6 text-center text-surface-600 text-xs border border-dashed border-surface-700 rounded-xl">{lang === 'fr' ? 'Vide' : 'فارغ'}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
