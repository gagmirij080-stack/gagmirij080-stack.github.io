import { useState } from "react";

const features = [
  {
    title: "Свежая обжарка",
    text: "Зёрна обжариваем каждое утро — в чашке только свежий вкус, никакой пыли со склада.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M4 8h12v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8z" />
        <path d="M16 9h2a2 2 0 0 1 0 4h-2" />
        <path d="M7 2v3M11 2v3M15 2v3" />
      </svg>
    ),
  },
  {
    title: "Доставка за 30 минут",
    text: "Привезём горячий кофе и завтрак в любую точку города. Иначе — напиток за наш счёт.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="1" y="6" width="13" height="10" rx="1" />
        <path d="M14 9h4l4 4v3h-8" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </svg>
    ),
  },
  {
    title: "Авторские напитки",
    text: "Бариста с призовыми местами на чемпионатах. Сезонное меню обновляется каждый месяц.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z" />
      </svg>
    ),
  },
  {
    title: "Уютное место",
    text: "Мягкие кресла, Wi-Fi и розетки у каждого стола — приходи работать и отдыхать.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M5 11V8a2 2 0 0 1 4 0v3h6V8a2 2 0 0 1 4 0v3" />
        <rect x="3" y="11" width="18" height="6" rx="2" />
        <path d="M6 17v3M18 17v3" />
      </svg>
    ),
  },
];

const menu = [
  { name: "Капучино", desc: "Плотная пенка, зерно Бразилия", price: "250 ₽" },
  { name: "Раф солёной карамелью", desc: "Сливки, карамель, морская соль", price: "320 ₽" },
  { name: "Фильтр Эфиопия", desc: "Ягоды, цитрус, чайные ноты", price: "280 ₽" },
];

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Меню", href: "#menu" },
    { label: "Преимущества", href: "#features" },
    { label: "Контакты", href: "#contacts" },
  ];
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-stone-200">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 font-extrabold text-lg text-stone-900">
          <span className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M4 8h12v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8z" />
              <path d="M16 9h2a2 2 0 0 1 0 4h-2" />
            </svg>
          </span>
          Обжарка
        </a>
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors">
              {l.label}
            </a>
          ))}
          <a href="#contacts" className="rounded-full bg-amber-600 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition-colors">
            Заказать
          </a>
        </nav>
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-stone-700 hover:bg-stone-100"
          onClick={() => setOpen(!open)}
          aria-label="Меню"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-6 h-6">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-stone-200 bg-white px-4 py-3 flex flex-col gap-3">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium text-stone-700">
              {l.label}
            </a>
          ))}
          <a href="#contacts" onClick={() => setOpen(false)} className="rounded-full bg-amber-600 px-5 py-2 text-center text-sm font-semibold text-white">
            Заказать
          </a>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="animate-gradient bg-gradient-to-br from-amber-500 via-orange-500 to-stone-800 text-white">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28 text-center">
        <span className="inline-block rounded-full bg-white/15 border border-white/25 px-4 py-1.5 text-xs md:text-sm font-medium backdrop-blur">
          Обжариваем каждое утро с 2018 года
        </span>
        <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight">
          Кофе, который бодрит
          <br />
          по-настоящему
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base md:text-lg text-white/85">
          Свежая обжарка, авторские напитки от бариста и доставка за 30 минут — или уютное место в центре города.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="#menu" className="w-full sm:w-auto rounded-full bg-white px-8 py-3.5 font-semibold text-amber-700 hover:bg-amber-50 transition-colors">
            Смотреть меню
          </a>
          <a href="#contacts" className="w-full sm:w-auto rounded-full border border-white/40 px-8 py-3.5 font-semibold text-white hover:bg-white/10 transition-colors">
            Заказать доставку
          </a>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-stone-900">Почему нас любят</h2>
      <p className="mt-3 text-center text-stone-500">Четыре вещи, ради которых возвращаются снова</p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="rounded-3xl bg-white border border-stone-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">{f.icon}</div>
            <h3 className="mt-4 font-bold text-stone-900">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-500">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Menu() {
  return (
    <section id="menu" className="bg-stone-100">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-stone-900">Популярные напитки</h2>
        <p className="mt-3 text-center text-stone-500">Полное меню — в кофейне и приложении</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {menu.map((m) => (
            <div key={m.name} className="rounded-3xl bg-white border border-stone-200 p-6 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-stone-900">{m.name}</h3>
                <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">{m.price}</span>
              </div>
              <p className="mt-2 text-sm text-stone-500">{m.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-3xl bg-stone-900 text-white p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="text-xl md:text-2xl font-extrabold">Первый кофе — со скидкой 10%</h3>
            <p className="mt-1 text-sm text-stone-300">Скажи промокод «FIRST» на кассе или впиши в заказе</p>
          </div>
          <a href="#contacts" className="w-full md:w-auto rounded-full bg-amber-500 px-8 py-3.5 text-center font-semibold text-white hover:bg-amber-400 transition-colors">
            Заказать
          </a>
        </div>
      </div>
    </section>
  );
}

function Contacts() {
  return (
    <section id="contacts" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-stone-900">Контакты</h2>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          { title: "Адрес", lines: ["ул. Пушкина, 10", "ежедневно 8:00 — 22:00"] },
          { title: "Телефон", lines: ["+7 (999) 123-45-67", "звонок и Telegram"] },
          { title: "Доставка", lines: ["от 300 ₽ — бесплатно", "по центру за 30 минут"] },
        ].map((c) => (
          <div key={c.title} className="rounded-3xl bg-white border border-stone-200 p-6 text-center shadow-sm">
            <h3 className="font-bold text-stone-900">{c.title}</h3>
            {c.lines.map((l) => (
              <p key={l} className="mt-1 text-sm text-stone-500">
                {l}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-stone-500">
        <span className="font-semibold text-stone-800">© 2026 Кофейня «Обжарка»</span>
        <div className="flex items-center gap-5">
          <a href="#" className="hover:text-amber-700 transition-colors">
            Telegram
          </a>
          <a href="#" className="hover:text-amber-700 transition-colors">
            VK
          </a>
          <a href="#" className="hover:text-amber-700 transition-colors">
            Вакансии
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-stone-50 antialiased">
      <Header />
      <main>
        <Hero />
        <Features />
        <Menu />
        <Contacts />
      </main>
      <Footer />
    </div>
  );
}
