import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Phone, Users, MessageCircle, Mail, CheckSquare, Square } from 'lucide-react'
import { activities as initial, repById, type Activity, type ActivityType, type Lang } from '../data/mockData'

const typeMeta: Record<ActivityType, { fr: string; ar: string; icon: typeof Phone; cls: string }> = {
  call: { fr: 'Appel', ar: 'مكالمة', icon: Phone, cls: 'bg-brand-500/15 text-brand-300' },
  meeting: { fr: 'Réunion', ar: 'اجتماع', icon: Users, cls: 'bg-amber-500/15 text-amber-400' },
  whatsapp: { fr: 'WhatsApp', ar: 'واتساب', icon: MessageCircle, cls: 'bg-green-500/15 text-green-400' },
  email: { fr: 'Email', ar: 'بريد', icon: Mail, cls: 'bg-blue-500/15 text-blue-400' },
  task: { fr: 'Tâche', ar: 'مهمة', icon: CheckSquare, cls: 'bg-ember-500/15 text-ember-400' },
}

export default function Activities() {
  const { lang } = useOutletContext<{ lang: Lang }>()
  const [list, setList] = useState<Activity[]>(initial)

  const toggle = (id: string) =>
    setList((prev) => prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a)))

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleString(lang === 'fr' ? 'fr-FR' : 'ar-DZ', { weekday: 'short', hour: '2-digit', minute: '2-digit' })

  const sorted = [...list].sort((a, b) => Number(a.done) - Number(b.done) || +new Date(a.dueAt) - +new Date(b.dueAt))
  const pending = list.filter((a) => !a.done).length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
          <p className="text-xs text-surface-400">{lang === 'fr' ? 'À faire' : 'قيد الإنجاز'}</p>
          <p className="text-xl font-bold text-ember-400">{pending}</p>
        </div>
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
          <p className="text-xs text-surface-400">{lang === 'fr' ? 'Terminées' : 'منتهية'}</p>
          <p className="text-xl font-bold text-emerald-400">{list.length - pending}</p>
        </div>
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
          <p className="text-xs text-surface-400">{lang === 'fr' ? 'Total activités' : 'إجمالي الأنشطة'}</p>
          <p className="text-xl font-bold text-white">{list.length}</p>
        </div>
      </div>

      <div className="bg-surface-900 border border-surface-800 rounded-xl divide-y divide-surface-800/60">
        {sorted.map((a) => {
          const tm = typeMeta[a.type]
          const rep = repById(a.ownerId)
          const Icon = tm.icon
          return (
            <div key={a.id} className={`flex items-center gap-3 px-4 py-3 transition-colors ${a.done ? 'opacity-50' : 'hover:bg-surface-800/40'}`}>
              <button onClick={() => toggle(a.id)} className="text-surface-400 hover:text-brand-300 transition-colors" title={lang === 'fr' ? 'Basculer' : 'تبديل'}>
                {a.done ? <CheckSquare className="w-5 h-5 text-emerald-400" /> : <Square className="w-5 h-5" />}
              </button>
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${tm.cls}`}><Icon className="w-4 h-4" /></span>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium text-white truncate ${a.done ? 'line-through' : ''}`}>{a.subject}</p>
                <p className="text-xs text-surface-400 truncate">{a.account} · {lang === 'fr' ? tm.fr : tm.ar}</p>
              </div>
              <div className="text-end flex-shrink-0">
                <p className="text-xs text-surface-300">{fmtTime(a.dueAt)}</p>
                {rep && <p className="text-[11px] text-surface-500">{rep.initials}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
