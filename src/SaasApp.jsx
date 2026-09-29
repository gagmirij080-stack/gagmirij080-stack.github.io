import { useState } from "react";

const features = [
  {
    title: "Воронки и юнит-экономика",
    text: "Собирайте воронки из событий без SQL: регистрация → оплата → повторная покупка. Считает CAC, LTV и конверсии автоматически.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 4h18l-7 8v7l-4 2v-9L3 4z" />
      </svg>
    ),
  },
  {
    title: "A/B-тесты из коробки",
    text: "Запускайте эксперименты на интерфейсе без разработчиков. Статистическая значимость и выводы — на одном экране.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M8 3v18M16 3v18M4 8h8M12 16h8" />
      </svg>
    ),
  },
  {
    title: "Отчёты в Slack",
    text: "Ежедневная сводка ключевых метрик приходит в канал команды. Алерты о просадках — за минуту, а не за неделю.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
        <path d="M10 21a2 2 0 0 0 4 0" />
      </svg>
    ),
  },
];

const plans = [
  {
    name: "Старт",
    price: "0 ₽",
    period: "всегда бесплатно",
    items: ["10 000 событий в месяц", "2 проекта", "Воронки и дашборды", "Email-поддержка"],
    cta: "Начать",
    featured: false,
  },
  {
    name: "Про",
    price: "1 490 ₽",
    period: "в месяц",
    items: ["500 000 событий", "Безлимит проектов", "A/B-тесты", "Отчёты в Slack", "Приоритетная поддержка"],
    cta: "14 дней бесплатно",
    featured: true,
  },
  {
    name: "Бизнес",
    price: "4 990 ₽",
    period: "в месяц",
    items: ["Безлимит событий", "SSO и роли доступа", "Выгрузка в БД", "Персональный менеджер"],
    cta: "Связаться",
    featured: false,
  },
];

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Возможности", href: "#features" },
    { label: "Тарифы", href: "#pricing" },
    { label: "Документация", href: "#" },
  ];
  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur border-b border-slate-800">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 font-extrabold text-lg text-white">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M2 12h4l3-8 4 16 3-8h6" />
            </svg>
          </span>
          Пульс
        </a>
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
          <a href="#pricing" className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-200 transition-colors">
            Попробовать
          </a>
        </nav>
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-slate-200 hover:bg-slate-800"
          onClick={() => setOpen(!open)}
          aria-label="Меню"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-6 h-6">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 flex flex-col gap-3">
          {links.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium text-slate-200">
              {l.label}
            </a>
          ))}
          <a href="#pricing" onClick={() => setOpen(false)} className="rounded-full bg-white px-5 py-2 text-center text-sm font-semibold text-slate-900">
            Попробовать
          </a>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  const bars = [38, 55, 42, 68, 60, 82, 74, 95];
  return (
    <section className="relative overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-indigo-600/25 blur-3xl pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
        <div className="text-center">
          <span className="inline-block rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-1.5 text-xs md:text-sm font-medium text-indigo-300">
            Новый: авто-отчёты на основе ИИ
          </span>
          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Аналитика продукта
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
              без SQL и ожидания
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base md:text-lg text-slate-400">
            События, воронки и A/B-тесты в одном дашборде. Подключение за10 минут — просто вставьте сниппет.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#pricing" className="w-full sm:w-auto rounded-full bg-indigo-500 px-8 py-3.5 font-semibold text-white hover:bg-indigo-400 transition-colors">
              Начать бесплатно
            </a>
            <a href="#features" className="w-full sm:w-auto rounded-full border border-slate-700 px-8 py-3.5 font-semibold text-slate-200 hover:bg-slate-800 transition-colors">
              Как это работает
            </a>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/70 p-5 md:p-7 shadow-2xl shadow-indigo-950/50 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">Активные пользователи</p>
              <p className="mt-1 text-2xl md:text-3xl font-extrabold text-white">
                12 480 <span className="text-sm font-semibold text-emerald-400">+18,2%</span>
              </p>
            </div>
            <div className="flex gap-1.5 text-slate-600 text-sm">
              <span className="w-3 h-3 rounded-full bg-slate-700" />
              <span className="w-3 h-3 rounded-full bg-slate-700" />
              <span className="w-3 h-3 rounded-full bg-slate-700" />
            </div>
          </div>
          <div className="mt-6 flex h-40 items-end gap-2 md:gap-3">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-lg bg-gradient-to-t from-indigo-600 to-cyan-400"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs text-slate-600">
            <span>пн</span>
            <span>вт</span>
            <span>ср</span>
            <span>чт</span>
            <span>пт</span>
            <span>сб</span>
            <span>вс</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Social() {
  return (
    <section className="border-y border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm font-semibold text-slate-500">
        <span>Доверяют команды:</span>
        <span className="text-slate-400">Nordwind</span>
        <span className="text-slate-400">Точка роста</span>
        <span className="text-slate-400">Lab24</span>
        <span className="text-slate-400">Фабрика Сайтов</span>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-white">Всё, что нужно продакт-команде</h2>
      <p className="mt-3 text-center text-slate-400">Три инструмента вместо пяти подписок</p>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 hover:border-indigo-500/50 hover:bg-slate-900 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">{f.icon}</div>
            <h3 className="mt-4 font-bold text-white">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="bg-slate-900/40">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-white">Прозрачные тарифы</h2>
        <p className="mt-3 text-center text-slate-400">Без скрытых платежей, отмена в один клик</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3 items-start">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-3xl border p-6 md:p-7 ${
                p.featured
                  ? "border-indigo-500 bg-slate-900 shadow-xl shadow-indigo-950/60 relative"
                  : "border-slate-800 bg-slate-900/50"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-3 py-1 text-xs font-bold text-white">
                  Популярный
                </span>
              )}
              <h3 className="font-bold text-slate-300">{p.name}</h3>
              <p className="mt-3 text-3xl font-extrabold text-white">{p.price}</p>
              <p className="text-xs text-slate-500">{p.period}</p>
              <ul className="mt-5 space-y-2.5">
                {p.items.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 shrink-0 text-cyan-400">
                      <path d="M4 12l5 5L20 6" />
                    </svg>
                    {i}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-6 w-full rounded-full py-3 text-sm font-semibold transition-colors ${
                  p.featured
                    ? "bg-indigo-500 text-white hover:bg-indigo-400"
                    : "border border-slate-700 text-slate-200 hover:bg-slate-800"
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <span className="font-semibold text-slate-300">© 2026 Пульс — аналитика продукта</span>
        <div className="flex items-center gap-5">
          <a href="#" className="hover:text-white transition-colors">
            Документация
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Блог
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Вакансии
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function SaasApp() {
  return (
    <div className="min-h-screen bg-slate-950 antialiased">
      <Header />
      <main>
        <Hero />
        <Social />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
