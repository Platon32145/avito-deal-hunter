"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Zap, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [mode,setMode] = useState<"login"|"signup">("login");
  const [message,setMessage] = useState("");
  const [busy,setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMessage("");
    try {
      const supabase = createClient();
      const result = mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
      if (result.error) throw result.error;
      if (mode === "signup" && !result.data.session) {
        setMessage("Аккаунт создан. Проверь почту, чтобы подтвердить адрес.");
      } else {
        router.push("/"); router.refresh();
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Не удалось выполнить вход.");
    } finally { setBusy(false); }
  }

  return <main className="auth-shell"><div className="auth-card"><a href="/" className="brand auth-brand"><span className="brand-mark"><Zap size={19} fill="currentColor"/></span><span>deal<span className="brand-accent">hunter</span><small>INTELLIGENCE PANEL</small></span></a><div className="auth-kicker">PRIVATE ACCESS</div><h1>{mode==="login"?"С возвращением":"Создать аккаунт"}</h1><p>Войди в личную панель мониторинга предложений.</p><form onSubmit={submit}><label>Email</label><div className="auth-input"><Mail size={16}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required/></div><label>Пароль</label><div className="auth-input"><Lock size={16}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Минимум 8 символов" minLength={8} required/></div><button className="primary-button auth-submit" disabled={busy}>{busy?"Подождите…":mode==="login"?"Войти в систему":"Зарегистрироваться"}<ArrowRight size={16}/></button></form>{message&&<div className="auth-message">{message}</div>}<div className="auth-switch">{mode==="login"?"Нет аккаунта?":"Уже есть аккаунт?"} <button onClick={()=>{setMode(mode==="login"?"signup":"login");setMessage("");}}>{mode==="login"?"Создать":"Войти"}</button></div><div className="auth-security"> <Lock size={13}/> Защищённая авторизация Supabase</div></div></main>;
}
