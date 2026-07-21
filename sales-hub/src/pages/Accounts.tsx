import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Phone, Mail, MessageCircle, Building2 } from 'lucide-react'
import { accounts, repById, fmtDA, type Account, type AccountStatus, type Lang } from '../data/mockData'

const statusMeta: Record<AccountStatus, { fr: string; ar: string; cls: string }> = {
  prospect: { fr: 'Prospect', ar: 'محتمل', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  customer: { fr: 'Client', ar: 'عميل', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  churned: { fr: 'Perdu', ar: 'مفقود', cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
}

const filters: (AccountStatus | 'all')[] = ['all', 'prospect', 'customer', 'churned']

export default function Accounts() {
  const { lang } = useOutletContext<{ lang: Lang }>()
  const [filter, setFilter] = useState<AccountStatus | 'all'>('all')

  const list = filter === 'all' ? accounts : accounts.filter((a) => a.status === filter)
  const customers = accounts.filter((a) => a.status === 'customer')
  const lifetime = customers.reduce((s, a) => s + a.lifetimeDA, 0)

  const filterLabel = (f: AccountStatus | 'all') =>
    f === 'all' ? (lang === 'fr' ? 'Tous' : 'الكل') : lang === 'fr' ? statusMeta[f].fr : statusMeta[f].ar

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-brand-500/15 flex items-center justify-center"><Building2 className="w-5 h-5 text-brand-300" /></div>
          <div><p className="text-xs text-surface-400">{lang === 'fr' ? 'Comptes' : 'الحسابات'}</p><p className="text-xl font-bold text-white">{accounts.length}</p></div>
        </div>
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
          <p className="text-xs text-surface-400">{lang === 'fr' ? 'Clients actifs' : 'عملاء نشطون'}</p>
          <p className="text-xl font-bold text-emerald-400">{customers.length}</p>
        </div>
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
          <p className="text-xs text-surface-400">{lang === 'fr' ? 'Valeur vie clients' : 'قيمة العملاء'}</p>
          <p className="text-xl font-bold text-white">{fmtDA(lifetime, lang)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${filter === f ? 'bg-brand-600/15 text-brand-300 border-brand-500/40' : 'text-surface-300 border-surface-700 hover:text-white hover:bg-surface-800'}`}>
            {filterLabel(f)}
          </button>
        ))}
      </div>

      <div className="bg-surface-900 border border-surface-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-start text-surface-400 border-b border-surface-800">
                <th className="text-start font-medium px-4 py-3">{lang === 'fr' ? 'Compte' : 'الحساب'}</th>
                <th className="text-start font-medium px-4 py-3 hidden md:table-cell">{lang === 'fr' ? 'Contact' : 'جهة الاتصال'}</th>
                <th className="text-start font-medium px-4 py-3 hidden lg:table-cell">{lang === 'fr' ? 'Ville' : 'المدينة'}</th>
                <th className="text-start font-medium px-4 py-3">{lang === 'fr' ? 'Statut' : 'الحالة'}</th>
                <th className="text-start font-medium px-4 py-3 hidden sm:table-cell">{lang === 'fr' ? 'Valeur' : 'القيمة'}</th>
                <th className="text-start font-medium px-4 py-3 hidden lg:table-cell">{lang === 'fr' ? 'Responsable' : 'المسؤول'}</th>
                <th className="text-end font-medium px-4 py-3">{lang === 'fr' ? 'Contact' : 'تواصل'}</th>
              </tr>
            </thead>
            <tbody>
              {list.map((a: Account) => {
                const rep = repById(a.ownerId)
                const sm = statusMeta[a.status]
                return (
                  <tr key={a.id} className="border-b border-surface-800/60 hover:bg-surface-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{a.name}</p>
                      <p className="text-xs text-surface-500">{a.segment}</p>
                    </td>
                    <td className="px-4 py-3 text-surface-300 hidden md:table-cell">{a.contactName}</td>
                    <td className="px-4 py-3 text-surface-400 hidden lg:table-cell">{a.city}</td>
                    <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${sm.cls}`}>{lang === 'fr' ? sm.fr : sm.ar}</span></td>
                    <td className="px-4 py-3 text-white font-medium hidden sm:table-cell">{a.lifetimeDA ? fmtDA(a.lifetimeDA, lang) : '—'}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {rep && <span className="inline-flex items-center gap-1.5 text-surface-300"><span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: rep.color }}>{rep.initials}</span>{rep.name}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <a href={`https://wa.me/${a.whatsapp}`} target="_blank" rel="noopener" className="p-1.5 rounded-lg text-green-400 hover:bg-green-500/10 transition-colors" title="WhatsApp"><MessageCircle className="w-4 h-4" /></a>
                        <a href={`tel:${a.phone}`} className="p-1.5 rounded-lg text-brand-300 hover:bg-brand-500/10 transition-colors" title={lang === 'fr' ? 'Appeler' : 'اتصال'}><Phone className="w-4 h-4" /></a>
                        <a href={`mailto:${a.email}`} className="p-1.5 rounded-lg text-surface-300 hover:bg-surface-700 transition-colors" title="Email"><Mail className="w-4 h-4" /></a>
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
