import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Package, Check } from 'lucide-react'
import { products as initial, deals, fmtDA, type Product, type Lang } from '../data/mockData'

const catColors: Record<Product['category'], string> = {
  QR: 'bg-emerald-500/15 text-emerald-400',
  Social: 'bg-blue-500/15 text-blue-400',
  SEO: 'bg-amber-500/15 text-amber-400',
  Web: 'bg-brand-500/15 text-brand-300',
  Branding: 'bg-ember-500/15 text-ember-400',
  Pack: 'bg-brand-600/20 text-brand-200',
}

export default function Products() {
  const { lang } = useOutletContext<{ lang: Lang }>()
  const [list, setList] = useState<Product[]>(initial)

  const toggle = (id: string) => setList((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)))

  const dealCount = (name: string) => deals.filter((d) => d.product === name).length
  const activeCount = list.filter((p) => p.active).length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-brand-500/15 flex items-center justify-center"><Package className="w-5 h-5 text-brand-300" /></div>
          <div><p className="text-xs text-surface-400">{lang === 'fr' ? 'Produits actifs' : 'منتجات نشطة'}</p><p className="text-xl font-bold text-white">{activeCount}/{list.length}</p></div>
        </div>
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
          <p className="text-xs text-surface-400">{lang === 'fr' ? 'Prix affichés (moat)' : 'أسعار مبيّنة'}</p>
          <p className="text-xl font-bold text-emerald-400">100%</p>
        </div>
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
          <p className="text-xs text-surface-400">{lang === 'fr' ? 'Concurrents avec prix' : 'منافسون بأسعار'}</p>
          <p className="text-xl font-bold text-red-400">1 / 27</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((p) => (
          <div key={p.id} className={`bg-surface-900 border rounded-xl p-5 transition-colors ${p.active ? 'border-surface-800' : 'border-surface-800/50 opacity-60'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${catColors[p.category]}`}>{p.category}</span>
              <button onClick={() => toggle(p.id)} className={`relative w-10 h-5 rounded-full transition-colors ${p.active ? 'bg-brand-600' : 'bg-surface-700'}`} title={lang === 'fr' ? 'Activer/Désactiver' : 'تفعيل/إيقاف'}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${p.active ? 'start-5' : 'start-0.5'}`} />
              </button>
            </div>
            <h3 className="text-base font-bold text-white">{p.name}</h3>
            <p className="text-xs text-surface-500 mb-3" dir="rtl">{p.nameAr}</p>
            <div className="flex items-end gap-1 mb-3">
              <span className="text-2xl font-extrabold aether-text">{p.priceDA === 0 ? (lang === 'fr' ? 'Gratuit' : 'مجاني') : fmtDA(p.priceDA, lang)}</span>
              <span className="text-xs text-surface-400 mb-1">{p.period}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-surface-400 pt-3 border-t border-surface-800">
              <span className="inline-flex items-center gap-1 text-emerald-400"><Check className="w-3 h-3" />{lang === 'fr' ? 'Livraison 24h' : 'تسليم 24 ساعة'}</span>
              <span>{dealCount(p.name)} {lang === 'fr' ? 'deals' : 'صفقات'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
