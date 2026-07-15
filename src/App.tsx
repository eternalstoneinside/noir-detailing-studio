import { useEffect, useState, type FormEvent } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import * as Accordion from '@radix-ui/react-accordion'
import {
  ArrowRight, Check, ChevronDown, Clock3, Instagram, MapPin,
  ArrowLeft, ExternalLink, Menu, Navigation, Phone, ShieldCheck, Sparkles, Star, X,
} from 'lucide-react'
import { cn } from './lib/utils'

const services = [
  { no: '01', title: 'Korekta lakieru', desc: 'Usuwamy zmatowienia, hologramy i drobne rysy. Lakier odzyskuje głębię bez obietnic bez pokrycia.', price: 'od 900 zł', time: '1–2 dni' },
  { no: '02', title: 'Powłoki ceramiczne', desc: 'Trwała ochrona przed chemią, UV i brudem. Dobieramy powłokę do sposobu, w jaki używasz auta.', price: 'od 1 600 zł', time: '2 dni' },
  { no: '03', title: 'Folie ochronne PPF', desc: 'Niewidoczna bariera na elementy najbardziej narażone na odpryski. Precyzyjny montaż i czyste krawędzie.', price: 'od 650 zł', time: '1–5 dni' },
  { no: '04', title: 'Detailing wnętrza', desc: 'Dokładne czyszczenie, pranie i zabezpieczenie materiałów. Bez tłustego połysku i ciężkich zapachów.', price: 'od 450 zł', time: '6–10 godz.' },
  { no: '05', title: 'Detailing kompleksowy', desc: 'Pełna metamorfoza nadwozia i wnętrza dla auta, któremu chcesz przywrócić najlepszą formę.', price: 'od 1 300 zł', time: '1–3 dni' },
  { no: '06', title: 'Przygotowanie do sprzedaży', desc: 'Zakres nastawiony na rezultat: czyste wnętrze, odświeżony lakier i zdjęcia, które dobrze sprzedają.', price: 'od 700 zł', time: '1 dzień' },
]

const projects = [
  { car: 'Škoda Superb', job: 'Korekta lakieru + ceramika', image: '/images/project-sedan.webp' },
  { car: 'Škoda Octavia Combi', job: 'Detailing kompleksowy', image: '/images/project-estate.webp' },
  { car: 'Volkswagen Polo', job: 'Ceramika + zabezpieczenie szyb', image: '/images/project-hatch.webp' },
  { car: 'Tesla Model 3', job: 'Pakiet PPF Front', image: '/images/project-ev.webp' },
]

const testimonials = [
  { quote: 'Wycena była konkretna, kontakt normalny, a samochód odebrałem dokładnie w umówionym terminie. Lakier w moim pięcioletnim Passacie wygląda lepiej niż przy zakupie.', name: 'Michał K.', car: 'Volkswagen Passat · korekta + ceramika' },
  { quote: 'Bez wciskania najdroższego pakietu. Dostałam jasne wyjaśnienie, co warto zrobić teraz, a co może poczekać. Wnętrze po dzieciach znowu wygląda naprawdę świeżo.', name: 'Anna R.', car: 'Škoda Octavia · detailing wnętrza' },
  { quote: 'Folia jest praktycznie niewidoczna, krawędzie zrobione bardzo czysto. Doceniam zdjęcia z realizacji i krótką instrukcję, jak później bezpiecznie myć auto.', name: 'Tomasz W.', car: 'Toyota Corolla · PPF Front' },
  { quote: 'Auto przygotowane do sprzedaży w jeden dzień. Zdjęcia wyszły świetnie, a pierwszy oglądający kupił samochód bez negocjowania stanu wnętrza.', name: 'Karolina P.', car: 'Cupra Leon · pakiet sprzedażowy' },
]

const faqs = [
  ['Ile naprawdę kosztuje usługa?', 'Podane ceny są cenami startowymi dla aut kompaktowych. Ostateczna wycena zależy od wielkości auta, stanu lakieru lub wnętrza i oczekiwanego efektu. Zawsze zatwierdzasz cenę przed rozpoczęciem prac.'],
  ['Czy powłoka ceramiczna chroni przed rysami?', 'Powłoka ogranicza przywieranie brudu, chroni przed chemią i promieniowaniem UV oraz ułatwia mycie. Nie jest jednak pancerzem na zarysowania ani odpryski — do takiej ochrony służy folia PPF.'],
  ['Czy mogę zostawić samochód rano i odebrać wieczorem?', 'Tak, przy usługach jednodniowych. Przy korekcie, ceramice i większych pakietach potrzebujemy zwykle 2–3 dni. Dokładny termin podajemy podczas wyceny.'],
  ['Jak przygotować auto przed wizytą?', 'Nie musisz go myć ani opróżniać całkowicie. Przy detailingu wnętrza prosimy jedynie o zabranie rzeczy osobistych i fotelików dziecięcych.'],
  ['Czy pracujecie tylko z nowymi i drogimi autami?', 'Nie. Dbamy o auta codzienne, rodzinne, firmowe i premium. Liczy się dla nas oczekiwany efekt i uczciwie dobrany zakres — nie znaczek na masce.'],
]

const reveal = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: .65, ease: [0.22, 1, 0.36, 1] as const } } }

function Loader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const timer = window.setTimeout(onComplete, 1650)
    return () => { window.clearTimeout(timer); document.body.style.overflow = '' }
  }, [onComplete])

  return <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: .55, ease: 'easeInOut' } }} className="fixed inset-0 z-[100] grid place-items-center bg-ink text-bone">
    <div className="w-[min(320px,76vw)] text-center">
      <motion.div initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .55 }} className="flex justify-center"><Logo /></motion.div>
      <div className="mt-8 h-px overflow-hidden bg-white/15"><motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.25, ease: [0.76, 0, 0.24, 1] }} className="h-full origin-left bg-acid" /></div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }} className="mt-4 text-[9px] font-bold uppercase tracking-[.24em] text-white/35">Przygotowujemy studio</motion.p>
    </div>
  </motion.div>
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 24, mass: .25 })
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-acid" />
}

function Logo({ light = true }: { light?: boolean }) {
  return <Link to="/" className={cn('group flex items-center gap-3.5', light ? 'text-bone' : 'text-ink')} aria-label="NOIR — strona główna">
    <span className={cn('relative grid size-10 place-items-center overflow-hidden rounded-[11px] border transition duration-500 group-hover:rotate-3', light ? 'border-white/25 bg-white/[.04]' : 'border-black/20')}>
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true"><path d="M7 23V9l9 10V9h3v14L10 13v10H7Z" fill="currentColor"/><path d="M22 9h3v14h-3z" fill="currentColor" opacity=".38"/></svg>
      <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-acid transition-all duration-500 group-hover:w-full" />
    </span>
    <span className="flex flex-col leading-none"><span className="font-display text-[18px] font-semibold tracking-[.16em]">NOIR</span><span className="mt-1.5 text-[8px] font-bold tracking-[.25em] text-muted">DETAILING STUDIO</span></span>
  </Link>
}

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => { const fn = () => setScrolled(scrollY > 24); addEventListener('scroll', fn); return () => removeEventListener('scroll', fn) }, [])
  const links = [['Usługi', '#uslugi'], ['Realizacje', '#realizacje'], ['Cennik', '#cennik'], ['O studio', '#o-studio']]
  return <header className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-300', scrolled && 'border-b border-white/10 bg-ink/90 backdrop-blur-xl')}>
    <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
      <Logo />
      <nav className="hidden items-center gap-8 lg:flex" aria-label="Główna nawigacja">
        {links.map(([name, href]) => <a key={name} href={href} className="text-sm font-medium text-white/70 transition hover:text-white">{name}</a>)}
      </nav>
      <a href="tel:+48423070070" className="hidden items-center gap-3 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-acid hover:bg-acid hover:text-ink sm:flex"><Phone size={15} /> 42 307 00 70</a>
      <button className="grid size-11 place-items-center rounded-full border border-white/20 text-white lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Zamknij menu' : 'Otwórz menu'}>{open ? <X /> : <Menu />}</button>
    </div>
    <AnimatePresence>{open && <motion.nav initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }} animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }} exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: .45, ease: [0.22, 1, 0.36, 1] }} className="border-t border-white/10 bg-ink px-5 py-8 lg:hidden">
      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: .06, delayChildren: .08 } } }}>
        {links.map(([name, href], i) => <motion.a variants={{ hidden: { opacity: 0, x: -18 }, show: { opacity: 1, x: 0 } }} key={name} href={href} onClick={() => setOpen(false)} className="flex items-center justify-between border-b border-white/10 py-4 font-display text-2xl text-bone"><span>{name}</span><span className="font-sans text-[10px] text-white/30">0{i + 1}</span></motion.a>)}
        <motion.a variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} href="#kontakt" onClick={() => setOpen(false)} className="mt-6 flex justify-between rounded-full bg-acid px-6 py-4 font-semibold text-ink">Umów wycenę <ArrowRight /></motion.a>
      </motion.div>
    </motion.nav>}</AnimatePresence>
  </header>
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.19em] text-muted"><span className="h-px w-8 bg-acid" />{children}</div>
}

function Hero() {
  const reduce = useReducedMotion()
  return <section className="relative min-h-[760px] overflow-hidden bg-ink text-white sm:min-h-[820px] lg:h-screen lg:min-h-[760px]">
    <div className="absolute inset-0">
      <img src="/images/hero.webp" alt="Detailer polerujący lakier samochodu w studio" className="h-full w-full object-cover object-[58%_center]" fetchPriority="high" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,.94)_0%,rgba(5,5,5,.69)_48%,rgba(5,5,5,.2)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,5,5,.75)_0%,transparent_45%)]" />
    </div>
    <div className="relative mx-auto flex h-full min-h-[760px] max-w-[1440px] flex-col justify-end px-5 pb-20 pt-32 sm:min-h-[820px] sm:px-8 lg:min-h-[760px] lg:justify-center lg:px-12 lg:pb-0">
      <motion.div initial={reduce ? false : 'hidden'} animate="show" variants={{ show: { transition: { staggerChildren: .12 } } }} className="max-w-4xl">
        <motion.div variants={reveal} className="mb-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[.16em] text-white/70"><span className="size-2 rounded-full bg-acid shadow-[0_0_18px_#d6ff3f]" /> Studio auto detailingu · Łódź</motion.div>
        <motion.h1 variants={reveal} className="font-display text-[clamp(3.1rem,7.2vw,7.4rem)] font-medium leading-[.91] tracking-[-.055em] text-bone">Dobre auto<br /><span className="text-white/48">zasługuje<span className="hidden sm:inline"> </span><br className="sm:hidden" />na uwagę.</span></motion.h1>
        <motion.p variants={reveal} className="mt-7 max-w-xl text-base leading-7 text-white/68 sm:text-lg">Pielęgnujemy, odnawiamy i chronimy samochody w Łodzi. Dokładnie wyjaśniamy zakres, uczciwie wyceniamy i bierzemy odpowiedzialność za efekt.</motion.p>
        <motion.div variants={reveal} className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a href="#kontakt" className="group flex min-h-14 items-center justify-between gap-6 rounded-full bg-acid px-7 font-bold text-ink transition hover:bg-white">Umów bezpłatną wycenę <ArrowRight className="transition group-hover:translate-x-1" size={19} /></a>
          <a href="#realizacje" className="flex min-h-14 items-center justify-center rounded-full border border-white/25 px-7 font-semibold text-white transition hover:bg-white/10">Zobacz nasze realizacje</a>
        </motion.div>
      </motion.div>
      <div className="absolute bottom-7 right-12 hidden gap-10 text-sm text-white/70 lg:flex"><div><b className="block text-white">Pon.–Pt. 8:00–18:00</b>sobota 9:00–14:00</div><div><b className="block text-white">ul. Targowa 35</b>90-043 Łódź</div></div>
    </div>
  </section>
}

function TrustStrip() {
  const items = [[ShieldCheck, 'Bezpieczne materiały', 'Sprawdzona chemia i folie'], [Clock3, 'Terminowo', 'Datę odbioru ustalamy z góry'], [Sparkles, 'Uczciwa wycena', 'Bez dopłat po fakcie']]
  return <section className="border-b border-line bg-graphite"><div className="mx-auto grid max-w-[1440px] sm:grid-cols-3">
    {items.map(([Icon, title, desc], i) => <div key={String(title)} className={cn('flex items-center gap-4 px-5 py-7 sm:px-8 lg:px-12', i !== 2 && 'border-b border-line sm:border-b-0 sm:border-r')}><Icon className="shrink-0 text-acid" size={22} /><div><b className="block text-sm text-bone">{title as string}</b><span className="text-xs text-muted">{desc as string}</span></div></div>)}
  </div></section>
}

function Services() {
  return <section id="uslugi" className="bg-bone px-5 py-24 sm:px-8 sm:py-32 lg:px-12"><div className="mx-auto max-w-[1344px]">
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: .25 }} variants={reveal} className="mb-14 grid gap-8 lg:grid-cols-2">
      <div><SectionLabel>Usługi</SectionLabel><h2 className="max-w-xl font-display text-4xl leading-[1.02] tracking-[-.04em] text-ink sm:text-6xl">Tyle, ile potrzebuje Twoje auto.</h2></div>
      <p className="max-w-lg self-end text-base leading-7 text-black/60 lg:justify-self-end">Nie sprzedajemy największego pakietu. Najpierw oglądamy auto, pytamy o sposób użytkowania i proponujemy zakres, który naprawdę ma sens.</p>
    </motion.div>
    <div className="grid border-t border-black/15 md:grid-cols-2 lg:grid-cols-3">
      {services.map((s, i) => <motion.article key={s.no} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * .07 }} className="group relative min-h-[310px] border-b border-black/15 p-7 transition-colors hover:bg-white lg:p-9 md:[&:nth-child(odd)]:border-r lg:[&:not(:nth-child(3n))]:border-r lg:[&:nth-child(odd)]:border-r-0">
        <div className="flex items-center justify-between text-xs font-bold tracking-[.12em] text-black/40"><span>{s.no}</span><ArrowRight size={17} className="transition group-hover:translate-x-1 group-hover:text-black" /></div>
        <h3 className="mt-10 font-display text-2xl tracking-[-.03em] text-ink">{s.title}</h3><p className="mt-4 text-sm leading-6 text-black/58">{s.desc}</p>
        <div className="absolute bottom-7 left-7 right-7 flex justify-between border-t border-black/10 pt-4 text-xs lg:bottom-9 lg:left-9 lg:right-9"><b>{s.price}</b><span className="text-black/50">{s.time}</span></div>
      </motion.article>)}
    </div>
    <p className="mt-5 text-xs text-black/45">Ceny orientacyjne brutto. Dokładną cenę potwierdzamy po oględzinach samochodu.</p>
  </div></section>
}

function Projects() {
  return <section id="realizacje" className="bg-ink px-5 py-24 text-bone sm:px-8 sm:py-32 lg:px-12"><div className="mx-auto max-w-[1344px]">
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: .3 }} variants={reveal} className="mb-14 flex flex-col justify-between gap-8 sm:flex-row sm:items-end"><div><SectionLabel>Ostatnie realizacje</SectionLabel><h2 className="font-display text-4xl tracking-[-.045em] sm:text-6xl">Efekt mówi najwięcej.</h2></div><a href="https://instagram.com" className="flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white"><Instagram size={17} /> Więcej na Instagramie</a></motion.div>
    <div className="grid gap-5 md:grid-cols-2">
      {projects.map((p, i) => <motion.article key={p.car} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: .8, delay: (i % 2) * .1, ease: [0.22, 1, 0.36, 1] }} className="group overflow-hidden rounded-2xl bg-graphite">
        <motion.div initial={{ clipPath: 'inset(7% 0 7% 0)' }} whileInView={{ clipPath: 'inset(0% 0 0% 0)' }} viewport={{ once: true, amount: .25 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="relative aspect-[3/2] overflow-hidden">
          <motion.img src={p.image} alt={`${p.car} po usłudze: ${p.job}`} loading="lazy" initial={{ scale: 1.09, opacity: .55 }} whileInView={{ scale: 1, opacity: 1 }} whileHover={{ scale: 1.045 }} viewport={{ once: true, amount: .25 }} transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-20" /><span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.15em] backdrop-blur-md">Realizacja 0{i + 1}</span>
        </motion.div>
        <div className="flex items-center justify-between p-5 sm:p-6"><div><h3 className="font-display text-xl">{p.car}</h3><p className="mt-1 text-xs text-muted">{p.job}</p></div><span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.14em] text-white/35"><Check size={14} className="text-acid" /> Gotowe</span></div>
      </motion.article>)}
    </div>
    <div className="mt-10 flex items-start gap-4 border-t border-white/10 pt-7 text-sm leading-6 text-white/55"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-acid" /><p>Każdą realizację dokumentujemy w tym samym, neutralnym świetle — tak, aby efekt i stan lakieru były czytelne bez agresywnych filtrów.</p></div>
  </div></section>
}

function Process() {
  const steps = [['01', 'Krótka rozmowa', 'Napisz lub zadzwoń. Zapytamy o auto i efekt, na którym Ci zależy.'], ['02', 'Oględziny i wycena', 'Sprawdzamy stan na miejscu. Dostajesz jasny zakres, cenę i termin.'], ['03', 'Praca i dokumentacja', 'Realizujemy uzgodniony zakres i dokumentujemy najważniejsze etapy.'], ['04', 'Odbiór bez niespodzianek', 'Oglądamy efekt razem i przekazujemy proste zalecenia pielęgnacji.']]
  return <section id="o-studio" className="bg-graphite px-5 py-24 text-bone sm:px-8 sm:py-32 lg:px-12"><div className="mx-auto max-w-[1344px]">
    <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr]"><div className="lg:sticky lg:top-32 lg:self-start"><SectionLabel>Jak pracujemy</SectionLabel><h2 className="max-w-md font-display text-4xl leading-[1.04] tracking-[-.045em] sm:text-6xl">Spokojnie. Dokładnie. Po kolei.</h2><p className="mt-7 max-w-sm text-sm leading-6 text-white/55">Oddajesz nam rzecz, o którą dbasz. Dlatego na każdym etapie wiesz, co dzieje się z Twoim autem.</p></div>
      <div className="border-t border-white/15">{steps.map(([no, title, text], i) => <motion.div initial={{ opacity: 0, x: 35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .5 }} transition={{ duration: .6, delay: i * .05 }} key={no} className="grid gap-3 border-b border-white/15 py-8 sm:grid-cols-[80px_1fr_1.2fr] sm:items-start sm:py-10"><span className="text-xs font-bold text-acid">{no}</span><h3 className="font-display text-xl">{title}</h3><p className="text-sm leading-6 text-white/55">{text}</p></motion.div>)}</div>
    </div>
  </div></section>
}

function Pricing() {
  return <section id="cennik" className="bg-bone px-5 py-24 sm:px-8 sm:py-32 lg:px-12"><div className="mx-auto max-w-[1344px]">
    <div className="grid gap-12 lg:grid-cols-12"><div className="lg:col-span-5"><SectionLabel>Popularne pakiety</SectionLabel><h2 className="font-display text-4xl leading-[1.03] tracking-[-.045em] text-ink sm:text-6xl">Punkt wyjścia, nie drobny druk.</h2><p className="mt-7 max-w-md text-sm leading-6 text-black/55">Trzy najczęściej wybierane zakresy. Jeśli potrzebujesz czegoś innego, zbudujemy pakiet pod Twoje auto.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
        <PriceCard title="Odświeżenie" price="od 700 zł" desc="Dla auta, które potrzebuje solidnego resetu." items={['Mycie detailingowe', 'Dekontaminacja lakieru', 'Jednoetapowe odświeżenie', 'Odkurzanie wnętrza']} />
        <PriceCard featured title="Ochrona" price="od 2 400 zł" desc="Najlepszy balans wyglądu i trwałości." items={['Korekta lakieru', 'Powłoka ceramiczna 3 lata', 'Zabezpieczenie szyb', 'Pielęgnacja wnętrza']} />
        <PriceCard title="Wnętrze" price="od 450 zł" desc="Dokładne czyszczenie całej kabiny." items={['Odkurzanie i pranie', 'Czyszczenie tworzyw', 'Pielęgnacja skóry', 'Neutralizacja zapachów']} />
        <PriceCard title="PPF Front" price="od 4 900 zł" desc="Ochrona miejsc najbardziej narażonych." items={['Zderzak', 'Maska', 'Błotniki', 'Lusterka i wnęki klamek']} />
      </div></div>
  </div></section>
}

function PriceCard({ title, price, desc, items, featured }: { title: string, price: string, desc: string, items: string[], featured?: boolean }) {
  return <motion.article initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} whileHover={{ y: -6 }} transition={{ duration: .55 }} className={cn('relative rounded-2xl border p-7', featured ? 'border-ink bg-ink text-bone' : 'border-black/15 bg-white text-ink')}>
    {featured && <span className="absolute right-5 top-5 rounded-full bg-acid px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">Najczęściej wybierany</span>}
    <h3 className="font-display text-2xl">{title}</h3><p className={cn('mt-2 text-xs', featured ? 'text-white/50' : 'text-black/50')}>{desc}</p><p className="mt-8 font-display text-3xl">{price}</p>
    <ul className={cn('mt-6 space-y-3 border-t pt-6 text-sm', featured ? 'border-white/15 text-white/70' : 'border-black/10 text-black/65')}>{items.map(item => <li key={item} className="flex gap-3"><Check size={16} className="shrink-0 text-lime-600" />{item}</li>)}</ul>
  </motion.article>
}

function Testimonials() {
  const [active, setActive] = useState(0)
  useEffect(() => { const timer = window.setInterval(() => setActive(value => (value + 1) % testimonials.length), 6500); return () => window.clearInterval(timer) }, [])
  const change = (direction: number) => setActive(value => (value + direction + testimonials.length) % testimonials.length)

  return <section className="overflow-hidden bg-ink px-5 py-24 text-bone sm:px-8 sm:py-32 lg:px-12"><div className="mx-auto max-w-[1344px]">
    <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}><SectionLabel>Opinie klientów</SectionLabel></motion.div>
    <div className="grid gap-10 lg:grid-cols-[1.45fr_.55fr]">
      <div className="h-[500px] sm:h-[410px] lg:h-[350px] xl:h-[320px]"><AnimatePresence mode="wait">
        <motion.blockquote key={active} initial={{ opacity: 0, x: 35 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -25 }} transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }}>
          <div className="mb-7 flex gap-1 text-acid">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={17} fill="currentColor" />)}</div>
          <p className="font-display text-3xl leading-[1.18] tracking-[-.035em] sm:text-5xl">„{testimonials[active].quote}”</p>
          <footer className="mt-8 text-sm"><b>{testimonials[active].name}</b><span className="ml-3 text-white/45">{testimonials[active].car}</span></footer>
        </motion.blockquote>
      </AnimatePresence></div>
      <div className="flex flex-col justify-between border-t border-white/15 pt-7 lg:border-l lg:border-t-0 lg:pl-10">
        <div><div className="font-display text-6xl">4,9<span className="text-2xl text-white/40">/5</span></div><div className="mt-3 flex gap-1 text-acid">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={15} fill="currentColor" />)}</div><p className="mt-3 text-xs leading-5 text-white/45">Średnia ocen na podstawie 86 opinii klientów Google</p></div>
        <div className="mt-8 flex gap-3"><button onClick={() => change(-1)} className="grid size-12 place-items-center rounded-full border border-white/15 transition hover:border-acid hover:text-acid" aria-label="Poprzednia opinia"><ArrowLeft size={18} /></button><button onClick={() => change(1)} className="grid size-12 place-items-center rounded-full border border-white/15 transition hover:border-acid hover:text-acid" aria-label="Następna opinia"><ArrowRight size={18} /></button><span className="ml-auto self-center text-xs text-white/35">0{active + 1} / 0{testimonials.length}</span></div>
      </div>
    </div>
    <div className="mt-14 grid border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">{testimonials.map((item, i) => <button key={item.name} onClick={() => setActive(i)} className={cn('border-b border-white/10 px-0 py-5 text-left transition sm:px-5 lg:border-b-0 lg:border-r', active === i ? 'text-bone' : 'text-white/35 hover:text-white/65')}><span className="text-[10px] font-bold text-acid">0{i + 1}</span><b className="mt-2 block text-sm">{item.name}</b><span className="mt-1 block truncate text-[10px]">{item.car}</span></button>)}</div>
  </div></section>
}

function FAQ() {
  return <section className="bg-bone px-5 py-24 sm:px-8 sm:py-32 lg:px-12"><div className="mx-auto grid max-w-[1120px] gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><SectionLabel>Warto wiedzieć</SectionLabel><h2 className="font-display text-4xl tracking-[-.04em] text-ink sm:text-5xl">Bez niedomówień.</h2></div>
    <Accordion.Root type="single" collapsible className="border-t border-black/15">{faqs.map(([q, a], i) => <Accordion.Item value={`item-${i}`} key={q} className="group/item border-b border-black/15"><Accordion.Header><Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-6 text-left font-display text-lg text-ink transition hover:pl-2 sm:text-xl">{q}<span className="grid size-9 shrink-0 place-items-center rounded-full border border-black/15 transition duration-300 group-data-[state=open]:rotate-180 group-data-[state=open]:border-ink group-data-[state=open]:bg-ink group-data-[state=open]:text-white"><ChevronDown size={17} /></span></Accordion.Trigger></Accordion.Header><Accordion.Content className="accordion-content overflow-hidden text-sm leading-6 text-black/60"><motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="max-w-2xl pb-7 pr-10">{a}</motion.p></Accordion.Content></Accordion.Item>)}</Accordion.Root>
  </div></section>
}

function MapSection() {
  return <section className="bg-bone px-5 pb-24 sm:px-8 sm:pb-32 lg:px-12"><motion.div initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: .75, ease: [0.22, 1, 0.36, 1] }} className="mx-auto max-w-[1344px] overflow-hidden rounded-2xl bg-ink text-bone">
    <div className="grid lg:grid-cols-[.72fr_1.28fr]">
      <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12"><div><SectionLabel>Jak dojechać</SectionLabel><h2 className="font-display text-4xl leading-[1.05] tracking-[-.04em] sm:text-5xl">W centrum Łodzi.<br /><span className="text-white/40">Z wygodnym wjazdem.</span></h2><p className="mt-6 max-w-sm text-sm leading-6 text-white/55">Studio znajduje się przy ul. Targowej 35. Na miejscu możesz bezpiecznie zostawić samochód na czas realizacji.</p></div>
        <div className="mt-10 border-t border-white/10 pt-6"><div className="grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"><div><span className="block text-[10px] font-bold uppercase tracking-widest text-white/35">Adres</span><b className="mt-1.5 block">ul. Targowa 35<br />90-043 Łódź</b></div><div><span className="block text-[10px] font-bold uppercase tracking-widest text-white/35">Godziny</span><b className="mt-1.5 block">Pon.–Pt. 8:00–18:00<br />Sob. 9:00–14:00</b></div></div><a href="https://www.google.com/maps/dir/?api=1&destination=Targowa+35,+Łódź" target="_blank" rel="noreferrer" className="group mt-7 flex min-h-14 items-center justify-between rounded-full bg-acid px-6 font-bold text-ink transition hover:bg-white">Wyznacz trasę <span className="flex items-center gap-2"><Navigation size={17} /><ExternalLink size={15} className="opacity-45 transition group-hover:opacity-100" /></span></a></div>
      </div>
      <div className="relative min-h-[420px] overflow-hidden bg-[#d8d5cd] lg:min-h-[620px]"><iframe title="Mapa dojazdu do NOIR Detailing Studio" src="https://www.google.com/maps?q=Targowa%2035%2C%20Łódź&z=15&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0 grayscale-[75%] contrast-[1.05] transition duration-700 hover:grayscale-0" /><div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10" /></div>
    </div>
  </motion.div></section>
}

function Contact() {
  const [sent, setSent] = useState(false)
  const submit = (e: FormEvent) => { e.preventDefault(); setSent(true) }
  return <section id="kontakt" className="relative overflow-hidden bg-graphite px-5 py-24 text-bone sm:px-8 sm:py-32 lg:px-12"><div className="pointer-events-none absolute -right-40 top-0 size-[600px] rounded-full bg-acid/5 blur-3xl" /><div className="relative mx-auto grid max-w-[1344px] gap-14 lg:grid-cols-2">
    <div><SectionLabel>Kontakt</SectionLabel><h2 className="max-w-xl font-display text-4xl leading-[1.03] tracking-[-.045em] sm:text-6xl">Porozmawiajmy o Twoim aucie.</h2><p className="mt-7 max-w-md text-sm leading-6 text-white/55">Wyślij kilka informacji. Odezwiemy się w godzinach pracy, zwykle w ciągu 2 godzin. Wycena nic nie kosztuje.</p>
      <div className="mt-10 space-y-5 text-sm"><a href="tel:+48423070070" className="flex items-center gap-4"><span className="grid size-11 place-items-center rounded-full border border-white/15"><Phone size={18} /></span><div><span className="block text-xs text-white/40">Zadzwoń</span><b>42 307 00 70</b></div></a><div className="flex items-center gap-4"><span className="grid size-11 place-items-center rounded-full border border-white/15"><MapPin size={18} /></span><div><span className="block text-xs text-white/40">Przyjedź</span><b>ul. Targowa 35, Łódź</b></div></div></div>
    </div>
    <form onSubmit={submit} className="rounded-2xl bg-bone p-6 text-ink sm:p-9">{sent ? <div className="grid min-h-[420px] place-items-center text-center"><div><span className="mx-auto grid size-14 place-items-center rounded-full bg-acid"><Check /></span><h3 className="mt-6 font-display text-3xl">Dziękujemy.</h3><p className="mt-3 text-sm text-black/55">Wiadomość dotarła. Odezwiemy się w godzinach pracy.</p></div></div> : <>
      <div className="grid gap-5 sm:grid-cols-2"><Field label="Imię" name="name" placeholder="Jak masz na imię?" /><Field label="Telefon" name="phone" placeholder="000 000 000" type="tel" /></div><Field label="Samochód" name="car" placeholder="Np. Audi A4, 2019" /><label className="mt-5 block text-xs font-bold">Interesuje mnie<select name="service" className="mt-2 min-h-12 w-full appearance-none rounded-lg border border-black/15 bg-white px-4 text-sm outline-none focus:border-black"><option>Wybierz usługę</option>{services.map(s => <option key={s.no}>{s.title}</option>)}</select></label><label className="mt-5 block text-xs font-bold">Kilka słów o aucie<textarea name="message" rows={3} placeholder="Co chcesz poprawić lub zabezpieczyć?" className="mt-2 w-full resize-none rounded-lg border border-black/15 bg-white p-4 text-sm outline-none placeholder:text-black/35 focus:border-black" /></label><label className="mt-5 flex gap-3 text-[11px] leading-5 text-black/50"><input required type="checkbox" className="mt-1 accent-black" /> Zgadzam się na kontakt w sprawie wyceny i akceptuję politykę prywatności.</label><button className="mt-6 flex min-h-14 w-full items-center justify-between rounded-full bg-ink px-7 font-bold text-white transition hover:bg-acid hover:text-ink">Wyślij zapytanie <ArrowRight size={18} /></button></>}
    </form>
  </div></section>
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) { return <label className="mt-5 block text-xs font-bold first:mt-0 sm:[.grid_&]:mt-0">{label}<input required {...props} className="mt-2 min-h-12 w-full rounded-lg border border-black/15 bg-white px-4 text-sm outline-none placeholder:text-black/35 focus:border-black" /></label> }

function Footer() {
  return <footer className="bg-ink px-5 pb-24 pt-16 text-bone sm:px-8 lg:px-12 lg:pb-10"><div className="mx-auto max-w-[1344px]"><div className="grid gap-10 border-b border-white/10 pb-14 sm:grid-cols-2 lg:grid-cols-4"><div className="sm:col-span-2"><Logo /><p className="mt-5 max-w-sm text-xs leading-5 text-white/40">Studio pielęgnacji i ochrony samochodów w Łodzi. Dobre rzemiosło, jasne zasady, trwały efekt.</p></div><div className="text-sm"><b className="mb-4 block text-xs uppercase tracking-widest text-white/35">Studio</b><p>ul. Targowa 35<br />90-043 Łódź</p></div><div className="text-sm"><b className="mb-4 block text-xs uppercase tracking-widest text-white/35">Kontakt</b><a href="tel:+48423070070" className="block">42 307 00 70</a><a href="mailto:studio@noirdetailing.pl" className="mt-2 block text-white/60">studio@noirdetailing.pl</a></div></div><div className="flex flex-col gap-4 pt-7 text-[11px] text-white/35 sm:flex-row sm:justify-between"><p>© 2026 NOIR Detailing Studio</p><div className="flex gap-5"><Link to="/polityka-prywatnosci">Polityka prywatności</Link><span>NIP 725 230 41 82</span></div></div></div></footer>
}

function Home() {
  const [loaded, setLoaded] = useState(false)
  return <>
    <AnimatePresence>{!loaded && <Loader onComplete={() => setLoaded(true)} />}</AnimatePresence>
    {loaded && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .35 }}>
      <ScrollProgress /><Header /><main><Hero /><TrustStrip /><Services /><Projects /><Process /><Pricing /><Testimonials /><FAQ /><MapSection /><Contact /></main><Footer />
      <motion.a initial={{ y: 90 }} animate={{ y: 0 }} transition={{ delay: .8, type: 'spring', stiffness: 180, damping: 22 }} href="tel:+48423070070" className="fixed bottom-3 left-3 right-3 z-40 flex min-h-14 items-center justify-between rounded-full bg-acid px-6 font-bold text-ink shadow-2xl sm:hidden">Zadzwoń i umów wycenę <Phone size={18} /></motion.a>
    </motion.div>}
  </>
}

function Privacy() { return <div className="min-h-screen bg-bone text-ink"><div className="bg-ink px-5 py-6"><div className="mx-auto max-w-4xl"><Logo /></div></div><main className="mx-auto max-w-4xl px-5 py-20"><Link to="/" className="text-sm">← Wróć na stronę</Link><h1 className="mt-10 font-display text-5xl">Polityka prywatności</h1><div className="mt-10 space-y-7 text-sm leading-7 text-black/65"><p>Administratorem danych osobowych przesłanych przez formularz jest NOIR Detailing Studio, ul. Targowa 35, 90-043 Łódź.</p><h2 className="font-display text-2xl text-ink">W jakim celu przetwarzamy dane?</h2><p>Dane podane w formularzu wykorzystujemy wyłącznie do przygotowania wyceny i kontaktu w sprawie usługi. Podstawą przetwarzania jest podjęcie działań na Twoje żądanie przed zawarciem umowy.</p><h2 className="font-display text-2xl text-ink">Jak długo przechowujemy dane?</h2><p>Zapytania, które nie prowadzą do realizacji usługi, usuwamy po 6 miesiącach. Dokumentację zrealizowanych usług przechowujemy przez okres wymagany przepisami podatkowymi.</p><h2 className="font-display text-2xl text-ink">Twoje prawa</h2><p>Masz prawo dostępu do danych, ich poprawienia, usunięcia, ograniczenia przetwarzania i wniesienia sprzeciwu. Napisz na studio@noirdetailing.pl.</p></div></main></div> }

function ScrollTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default function App() { return <><ScrollTop /><Routes><Route path="/" element={<Home />} /><Route path="/polityka-prywatnosci" element={<Privacy />} /><Route path="*" element={<Home />} /></Routes></> }
