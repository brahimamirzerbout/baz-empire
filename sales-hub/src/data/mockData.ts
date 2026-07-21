import { v4 as uuid } from 'uuid'

export type Lang = 'fr' | 'ar'

// ============================================================
// ÆTHER SALES HUB — domain model
// Adapted to the ÆTHER marketing-hub: marketing generates leads,
// the sales hub converts them into revenue. Same brand, same
// FR/AR bilingual market (Algeria, DA), same intelligence moat.
// ============================================================

export type DealStage =
  | 'lead'
  | 'contacted'
  | 'demo'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost'

export type DealSource =
  | 'QR Free'
  | 'Marketing Hub'
  | 'Website'
  | 'WhatsApp'
  | 'Referral'
  | 'Door-to-door'
  | 'Cold Call'

export type Segment = 'Restaurant' | 'Café' | 'Retail' | 'Service' | 'Events' | 'Santé'
export type City = 'Alger' | 'Oran' | 'Constantine' | 'Tizi-Ouzou' | 'Annaba' | 'Autre'

export interface SalesRep {
  id: string
  name: string
  role: string
  initials: string
  color: string
  quotaDA: number
}

export interface Deal {
  id: string
  title: string
  account: string
  contactName: string
  stage: DealStage
  valueDA: number
  product: string
  ownerId: string
  probability: number   // 0..100
  source: DealSource
  segment: Segment
  city: City
  createdAt: string
  expectedClose: string
  lastActivity: string
}

export type AccountStatus = 'prospect' | 'customer' | 'churned'

export interface Account {
  id: string
  name: string
  segment: Segment
  city: City
  status: AccountStatus
  contactName: string
  phone: string
  whatsapp: string
  email: string
  ownerId: string
  lifetimeDA: number
  openDeals: number
  since: string
  notes: string
}

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'

export interface Quote {
  id: string
  number: string
  account: string
  product: string
  amountDA: number
  status: QuoteStatus
  ownerId: string
  createdAt: string
  validUntil: string
}

export type ActivityType = 'call' | 'meeting' | 'whatsapp' | 'email' | 'task'

export interface Activity {
  id: string
  type: ActivityType
  subject: string
  account: string
  ownerId: string
  dueAt: string
  done: boolean
}

export interface Product {
  id: string
  name: string
  nameAr: string
  priceDA: number
  period: string
  category: 'QR' | 'Social' | 'SEO' | 'Web' | 'Branding' | 'Pack'
  active: boolean
}

// --- SALES REPS (founder-led team per ÆTHER playbook) ---
export const reps: SalesRep[] = [
  { id: 'r1', name: 'Le Fondateur', role: 'Founder · Closer', initials: 'ÆF', color: '#6c3fe0', quotaDA: 400000 },
  { id: 'r2', name: 'Yacine Belkacem', role: 'Account Executive', initials: 'YB', color: '#ff6b35', quotaDA: 300000 },
  { id: 'r3', name: 'Amel Cherifi', role: 'Account Executive', initials: 'AC', color: '#10b981', quotaDA: 300000 },
  { id: 'r4', name: 'Sofiane Terki', role: 'SDR · Door-to-door', initials: 'ST', color: '#f59e0b', quotaDA: 150000 },
]

export const stageOrder: DealStage[] = ['lead', 'contacted', 'demo', 'proposal', 'negotiation', 'won', 'lost']

export const stageMeta: Record<DealStage, { fr: string; ar: string; prob: number; color: string; bg: string; dot: string }> = {
  lead:        { fr: 'Nouveau',      ar: 'جديد',       prob: 10,  color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/30',       dot: '#3b82f6' },
  contacted:   { fr: 'Contacté',     ar: 'تم الاتصال', prob: 25,  color: 'text-cyan-400',    bg: 'bg-cyan-500/10 border-cyan-500/30',       dot: '#22d3ee' },
  demo:        { fr: 'Démo',         ar: 'عرض توضيحي', prob: 45,  color: 'text-brand-300',   bg: 'bg-brand-500/10 border-brand-500/30',     dot: '#8b6ae8' },
  proposal:    { fr: 'Devis envoyé', ar: 'عرض مُرسل',  prob: 60,  color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/30',     dot: '#f59e0b' },
  negotiation: { fr: 'Négociation',  ar: 'تفاوض',      prob: 80,  color: 'text-ember-400',   bg: 'bg-ember-500/10 border-ember-500/30',     dot: '#ff6b35' },
  won:         { fr: 'Gagné',        ar: 'مكتسب',      prob: 100, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', dot: '#10b981' },
  lost:        { fr: 'Perdu',        ar: 'خاسر',       prob: 0,   color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/30',         dot: '#ef4444' },
}

export const sourceColors: Record<DealSource, string> = {
  'QR Free': 'bg-emerald-500/20 text-emerald-300',
  'Marketing Hub': 'bg-brand-500/20 text-brand-300',
  'Website': 'bg-blue-500/20 text-blue-300',
  'WhatsApp': 'bg-green-500/20 text-green-300',
  'Referral': 'bg-amber-500/20 text-amber-300',
  'Door-to-door': 'bg-surface-600 text-surface-300',
  'Cold Call': 'bg-cyan-500/20 text-cyan-300',
}

// --- DEALS (pipeline fed by the marketing hub) ---
export const deals: Deal[] = [
  { id: uuid(), title: 'Pack Complet — Pizzeria Bella', account: 'Pizzeria Bella', contactName: 'Antonio D.', stage: 'won', valueDA: 50000, product: 'Pack Complet', ownerId: 'r1', probability: 100, source: 'Referral', segment: 'Restaurant', city: 'Alger', createdAt: '2026-07-03', expectedClose: '2026-07-09', lastActivity: '2026-07-09' },
  { id: uuid(), title: 'Croissance — Café El Djanoub', account: 'Café El Djanoub', contactName: 'Karim B.', stage: 'won', valueDA: 25000, product: 'ÆTHER Croissance', ownerId: 'r4', probability: 100, source: 'Door-to-door', segment: 'Café', city: 'Alger', createdAt: '2026-07-05', expectedClose: '2026-07-10', lastActivity: '2026-07-10' },
  { id: uuid(), title: 'Croissance — Restaurant Le Jardin', account: 'Restaurant Le Jardin', contactName: 'Yasmine H.', stage: 'proposal', valueDA: 25000, product: 'ÆTHER Croissance', ownerId: 'r2', probability: 60, source: 'QR Free', segment: 'Restaurant', city: 'Alger', createdAt: '2026-07-08', expectedClose: '2026-07-24', lastActivity: '2026-07-18' },
  { id: uuid(), title: 'Site Web — Boutique Mode Oran', account: 'Boutique Mode Oran', contactName: 'Sofiane M.', stage: 'demo', valueDA: 35000, product: 'Création Site Web', ownerId: 'r3', probability: 45, source: 'Website', segment: 'Retail', city: 'Oran', createdAt: '2026-07-10', expectedClose: '2026-07-28', lastActivity: '2026-07-19' },
  { id: uuid(), title: 'QR Starter — Salon Élégance', account: 'Salon Élégance', contactName: 'Nadia A.', stage: 'contacted', valueDA: 5000, product: 'ÆTHER QR', ownerId: 'r4', probability: 25, source: 'WhatsApp', segment: 'Service', city: 'Alger', createdAt: '2026-07-12', expectedClose: '2026-07-22', lastActivity: '2026-07-17' },
  { id: uuid(), title: 'Croissance — Café Riad', account: 'Café Riad', contactName: 'Imene K.', stage: 'negotiation', valueDA: 25000, product: 'ÆTHER Croissance', ownerId: 'r2', probability: 80, source: 'Door-to-door', segment: 'Café', city: 'Alger', createdAt: '2026-07-11', expectedClose: '2026-07-23', lastActivity: '2026-07-20' },
  { id: uuid(), title: 'Premium — Événements SAHARA', account: 'Événements SAHARA', contactName: 'Mehdi Z.', stage: 'demo', valueDA: 50000, product: 'ÆTHER Premium', ownerId: 'r1', probability: 45, source: 'Marketing Hub', segment: 'Events', city: 'Autre', createdAt: '2026-07-14', expectedClose: '2026-07-30', lastActivity: '2026-07-19' },
  { id: uuid(), title: 'Site Web — Garage Auto Plus', account: 'Garage Auto Plus', contactName: 'Riad S.', stage: 'lead', valueDA: 15000, product: 'Création Site Web', ownerId: 'r3', probability: 10, source: 'Website', segment: 'Service', city: 'Alger', createdAt: '2026-07-15', expectedClose: '2026-08-05', lastActivity: '2026-07-16' },
  { id: uuid(), title: 'QR Starter — Pharmacie Centrale', account: 'Pharmacie Centrale', contactName: 'Dr. Lounès', stage: 'lost', valueDA: 5000, product: 'ÆTHER QR', ownerId: 'r4', probability: 0, source: 'Door-to-door', segment: 'Santé', city: 'Constantine', createdAt: '2026-07-01', expectedClose: '2026-07-08', lastActivity: '2026-07-08' },
  { id: uuid(), title: 'Croissance — Restaurant Dar Diaf', account: 'Restaurant Dar Diaf', contactName: 'Walid R.', stage: 'proposal', valueDA: 25000, product: 'ÆTHER Croissance', ownerId: 'r1', probability: 60, source: 'Marketing Hub', segment: 'Restaurant', city: 'Alger', createdAt: '2026-07-13', expectedClose: '2026-07-26', lastActivity: '2026-07-20' },
  { id: uuid(), title: 'Premium — Clinique Ennour', account: 'Clinique Ennour', contactName: 'Dr. Selma B.', stage: 'negotiation', valueDA: 50000, product: 'ÆTHER Premium', ownerId: 'r1', probability: 80, source: 'Referral', segment: 'Santé', city: 'Oran', createdAt: '2026-07-09', expectedClose: '2026-07-25', lastActivity: '2026-07-20' },
  { id: uuid(), title: 'Branding — Café Nakhla', account: 'Café Nakhla', contactName: 'Farid T.', stage: 'contacted', valueDA: 15000, product: 'Branding & Identité', ownerId: 'r3', probability: 25, source: 'QR Free', segment: 'Café', city: 'Annaba', createdAt: '2026-07-16', expectedClose: '2026-08-01', lastActivity: '2026-07-18' },
  { id: uuid(), title: 'QR Starter — Fleuriste Rose', account: 'Fleuriste Rose', contactName: 'Lina M.', stage: 'lead', valueDA: 5000, product: 'ÆTHER QR', ownerId: 'r4', probability: 10, source: 'Cold Call', segment: 'Retail', city: 'Tizi-Ouzou', createdAt: '2026-07-17', expectedClose: '2026-08-03', lastActivity: '2026-07-17' },
  { id: uuid(), title: 'Pack Complet — Hôtel Zephyr', account: 'Hôtel Zephyr', contactName: 'Nabil O.', stage: 'demo', valueDA: 80000, product: 'Pack Complet', ownerId: 'r1', probability: 45, source: 'Referral', segment: 'Service', city: 'Alger', createdAt: '2026-07-15', expectedClose: '2026-07-31', lastActivity: '2026-07-20' },
]

// --- ACCOUNTS ---
export const accounts: Account[] = [
  { id: uuid(), name: 'Pizzeria Bella', segment: 'Restaurant', city: 'Alger', status: 'customer', contactName: 'Antonio D.', phone: '+213661112233', whatsapp: '213661112233', email: 'bella@rest.dz', ownerId: 'r1', lifetimeDA: 150000, openDeals: 0, since: '2026-07', notes: 'Upsell NFC cartes de table en cours.' },
  { id: uuid(), name: 'Café El Djanoub', segment: 'Café', city: 'Alger', status: 'customer', contactName: 'Karim B.', phone: '+213770445566', whatsapp: '213770445566', email: 'djanoub@cafe.dz', ownerId: 'r4', lifetimeDA: 75000, openDeals: 0, since: '2026-07', notes: 'Client via porte-à-porte. Renouvellement mensuel.' },
  { id: uuid(), name: 'Restaurant Le Jardin', segment: 'Restaurant', city: 'Alger', status: 'prospect', contactName: 'Yasmine H.', phone: '+213661778899', whatsapp: '213661778899', email: 'lejardin@rest.dz', ownerId: 'r2', lifetimeDA: 0, openDeals: 1, since: '2026-07', notes: 'Devis Croissance envoyé. Relancer jeudi.' },
  { id: uuid(), name: 'Boutique Mode Oran', segment: 'Retail', city: 'Oran', status: 'prospect', contactName: 'Sofiane M.', phone: '+213555223344', whatsapp: '213555223344', email: 'mode@oran.dz', ownerId: 'r3', lifetimeDA: 0, openDeals: 1, since: '2026-07', notes: 'Démo site web planifiée.' },
  { id: uuid(), name: 'Café Riad', segment: 'Café', city: 'Alger', status: 'prospect', contactName: 'Imene K.', phone: '+213770998877', whatsapp: '213770998877', email: 'riad@cafe.dz', ownerId: 'r2', lifetimeDA: 0, openDeals: 1, since: '2026-07', notes: 'En négociation, remise 10% autorisée.' },
  { id: uuid(), name: 'Clinique Ennour', segment: 'Santé', city: 'Oran', status: 'prospect', contactName: 'Dr. Selma B.', phone: '+213661334455', whatsapp: '213661334455', email: 'contact@ennour.dz', ownerId: 'r1', lifetimeDA: 0, openDeals: 1, since: '2026-07', notes: 'Premium — décision cette semaine.' },
  { id: uuid(), name: 'Hôtel Zephyr', segment: 'Service', city: 'Alger', status: 'prospect', contactName: 'Nabil O.', phone: '+213555667788', whatsapp: '213555667788', email: 'dg@zephyr.dz', ownerId: 'r1', lifetimeDA: 0, openDeals: 1, since: '2026-07', notes: 'Gros compte. Pack Complet 80K.' },
  { id: uuid(), name: 'Pharmacie Centrale', segment: 'Santé', city: 'Constantine', status: 'churned', contactName: 'Dr. Lounès', phone: '+213770111000', whatsapp: '213770111000', email: 'centrale@pharma.dz', ownerId: 'r4', lifetimeDA: 0, openDeals: 0, since: '2026-07', notes: 'Perdu — budget. Recontacter en Q4.' },
]

// --- QUOTES (Devis) ---
export const quotes: Quote[] = [
  { id: uuid(), number: 'DEV-2026-014', account: 'Hôtel Zephyr', product: 'Pack Complet', amountDA: 80000, status: 'sent', ownerId: 'r1', createdAt: '2026-07-20', validUntil: '2026-07-31' },
  { id: uuid(), number: 'DEV-2026-013', account: 'Restaurant Le Jardin', product: 'ÆTHER Croissance', amountDA: 25000, status: 'sent', ownerId: 'r2', createdAt: '2026-07-18', validUntil: '2026-07-28' },
  { id: uuid(), number: 'DEV-2026-012', account: 'Café Riad', product: 'ÆTHER Croissance', amountDA: 22500, status: 'sent', ownerId: 'r2', createdAt: '2026-07-17', validUntil: '2026-07-27' },
  { id: uuid(), number: 'DEV-2026-011', account: 'Clinique Ennour', product: 'ÆTHER Premium', amountDA: 50000, status: 'accepted', ownerId: 'r1', createdAt: '2026-07-16', validUntil: '2026-07-26' },
  { id: uuid(), number: 'DEV-2026-010', account: 'Restaurant Dar Diaf', product: 'ÆTHER Croissance', amountDA: 25000, status: 'sent', ownerId: 'r1', createdAt: '2026-07-15', validUntil: '2026-07-26' },
  { id: uuid(), number: 'DEV-2026-009', account: 'Pizzeria Bella', product: 'Pack Complet', amountDA: 50000, status: 'accepted', ownerId: 'r1', createdAt: '2026-07-04', validUntil: '2026-07-14' },
  { id: uuid(), number: 'DEV-2026-008', account: 'Pharmacie Centrale', product: 'ÆTHER QR', amountDA: 5000, status: 'rejected', ownerId: 'r4', createdAt: '2026-07-02', validUntil: '2026-07-12' },
  { id: uuid(), number: 'DEV-2026-007', account: 'Boutique Mode Oran', product: 'Création Site Web', amountDA: 35000, status: 'draft', ownerId: 'r3', createdAt: '2026-07-19', validUntil: '2026-07-29' },
  { id: uuid(), number: 'DEV-2026-006', account: 'Café Nakhla', product: 'Branding & Identité', amountDA: 15000, status: 'draft', ownerId: 'r3', createdAt: '2026-07-18', validUntil: '2026-07-28' },
]

// --- ACTIVITIES ---
export const activities: Activity[] = [
  { id: uuid(), type: 'call', subject: 'Relance devis Pack Complet', account: 'Hôtel Zephyr', ownerId: 'r1', dueAt: '2026-07-21T10:00:00', done: false },
  { id: uuid(), type: 'whatsapp', subject: 'Envoyer maquette QR menu', account: 'Restaurant Le Jardin', ownerId: 'r2', dueAt: '2026-07-21T11:30:00', done: false },
  { id: uuid(), type: 'meeting', subject: 'Démo site web (visio)', account: 'Boutique Mode Oran', ownerId: 'r3', dueAt: '2026-07-21T14:00:00', done: false },
  { id: uuid(), type: 'call', subject: 'Négociation remise 10%', account: 'Café Riad', ownerId: 'r2', dueAt: '2026-07-21T16:00:00', done: false },
  { id: uuid(), type: 'email', subject: 'Contrat Premium à signer', account: 'Clinique Ennour', ownerId: 'r1', dueAt: '2026-07-22T09:00:00', done: false },
  { id: uuid(), type: 'task', subject: 'Préparer proposition Événements', account: 'Événements SAHARA', ownerId: 'r1', dueAt: '2026-07-22T12:00:00', done: false },
  { id: uuid(), type: 'call', subject: 'Découverte cold call', account: 'Fleuriste Rose', ownerId: 'r4', dueAt: '2026-07-20T15:00:00', done: true },
  { id: uuid(), type: 'meeting', subject: 'Onboarding client gagné', account: 'Pizzeria Bella', ownerId: 'r1', dueAt: '2026-07-09T10:00:00', done: true },
  { id: uuid(), type: 'whatsapp', subject: 'Confirmation abonnement', account: 'Café El Djanoub', ownerId: 'r4', dueAt: '2026-07-10T09:00:00', done: true },
]

// --- PRODUCTS (mirror of ÆTHER pricing catalogue) ---
export const products: Product[] = [
  { id: uuid(), name: 'ÆTHER Free', nameAr: 'ÆTHER مجاني', priceDA: 0, period: 'pour toujours', category: 'QR', active: true },
  { id: uuid(), name: 'ÆTHER QR', nameAr: 'ÆTHER QR', priceDA: 5000, period: 'one-shot', category: 'QR', active: true },
  { id: uuid(), name: 'ÆTHER Croissance', nameAr: 'ÆTHER نمو', priceDA: 25000, period: '/mois', category: 'Pack', active: true },
  { id: uuid(), name: 'ÆTHER Premium', nameAr: 'ÆTHER بريميوم', priceDA: 50000, period: '/mois', category: 'Pack', active: true },
  { id: uuid(), name: 'Réseaux Sociaux', nameAr: 'وسائل التواصل', priceDA: 10000, period: '/mois', category: 'Social', active: true },
  { id: uuid(), name: 'SEO & Visibilité', nameAr: 'تحسين محركات البحث', priceDA: 10000, period: '/mois', category: 'SEO', active: true },
  { id: uuid(), name: 'Création Site Web', nameAr: 'إنشاء موقع ويب', priceDA: 15000, period: 'à partir de', category: 'Web', active: true },
  { id: uuid(), name: 'Branding & Identité', nameAr: 'العلامة التجارية', priceDA: 15000, period: 'à partir de', category: 'Branding', active: true },
  { id: uuid(), name: 'Pack Complet', nameAr: 'الباقة الشاملة', priceDA: 30000, period: '/mois', category: 'Pack', active: true },
]

// --- ANALYTICS / FORECAST ---
export const salesAnalytics = {
  // Monthly bookings (closed-won) DA
  bookings: [
    { month: 'Fév', value: 45000 },
    { month: 'Mar', value: 120000 },
    { month: 'Avr', value: 175000 },
    { month: 'Mai', value: 240000 },
    { month: 'Jun', value: 310000 },
    { month: 'Jul', value: 385000 },
  ],
  // Weighted forecast next 3 months
  forecast: [
    { month: 'Jul', committed: 385000, bestCase: 470000 },
    { month: 'Aoû', committed: 320000, bestCase: 560000 },
    { month: 'Sep', committed: 410000, bestCase: 690000 },
  ],
  // Revenue by product (won + open weighted)
  byProduct: [
    { name: 'Croissance', value: 34, color: '#6c3fe0' },
    { name: 'Premium', value: 27, color: '#8b6ae8' },
    { name: 'Pack Complet', value: 21, color: '#ff6b35' },
    { name: 'Site Web', value: 11, color: '#10b981' },
    { name: 'QR / Autre', value: 7, color: '#f59e0b' },
  ],
  // Win / loss reasons
  winLoss: [
    { reason: 'Prix affichés', won: 9, lost: 1 },
    { reason: 'Livraison 24h', won: 7, lost: 0 },
    { reason: 'Founder-direct', won: 6, lost: 2 },
    { reason: 'Budget', won: 1, lost: 5 },
    { reason: 'Timing', won: 2, lost: 3 },
  ],
  kpis: {
    quotaTeamDA: 1150000,
    competitorsWithPrices: 1,   // Diamond only, of 27
    avgCycleDays: 9,            // vs their 2-4 weeks
    deliveryHours: 24,
  },
}

// --- i18n ---
export const i18n = {
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
    pipelineValue: 'Valeur pipeline',
    weighted: 'Pipeline pondéré',
    bookings: 'Ventes du mois',
    winRate: 'Taux de closing',
    avgDeal: 'Deal moyen',
    quota: 'Atteinte quota',
    cycle: 'Cycle de vente',
    openDeals: 'Deals ouverts',
    won: 'Gagné',
    founderDirect: 'Piloté par le fondateur',
    delivery24h: 'Livraison 24h',
    pricesShown: 'Prix affichés',
    empty: 'Vide',
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
    pipelineValue: 'قيمة خط الأنابيب',
    weighted: 'خط أنابيب مرجّح',
    bookings: 'مبيعات الشهر',
    winRate: 'نسبة الإغلاق',
    avgDeal: 'متوسط الصفقة',
    quota: 'تحقيق الحصة',
    cycle: 'دورة البيع',
    openDeals: 'صفقات مفتوحة',
    won: 'مكتسب',
    founderDirect: 'يحوّره المؤسّس',
    delivery24h: 'تسليم 24 ساعة',
    pricesShown: 'الأسعار مبيّنة',
    empty: 'فارغ',
  },
}

export const repById = (id: string) => reps.find((r) => r.id === id)
export const fmtDA = (n: number, lang: Lang) =>
  `${n.toLocaleString(lang === 'fr' ? 'fr-FR' : 'ar-DZ')} DA`
