import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FileText, Check, X, Send, Clock } from 'lucide-react'
import { quotes as initialQuotes, repById, fmtDA, type Quote, type QuoteStatus, type Lang } from '../data/mockData'

const statusMeta: Record<QuoteStatus, { fr: string; ar: string; cls: string; icon: typeof Check }> = {
  draft: { fr: 'Brouillon', ar: 'مسودة', cls: 'bg-surface-700 text-surface-300', icon: FileText },
  sent: { fr: 'Envoyé', ar: 'مُرسل', cls: 'bg-blue-500/15 text-blue-400', icon: Send },
  accepted: { fr: 'Accepté', ar: 'مقبول', cls: 'bg-emerald-500/15 text-emerald-400', icon: Check },
  rejected: { fr: 'Refusé', ar: 'مرفوض', cls: 'bg-red-500/15 text-red-400', icon: X },
  expired: { fr: 'Expiré', ar: 'منتهي', cls: 'bg-amber-500/15 text-amber-400', icon: Clock },
}

export default function Quotes() {
  const { lang } = useOutletContext<{ lang: Lang }>()
  const [list, setList] = useState<Quote[]>(initialQuotes)

  const setStatus = (id: string, status: QuoteStatus) =>
    setList((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)))

  const sentValue = list.filter((q) => q.status === 'sent').reduce((s, q) => s + q.amountDA, 0)
  const acceptedValue = list.filter((q) => q.status === 'accepted').reduce((s, q) => s + q.amountDA, 0)
  const decided = list.filter((q) => q.status === 'accepted' || q.status === 'rejected')
  const acceptRate = decided.length ? ((list.filter((q) => q.status === 'accepted').length / decided.length) * 100).toFixed(0) : '0'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
          <p className="text-xs text-surface-400">{lang === 'fr' ? 'Devis en attente' : 'عروض معلّقة'}</p>
          <p className="text-xl font-bold text-blue-400">{fmtDA(sentValue, lang)}</p>
        </div>
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
          <p className="text-xs text-surface-400">{lang === 'fr' ? 'Devis acceptés' : 'عروض مقبولة'}</p>
          <p className="text-xl font-bold text-emerald-400">{fmtDA(acceptedValue, lang)}</p>
        </div>
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
          <p className="text-xs text-surface-400">{lang === 'fr' ? "Taux d'acceptation" : 'نسبة القبول'}</p>
          <p className="text-xl font-bold text-white">{acceptRate}%</p>
        </div>
      </div>

      <div className="bg-surface-900 border border-surface-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-surface-400 border-b border-surface-800">
                <th className="text-start font-medium px-4 py-3">N°</th>
                <th className="text-start font-medium px-4 py-3">{lang === 'fr' ? 'Compte' : 'الحساب'}</th>
                <th className="text-start font-medium px-4 py-3 hidden md:table-cell">{lang === 'fr' ? 'Produit' : 'المنتج'}</th>
                <th className="text-start font-medium px-4 py-3">{lang === 'fr' ? 'Montant' : 'المبلغ'}</th>
                <th className="text-start font-medium px-4 py-3 hidden lg:table-cell">{lang === 'fr' ? 'Validité' : 'الصلاحية'}</th>
                <th className="text-start font-medium px-4 py-3">{lang === 'fr' ? 'Statut' : 'الحالة'}</th>
                <th className="text-end font-medium px-4 py-3">{lang === 'fr' ? 'Action' : 'إجراء'}</th>
              </tr>
            </thead>
            <tbody>
              {list.map((q) => {
                const sm = statusMeta[q.status]
                const rep = repById(q.ownerId)
                const Icon = sm.icon
                return (
                  <tr key={q.id} className="border-b border-surface-800/60 hover:bg-surface-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-surface-300">{q.number}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{q.account}</p>
                      {rep && <p className="text-[11px] text-surface-500">{rep.name}</p>}
                    </td>
                    <td className="px-4 py-3 text-surface-300 hidden md:table-cell">{q.product}</td>
                    <td className="px-4 py-3 font-semibold text-brand-300">{fmtDA(q.amountDA, lang)}</td>
                    <td className="px-4 py-3 text-surface-400 hidden lg:table-cell">{q.validUntil}</td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sm.cls}`}><Icon className="w-3 h-3" />{lang === 'fr' ? sm.fr : sm.ar}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setStatus(q.id, 'accepted')} disabled={q.status === 'accepted'} className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors disabled:opacity-30" title={lang === 'fr' ? 'Accepter' : 'قبول'}><Check className="w-4 h-4" /></button>
                        <button onClick={() => setStatus(q.id, 'rejected')} disabled={q.status === 'rejected'} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30" title={lang === 'fr' ? 'Refuser' : 'رفض'}><X className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
