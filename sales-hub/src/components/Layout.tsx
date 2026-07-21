import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Kanban,
  Building2,
  FileText,
  CheckSquare,
  Package,
  Users,
  TrendingUp,
  Menu,
  X,
  Bell,
  Search,
  Languages,
  ExternalLink,
} from 'lucide-react'
import { useState, useEffect } from 'react'

type Lang = 'fr' | 'ar'

const t = {
  fr: {
    dashboard: 'Tableau de bord',
    pipeline: 'Pipeline',
    accounts: 'Comptes / CRM',
    quotes: 'Devis',
    activities: 'Activités',
    products: 'Produits',
    team: 'Équipe',
    forecast: 'Prévisions',
    search: 'Rechercher un compte, un deal…',
    marketing: 'Marketing Hub',
  },
  ar: {
    dashboard: 'لوحة التحكم',
    pipeline: 'خط الأنابيب',
    accounts: 'الحسابات / CRM',
    quotes: 'العروض',
    activities: 'الأنشطة',
    products: 'المنتجات',
    team: 'الفريق',
    forecast: 'التوقعات',
    search: 'ابحث عن حساب أو صفقة…',
    marketing: 'مركز التسويق',
  },
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [lang, setLang] = useState<Lang>('fr')
  const location = useLocation()

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, key: 'dashboard' as const },
    { to: '/pipeline', icon: Kanban, key: 'pipeline' as const },
    { to: '/accounts', icon: Building2, key: 'accounts' as const },
    { to: '/quotes', icon: FileText, key: 'quotes' as const },
    { to: '/activities', icon: CheckSquare, key: 'activities' as const },
    { to: '/products', icon: Package, key: 'products' as const },
    { to: '/team', icon: Users, key: 'team' as const },
    { to: '/forecast', icon: TrendingUp, key: 'forecast' as const },
  ]

  const pageTitle = navItems.find((n) => location.pathname.startsWith(n.to)) || navItems[0]
  const tr = t[lang]

  return (
    <div className="flex h-screen overflow-hidden bg-surface-950">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed z-40 h-full w-64 bg-surface-900 border-r border-brand-800/20 flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-brand-800/20">
          <div className="w-9 h-9 rounded-full aether-gradient flex items-center justify-center">
            <span className="text-white font-extrabold text-lg leading-none" style={{ letterSpacing: '-0.03em' }}>Æ</span>
          </div>
          <div className="leading-tight">
            <span className="block text-lg font-extrabold text-white tracking-tight">ÆTHER</span>
            <span className="block text-[11px] font-semibold text-brand-300 tracking-wide uppercase">Sales</span>
          </div>
          <button
            className="ms-auto lg:hidden text-surface-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600/15 text-brand-300'
                    : 'text-surface-300 hover:text-white hover:bg-surface-800'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
              {tr[item.key]}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-brand-800/20 space-y-3">
          <a
            href="http://localhost:5173"
            className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            {tr.marketing}
          </a>
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-surface-800/50">
            <div className="w-8 h-8 rounded-full aether-gradient flex items-center justify-center text-white text-sm font-bold">
              Æ
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Le Fondateur</p>
              <p className="text-xs text-surface-400 truncate">Founder · Closer</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-4 px-4 lg:px-6 py-3 bg-surface-900/80 backdrop-blur-sm border-b border-brand-800/20 sticky top-0 z-20">
          <button
            className="lg:hidden text-surface-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <h1 className="text-lg font-bold text-white" style={{ letterSpacing: '-0.03em' }}>
            {tr[pageTitle.key]}
          </h1>

          <div className="flex-1 max-w-md mx-4 hidden sm:block">
            <div className="relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                placeholder={tr.search}
                className="w-full ps-10 pe-4 py-2 bg-surface-800/50 border border-brand-500/20 rounded-xl text-sm text-white placeholder-surface-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ms-auto">
            <button
              onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-surface-300 hover:text-white hover:bg-surface-800 rounded-full transition-colors border border-brand-500/20"
              aria-label="Changer de langue"
            >
              <Languages className="w-4 h-4" />
              {lang === 'fr' ? 'عربي' : 'FR'}
            </button>
            <button className="relative p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 end-1 w-2 h-2 bg-ember-500 rounded-full" />
            </button>
          </div>
        </header>

        <main id="main" className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet context={{ lang }} />
        </main>
      </div>
    </div>
  )
}
