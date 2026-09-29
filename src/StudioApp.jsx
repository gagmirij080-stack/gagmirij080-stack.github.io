import { useState } from "react";

const marqueeItems = ["Лендинги", "Магазины", "Дашборды", "Айдентика", "Упаковка бренда", "Презентации", "Figma-киты"];

const works = [
  { num: "01", name: "«Вихрь»", desc: "AI-сервис генерации текстов", tag: "Лендинг", metric: "+34%", metricText: "к заявкам" },
  { num: "02", name: "«Кедр»", desc: "Маркетплейс обуви ручной работы", tag: "Интернет-магазин", metric: "×2,1", metricText: "к оплатам" },
  { num: "03", name: "«Точка»", desc: "Мобильный банк для фрилансеров", tag: "Продуктовый UI", metric: "−40%", metricText: "обращений в поддержку" },
];

const steps = [
  { num: "01", title: "Бриф и аналитика", text: "Разбираем продукт, конкурентов и целевую аудиторию. Фиксируем цели сайта в цифрах." },
  { num: "02", title: "Прототип за 2 дня", text: "Структура и блоки в wireframe — уже видно, куда ведём посетителя." },
  { num: "03", title: "Дизайн в Figma", text: "Два-три концепта на выбор, доработка до финала, дизайн-система под проект." },
  { num: "04", title: "Вёрстка и запуск", text: "React + Tailwind, адаптив, скорость, SEO-основа. Сдаём с исходниками." },
];

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Работы", href: "#works" },
    { label: "Процесс", href: "#process" },
    { label: "Контакты", href: "#contacts" },
  ];
  return (
    <header className="sticky top-0 z-50 bg-stone-100 border-b-2 border-black">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <a href="#" className="display text-xl font-black text-black">
          ФОРМА<span className="text-lime-400">.</span>
        </a>
        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="text-sm font-semibold uppercase tracking-wide text-stone-600 hover:text-black transition-colors">
              {l.label}
            </a>
          ))}
          <a href="#contacts" className="border-2 border-black bg-black px-5 py-2 text-sm font-bold uppercase text-white hover:bg-lime-300 hover:text-black transition-colors">
            Обсудить проект
          </a>
        </nav>
        <button className="md:hidden w-10 h-10 flex items-center justify-center border-2 border-black" onClick={() => setOpen(!open)} aria-label="Меню">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-5 h-5">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t-2 border-black bg-stone-100 px-4 py-3 flex flex-col gap-3">
          {links.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-sm font-semibold uppercase text-stone-700">
              {l.label}
            </a>
          ))}
          <a href="#contacts" onClick={() => setOpen(false)} className="border-2 border-black bg-black px-5 py-2 text-center text-sm font-bold uppercase text-white">
            Обсудить проект
          </a>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="border-b-2 border-black">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap justify-between gap-2 border-b border-black/20 py-3 text-xs font-semibold uppercase tracking-widest text-stone-500">
          <span>Студия цифрового дизайна</span>
          <span>Москва · удалённо</span>
          <span>с 2019 года</span>
        </div>
        <div className="py-14 md:py-24 text-center">
          <h1 className="display text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight text-black">
            САЙТЫ, КОТОРЫЕ
            <br />
            <span className="bg-lime-300 px-3">ПРОДАЮТ</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base md:text-lg text-stone-600">
            Проектируем и вёрстаем лендинги, магазины и интерфейсы с фокусом на заявки и продажи, а не на красоту ради красоты.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#contacts" className="w-full sm:w-auto border-2 border-black bg-black px-8 py-3.5 font-bold uppercase text-white hover:bg-lime-300 hover:text-black transition-colors">
              Обсудить проект
            </a>
            <a href="#works" className="w-full sm:w-auto border-2 border-black px-8 py-3.5 font-bold uppercase text-black hover:bg-black hover:text-white transition-colors">
              Смотреть работы
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const line = [...marqueeItems, ...marqueeItems];
  return (
    <div className="border-b-2 border-black bg-black overflow-hidden">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {line.map((item, i) => (
              <span key={`${copy}-${i}`} className="display flex items-center gap-6 px-6 py-4 text-sm md:text-base font-bold uppercase text-lime-300">
                {item}
                <span className="text-white/40">✳</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Works() {
  return (
    <section id="works" className="border-b-2 border-black">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="flex items-end justify-between gap-4">
          <h2 className="display text-3xl md:text-5xl font-black text-black">РАБОТЫ</h2>
          <span className="text-xs font-semibold uppercase tracking-widest text-stone-500">Выборка за2025–2026</span>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {works.map((w) => (
            <div key={w.num} className="border-2 border-black bg-white p-6 hover:bg-lime-300 transition-colors group">
              <div className="flex items-center justify-between">
                <span className="display text-sm font-black text-stone-400 group-hover:text-black">{w.num}</span>
                <span className="border border-black px-2 py-0.5 text-[11px] font-bold uppercase">{w.tag}</span>
              </div>
              <h3 className="display mt-5 text-xl font-black text-black">{w.name}</h3>
              <p className="mt-1 text-sm text-stone-600 group-hover:text-stone-800">{w.desc}</p>
              <div className="mt-6 border-t-2 border-black pt-4">
                <span className="display text-3xl font-black text-black">{w.metric}</span>
                <span className="ml-2 text-xs font-semibold uppercase text-stone-500 group-hover:text-stone-700">{w.metricText}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="border-b-2 border-black bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <h2 className="display text-3xl md:text-5xl font-black text-black">ПРОЦЕСС</h2>
        <p className="mt-3 text-stone-500">Прозрачно: сроки, этапы и правки фиксируем в договоре</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.num} className="border-2 border-black p-5 bg-stone-100">
              <span className="display text-4xl font-black text-lime-400">{s.num}</span>
              <h3 className="mt-3 font-bold text-black">{s.title}</h3>
              <p className="mt-2 text-sm text-stone-600">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section id="contacts" className="border-b-2 border-black bg-black">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 text-center">
        <h2 className="display text-4xl md:text-6xl font-black text-white">
          ЕСТЬ ЗАДАЧА?
          <br />
          <span className="text-lime-300">НАПИШИТЕ</span>
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-stone-400">
          Ответим в течение часа, смету и сроки — в тот же день. Первую консультацию даём бесплатно.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="mailto:hello@example.com" className="w-full sm:w-auto border-2 border-lime-300 bg-lime-300 px-8 py-3.5 font-bold uppercase text-black hover:bg-transparent hover:text-lime-300 transition-colors">
            Написать на почту
          </a>
          <a href="#" className="w-full sm:w-auto border-2 border-white px-8 py-3.5 font-bold uppercase text-white hover:bg-white hover:text-black transition-colors">
            Telegram
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-stone-100">
      <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wide text-stone-500">
        <span>© 2026 Студия «Форма»</span>
        <span>hello@example.com · +7 (999) 123-45-67</span>
      </div>
    </footer>
  );
}

export default function StudioApp() {
  return (
    <div className="min-h-screen bg-stone-100 antialiased">
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Works />
        <Process />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
