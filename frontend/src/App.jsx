import { useEffect, useState } from 'react';
import {
  ArrowRight, ArrowUpRight, Check, CheckCircle2, ChevronRight, Eye, EyeOff,
  Fingerprint, KeyRound, LockKeyhole, LogOut, Mail, ShieldCheck, Sparkles,
  Zap,
} from 'lucide-react';
import { currentUser, login, logout } from './api.js';

function Logo({ light = false }) {
  return (
    <div className={`brand ${light ? 'brand-light' : ''}`} aria-label="NOVA Access">
      <span className="brand-mark" aria-hidden="true">
        <span className="brand-mark-center" />
      </span>
      <span className="brand-name">nova<span className="brand-dot">.</span></span>
      <span className="brand-divider" />
      <span className="brand-tag">access</span>
    </div>
  );
}

function AuthArtwork() {
  return (
    <aside className="story-pane">
      <div className="story-noise" />
      <div className="story-top"><span className="live-point" /> UMA NOVA EXPERIÊNCIA COMEÇA AQUI <ArrowUpRight size={17} /></div>
      <div className="artwork" aria-hidden="true">
        <div className="artwork-aura" />
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="orbit orbit-three" />
        <div className="orbit-core"><Fingerprint size={65} strokeWidth={1.15} /></div>
        <div className="float-pill pill-left"><span className="mini-icon"><ShieldCheck size={18} /></span><span><strong>Sessão segura</strong><small>Seu acesso protegido</small></span><CheckCircle2 size={16} className="float-check" /></div>
        <div className="float-pill pill-right"><span className="mini-icon purple"><Zap size={18} /></span><span><strong>Experiência fluida</strong><small>Simples do início ao fim</small></span></div>
        <span className="orb orb-one" /><span className="orb orb-two" /><span className="orb orb-three" />
      </div>
      <div className="story-copy">
        <span className="eyebrow-light"><Sparkles size={14} /> FEITO PARA IMPRESSIONAR</span>
        <h2>O próximo nível<br />começa com um <em>olá.</em></h2>
        <p>Uma experiência de acesso pensada nos detalhes. Rápida, intuitiva e com personalidade.</p>
        <div className="story-progress"><span /><span /><span /></div>
      </div>
      <div className="story-bottom"><span>DESIGN + TECNOLOGIA</span><span>© 2026 NOVA</span></div>
    </aside>
  );
}

function LoginScreen({ onLogin, busy, error, clearError }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim() || !password) return;
    onLogin(email, password);
  }

  function fillDemo() {
    setEmail('sara@demo.com');
    setPassword('Demo@123');
    clearError();
  }

  return (
    <div className="page page-login">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <main className="auth-shell">
        <section className="form-pane">
          <Logo />
          <div className="form-body">
            <div className="welcome-icon"><KeyRound size={22} strokeWidth={1.9} /></div>
            <div className="overline">SEU ESPAÇO, SUAS POSSIBILIDADES</div>
            <h1>Bem-vinda<br /><span>de volta<span className="title-period">.</span></span></h1>
            <p className="form-description">Entre com seus dados e continue de onde parou. É bom ter você por aqui.</p>

            <form className="login-form" onSubmit={handleSubmit}>
              <label htmlFor="email">E-mail</label>
              <div className="input-wrap">
                <Mail size={19} aria-hidden="true" />
                <input id="email" type="email" autoComplete="username" placeholder="seuemail@exemplo.com" value={email} onChange={e => { setEmail(e.target.value); clearError(); }} required />
              </div>
              <label htmlFor="password">Senha</label>
              <div className="input-wrap">
                <LockKeyhole size={19} aria-hidden="true" />
                <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Digite sua senha" value={password} onChange={e => { setPassword(e.target.value); clearError(); }} required />
                <button className="show-password" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button>
              </div>
              {error && <div className="error-message" role="alert">{error}</div>}
              <button type="submit" className="primary-button" disabled={busy}>
                <span>{busy ? 'Entrando...' : 'Entrar na minha conta'}</span>
                {busy ? <span className="button-spinner" /> : <ArrowRight size={20} />}
              </button>
            </form>
            <div className="demo-box">
              <div className="demo-info"><span className="demo-sparkle"><Sparkles size={16} /></span><div><strong>Quer testar a experiência?</strong><p>Use nossa conta de demonstração.</p></div></div>
              <button onClick={fillDemo} type="button">Usar conta demo <ChevronRight size={17} /></button>
            </div>
          </div>
          <footer className="form-footer"><span><ShieldCheck size={15} /> Conexão com sessão protegida</span><span>JAVA + REACT</span></footer>
        </section>
        <AuthArtwork />
      </main>
      <div className="below-shell">Uma experiência de login feita com cuidado nos detalhes <span>✦</span></div>
    </div>
  );
}

function Dashboard({ user, onLogout, busy, error }) {
  const firstName = user.name?.trim().split(/\s+/)[0] || 'Visitante';
  const initials = firstName.slice(0, 1).toUpperCase();
  const date = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

  return (
    <div className="page dashboard-page">
      <div className="dashboard-backdrop" />
      <header className="dash-header">
        <div className="dash-header-inner"><Logo light />
          <div className="dash-actions"><span className="header-section">Meu espaço</span><span className="avatar-small">{initials}</span></div>
        </div>
      </header>
      <main className="dash-main">
        <div className="dash-topline"><span className="breadcrumb"><span className="breadcrumb-home">Início</span><ChevronRight size={14} /> Meu espaço</span><span className="topline-date">{date}</span></div>
        <section className="welcome-panel">
          <div className="welcome-copy">
            <span className="greeting-label"><span className="greeting-dot" /> ACESSO AUTORIZADO</span>
            <h1>Olá, {firstName}<span className="wave">✳</span><br /><span>que bom te ver.</span></h1>
            <p>Seu espaço está pronto. Você entrou com sucesso e sua sessão está ativa. Pode ficar à vontade!</p>
            <div className="welcome-buttons"><span className="access-badge"><CheckCircle2 size={17} /> Login realizado com sucesso</span></div>
          </div>
          <div className="welcome-illustration" aria-hidden="true"><div className="hero-disc hero-disc-a" /><div className="hero-disc hero-disc-b" /><div className="hero-glow" /><div className="hero-icon-ring"><span className="hero-check"><Check size={54} strokeWidth={2.5} /></span></div><span className="hero-star one">✦</span><span className="hero-star two">✳</span></div>
        </section>
        <section className="dashboard-section">
          <div className="section-heading"><div><div className="dash-eyebrow">SEU PAINEL</div><h2>Tudo certo por aqui <span>✳</span></h2></div><span className="mini-subtitle">Visão geral da sua conta</span></div>
          <div className="dash-grid">
            <article className="info-card profile-card"><div className="info-icon lilac"><Fingerprint size={24} /></div><div className="info-card-tag">01 / IDENTIDADE</div><h3>Sua identidade</h3><p>Uma conta, um espaço só seu.</p><div className="profile-row"><div className="profile-avatar">{initials}</div><div><strong>{user.name}</strong><span>{user.email}</span></div><span className="profile-verified"><Check size={16} /></span></div></article>
            <article className="info-card security-card"><div className="info-icon mint"><ShieldCheck size={24} /></div><div className="info-card-tag">02 / SEGURANÇA</div><h3>Sessão ativa</h3><p>Sua sessão está autenticada pelo servidor.</p><div className="security-status"><span className="status-pulse" /><div><strong>Conectada com segurança</strong><span>Você pode sair a qualquer momento.</span></div><CheckCircle2 size={22} className="status-check" /></div></article>
          </div>
        </section>
        <section className="bottom-banner"><div className="banner-icon"><LogOut size={23} /></div><div><strong>Terminou por hoje?</strong><p>Encerre sua sessão para sair com tranquilidade.</p></div><button type="button" onClick={onLogout} disabled={busy}>{busy ? 'Saindo...' : 'Encerrar sessão'} <ArrowRight size={17} /></button></section>
        {error && <p className="dash-error" role="alert">{error}</p>}
      </main>
      <footer className="dash-footer"><span>NOVA ACCESS <span>© 2026</span></span><span>Feito com React + Spring Boot <span className="footer-heart">✦</span></span></footer>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    currentUser()
      .then(profile => { if (active) setUser(profile); })
      .catch(err => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function handleLogin(email, password) {
    setBusy(true); setError('');
    try { setUser(await login(email, password)); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function handleLogout() {
    setBusy(true); setError('');
    try { await logout(); setUser(null); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  if (loading) return <div className="loading-screen"><Logo light /><span className="loading-dot" /><span>Preparando seu espaço...</span></div>;
  if (user) return <Dashboard user={user} onLogout={handleLogout} busy={busy} error={error} />;
  return <LoginScreen onLogin={handleLogin} busy={busy} error={error} clearError={() => setError('')} />;
}
