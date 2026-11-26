import Link from "next/link";
import { redirect } from "next/navigation";
import { Activity, ArrowDownRight, ArrowUpRight, Bell, Bookmark, Bot, Boxes, ChartNoAxesCombined, CircleHelp, Clock3, ExternalLink, LayoutDashboard, LogOut, Plus, Search, Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Zap } from "lucide-react";
import { getDashboardData } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

const money = (n: number) => new Intl.NumberFormat("ru-RU").format(n) + " ₽";

export default async function Home() {
  const liveAuth = process.env.NEXT_PUBLIC_USE_SUPABASE === "true";
  if (liveAuth) {
    const supabase = await createClient();
    const { data: { claims } } = await supabase.auth.getClaims();
    if (!claims) redirect("/login");
  }

  const { monitors, listings, connected } = await getDashboardData();
  const active = monitors.filter((m) => m.is_active).length;
  const savings = listings.reduce((sum, item) => sum + Math.max(0, Math.round(item.price * ((item.discount_percent ?? 0) / 100))), 0);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <Link href="/" className="brand"><span className="brand-mark"><Zap size={19} fill="currentColor"/></span><span>deal<span className="brand-accent">hunter</span><small>INTELLIGENCE PANEL</small></span></Link>
        <div className="workspace"><div className="workspace-avatar">P</div><div><b>Personal workspace</b><small>Личный аккаунт</small></div><span className="online-dot"/></div>
        <div className="nav-label">РАБОЧЕЕ ПРОСТРАНСТВО</div>
        <nav className="nav-list">
          <a className="nav-item active" href="#"><LayoutDashboard size={17}/>Обзор<span className="nav-indicator"/></a>
          <a className="nav-item" href="#monitors"><Search size={17}/>Мониторинги<span className="nav-count">{monitors.length}</span></a>
          <a className="nav-item" href="#listings"><Boxes size={17}/>Найденные товары<span className="nav-count">{listings.length}</span></a>
          <a className="nav-item" href="#listings"><Bookmark size={17}/>Избранное</a>
          <a className="nav-item" href="#analytics"><ChartNoAxesCombined size={17}/>Аналитика</a>
        </nav>
        <div className="nav-label nav-label-spaced">ИНТЕГРАЦИИ</div>
        <nav className="nav-list">
          <a className="nav-item" href="#telegram"><Bot size={17}/>Telegram-бот<span className="status-pill">SETUP</span></a>
          <a className="nav-item" href="#settings"><Settings2 size={17}/>Настройки</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="plan-card"><div className="plan-icon"><Sparkles size={16}/></div><b>Deal Hunter MVP</b><p>Базовый контур мониторинга готов к настройке.</p><div className="plan-progress"><span/></div><small>ЭТАП 1 ИЗ 5</small></div>
          <div className="profile-row"><div className="profile-avatar">P</div><div><b>Владелец</b><small>{connected ? "Supabase подключён" : "Демо-режим"}</small></div><ShieldCheck size={16} className="profile-shield"/></div>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar"><div className="breadcrumbs">Workspace <span>/</span> <b>Обзор</b></div><div className="top-actions"><span className="live-indicator"><i/>SYSTEM ONLINE</span><button className="icon-button" aria-label="Уведомления"><Bell size={17}/><i/></button><div className="top-avatar">P</div></div></header>
        <div className="content">
          <div className="welcome-row"><div><div className="eyebrow"><span/> THURSDAY, 26 NOVEMBER 2026</div><h1>Панель <span>мониторинга</span></h1><p className="subheading">Отслеживай рынок. Находи недооценённые предложения первым.</p></div><a className="primary-button" href="#monitors"><Plus size={17}/> Новый мониторинг</a></div>

          {!connected && <div className="demo-banner"><div className="demo-icon"><Activity size={17}/></div><div><b>Демонстрационный режим</b><p>Показаны тестовые данные. Подключи Supabase, чтобы сохранять собственные мониторинги.</p></div><a href="#settings">Настроить <ExternalLink size={13}/></a></div>}

          <div className="section-heading"><div><h2>Общая статистика</h2><p>Сводка по твоим поисковым сценариям</p></div><span className="period-chip"><Clock3 size={13}/> За всё время</span></div>
          <div className="stats-grid">
            <article className="stat-card"><div className="stat-top"><span>Активные мониторинги</span><span className="stat-icon purple"><Search size={17}/></span></div><div className="stat-value">{active}<small> / {monitors.length}</small></div><div className="stat-foot"><span className="trend neutral"><Activity size={13}/> {active} работают</span><span>Поисковые запросы</span></div></article>
            <article className="stat-card"><div className="stat-top"><span>Найдено объявлений</span><span className="stat-icon blue"><Boxes size={17}/></span></div><div className="stat-value">{listings.length.toString().padStart(2,"0")}</div><div className="stat-foot"><span className="trend up"><ArrowUpRight size={13}/> Новые находки</span><span>В текущей выборке</span></div></article>
            <article className="stat-card"><div className="stat-top"><span>Средняя выгода</span><span className="stat-icon green"><ArrowDownRight size={17}/></span></div><div className="stat-value">{listings.length ? Math.round(listings.reduce((s,x)=>s+(x.discount_percent??0),0)/listings.length) : 0}<small>%</small></div><div className="stat-foot"><span className="trend up"><ArrowDownRight size={13}/> Ниже ориентира</span><span>По найденным лотам</span></div></article>
            <article className="stat-card"><div className="stat-top"><span>Потенциальная экономия</span><span className="stat-icon amber"><Sparkles size={17}/></span></div><div className="stat-value compact">{money(savings)}</div><div className="stat-foot"><span className="trend neutral">Расчётная оценка</span><span>Не гарантированная прибыль</span></div></article>
          </div>

          <div className="two-column">
            <section className="panel" id="monitors"><div className="panel-header"><div><h2>Активные мониторинги</h2><p>Твои поисковые правила</p></div><a className="text-link" href="#settings">Все мониторинги <ArrowUpRight size={14}/></a></div>
              <div className="monitor-list">{monitors.map((m,i)=><div className="monitor-row" key={m.id}><div className={`product-symbol symbol-${i%3}`}>{["IP","PS","MB"][i%3]}</div><div className="monitor-info"><b>{m.title}</b><small>{m.region} · до {m.max_price ? money(m.max_price) : "без лимита"}</small></div><div className="monitor-meta"><span className={m.is_active?"active-tag":"paused-tag"}><i/>{m.is_active?"Активен":"Пауза"}</span><small>−{m.min_discount_percent}% от ориентира</small></div><button className="more-button" aria-label="Действия">···</button></div>)}</div>
              <a className="add-monitor" href="#settings"><Plus size={15}/> Добавить поисковое правило</a>
            </section>
            <section className="panel opportunity-panel" id="analytics"><div className="panel-header"><div><h2>Индекс возможностей</h2><p>Оценка текущей выборки</p></div><span className="spark-tag"><Sparkles size={13}/> INSIGHT</span></div><div className="opportunity-score"><div><strong>{listings.length ? Math.round(listings.reduce((s,x)=>s+(x.discount_percent??0),0)/listings.length) : 0}<small>/100</small></strong><span>Средняя скидка, %</span></div><div className="score-ring"><div><b>{listings.length}</b><small>ЛОТОВ</small></div></div></div><div className="score-track"><span style={{width:`${Math.min(100, listings.length ? listings.reduce((s,x)=>s+(x.discount_percent??0),0)/listings.length : 0)}%`}}/></div><div className="insight-note"><Sparkles size={15}/><span>Система ранжирует предложения по отклонению цены. Подключение реального ценового ориентира — следующий этап.</span></div></section>
          </div>

          <section className="panel listings-panel" id="listings"><div className="panel-header"><div><h2>Последние находки</h2><p>Объявления, прошедшие твои фильтры</p></div><div className="listing-tools"><button className="filter-button"><SlidersHorizontal size={14}/> Фильтры</button><a className="text-link" href="#listings">Все объявления <ArrowUpRight size={14}/></a></div></div>
            <div className="table-wrap"><table><thead><tr><th>ТОВАР</th><th>ЦЕНА</th><th>РЕГИОН</th><th>ОТКЛОНЕНИЕ</th><th>СТАТУС</th><th/></tr></thead><tbody>{listings.map((l,i)=><tr key={l.id}><td><div className="listing-name"><div className={`listing-thumb thumb-${i%3}`}>{["PH","PS","MB","PH"][i%4]}</div><div><b>{l.title}</b><small>Источник: {l.source==="demo"?"Демо-данные":l.source}</small></div></div></td><td><b className="price">{money(l.price)}</b></td><td className="muted-cell">{l.region??"—"}</td><td><span className="discount">−{l.discount_percent??0}%</span></td><td><span className="found-status"><i/>Найдено</span></td><td><a className="open-link" href={l.url} target="_blank" rel="noreferrer" aria-label="Открыть объявление"><ExternalLink size={15}/></a></td></tr>)}</tbody></table></div>
            <div className="table-footer"><span>Показано {listings.length} из {listings.length} объявлений</span><span>Обновление: ожидает подключения источника</span></div>
          </section>

          <div className="bottom-grid">
            <section className="panel integration-card" id="telegram"><div className="integration-head"><div className="telegram-icon"><Bot size={20}/></div><span className="paused-tag">НЕ ПОДКЛЮЧЁН</span></div><h3>Telegram уведомления</h3><p>Получай новые находки и сигналы о снижении цены прямо в личный чат.</p><a href="#settings" className="secondary-button">Настроить интеграцию <ArrowUpRight size={14}/></a></section>
            <section className="panel integration-card" id="settings"><div className="integration-head"><div className="source-icon"><ShieldCheck size={20}/></div><span className="paused-tag">ТРЕБУЕТ НАСТРОЙКИ</span></div><h3>Источник объявлений</h3><p>Подключи разрешённый источник данных. Сбор объявлений пока не запущен.</p><a href="https://www.avito.ru/" target="_blank" rel="noreferrer" className="secondary-button">Открыть Avito <ExternalLink size={14}/></a></section>
          </div>
          <footer className="footer"><span>DEAL HUNTER <b>v0.1.0</b></span><span><ShieldCheck size={13}/> Private workspace · <a href="https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs">Auth docs</a></span></footer>
        </div>
      </section>
    </main>
  );
}
