import { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Film,
  Lock,
  Mail,
  Sofa,
  ShieldCheck,
  Sparkles,
  Ticket,
  User,
} from 'lucide-react';
import { usePublic } from '../context/PublicContext';
import { adminCredentials, demoCredentials, login, register } from '../services/demoAuth';
import { validateRegistration } from '../utils/validation';

export default function AuthPage() {
  const { user, signIn } = usePublic();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [mode, setMode] = useState('login');
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [fields, setFields] = useState({ name: '', email: '', password: '', confirm: '' });

  if (user) return <Navigate to={user.role === 'admin' ? '/dashboard' : '/web/cuenta'} replace />;

  const update = (key, value) => {
    setError('');
    setFields((previous) => ({ ...previous, [key]: value }));
  };

  // Simple consumer password evaluation (8+ chars, number, casing)
  const passwordCriteria = [
    {
      id: 'length',
      label: '8+ caracteres',
      met: fields.password.length >= 8,
    },
    {
      id: 'number',
      label: 'Un número',
      met: /\d/.test(fields.password),
    },
    {
      id: 'cases',
      label: 'Mayús / minús',
      met: /[a-z]/.test(fields.password) && /[A-Z]/.test(fields.password),
    },
  ];

  function getPasswordStatus(pwd, criteria) {
    if (!pwd) return { percent: 0, label: '', level: 'empty' };
    const metCount = criteria.filter((c) => c.met).length;

    if (pwd.length < 8) {
      return {
        percent: 25,
        label: 'Muy débil',
        level: 'weak',
      };
    }
    if (metCount === 1) {
      return {
        percent: 50,
        label: 'Va bien',
        level: 'fair',
      };
    }
    if (metCount === 2) {
      return {
        percent: 75,
        label: 'Va bien',
        level: 'good',
      };
    }
    return {
      percent: 100,
      label: 'Lista para usar',
      level: 'ready',
    };
  }

  const pwdStatus = getPasswordStatus(fields.password, passwordCriteria);

  async function submit(event) {
    if (event) event.preventDefault();
    if (busy) return;
    const validation =
      mode === 'register'
        ? validateRegistration(fields)
        : !fields.email || !fields.password
          ? 'Completa tu correo y contraseña.'
          : '';
    if (validation) {
      setError(validation);
      return;
    }
    setBusy(true);
    setError('');
    try {
      const session =
        mode === 'register' ? await register(fields) : await login(fields.email, fields.password);
      signIn(session, rememberMe);
      const target = params.get('next');
      navigate(
        session.role === 'admin'
          ? '/dashboard'
          : target?.startsWith('/web/') && !target.startsWith('/web/login')
            ? target
            : '/web/cuenta',
        { replace: true },
      );
    } catch (failure) {
      setError(failure.message || 'No pudimos iniciar la sesión. Inténtalo de nuevo.');
    } finally {
      setBusy(false);
    }
  }

  // Quick 1-click test filler
  function fillDemo(creds, label) {
    setMode('login');
    setFields((prev) => ({ ...prev, ...creds }));
    setError('');
    setNotice(`Credenciales de ${label} cargadas. Haz clic en "Iniciar sesión".`);
  }

  return (
    <section className="pub-auth-page">
      {/* ── Left Cinematic Story / Benefits Panel ── */}
      <div className="pub-auth-story">
        <div className="pub-auth-ambient-glow" aria-hidden="true" />

        <div className="pub-auth-story-content">
          <div className="pub-auth-badge">
            <Sparkles size={14} /> TU CUENTA CINERAMA
          </div>

          <h1>
            El cine como siempre
            <br />
            debió sentirse.
          </h1>

          <p className="pub-auth-story-lead">
            Elige una función, guarda tu reserva de demostración y consulta tus comprobantes en este
            navegador.
          </p>

          <div className="pub-auth-perks">
            <div className="pub-auth-perk-item">
              <div className="pub-auth-perk-icon">
                <Ticket size={20} />
              </div>
              <div>
                <strong>Tus reservas reunidas</strong>
                <span>Consulta la película, el horario y las butacas de cada reserva.</span>
              </div>
            </div>

            <div className="pub-auth-perk-item">
              <div className="pub-auth-perk-icon">
                <Sofa size={20} />
              </div>
              <div>
                <strong>Elige tu lugar</strong>
                <span>Revisa la sala y selecciona hasta ocho butacas por reserva.</span>
              </div>
            </div>

            <div className="pub-auth-perk-item">
              <div className="pub-auth-perk-icon">
                <Film size={20} />
              </div>
              <div>
                <strong>Explora los estrenos</strong>
                <span>Reserva tus butacas preferidas para los estrenos más esperados.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Interactive Form Panel ── */}
      <div className="pub-auth-card">
        {/* Segmented Switcher */}
        <div className="pub-auth-switcher" role="group" aria-label="Seleccionar modo de acceso">
          <button
            type="button"
            disabled={busy}
            aria-pressed={mode === 'login'}
            className={`pub-switcher-btn ${mode === 'login' ? 'is-active' : ''}`}
            onClick={() => {
              setMode('login');
              setError('');
              setNotice('');
            }}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            disabled={busy}
            aria-pressed={mode === 'register'}
            className={`pub-switcher-btn ${mode === 'register' ? 'is-active' : ''}`}
            onClick={() => {
              setMode('register');
              setError('');
              setNotice('');
            }}
          >
            Crear cuenta
          </button>
        </div>

        <div className="pub-auth-card-heading">
          <h2>{mode === 'login' ? 'Bienvenido a Cinerama' : 'Crea tu cuenta Cinerama'}</h2>
          <p className="pub-muted">
            {mode === 'login'
              ? 'Ingresa tus datos para ver tus reservas y entradas.'
              : 'Guarda tus reservas de prueba con una cuenta local.'}
          </p>
        </div>

        {/* 1-Click Fast Demo Testing Access */}
        <div className="pub-quick-demo-banner">
          <div className="pub-quick-demo-header">
            <span className="pub-quick-demo-title">
              <Sparkles size={14} /> Acceso rápido de demostración:
            </span>
          </div>
          <div className="pub-quick-demo-chips">
            <button
              type="button"
              className="pub-demo-chip"
              onClick={() => fillDemo(demoCredentials, 'Cliente')}
              disabled={busy}
              title="Cargar credenciales de cliente demo"
            >
              <User size={13} />
              <span>Cliente Demo</span>
            </button>
            <button
              type="button"
              className="pub-demo-chip pub-demo-chip-admin"
              onClick={() => fillDemo(adminCredentials, 'Administrador')}
              disabled={busy}
              title="Cargar credenciales de administrador demo"
            >
              <ShieldCheck size={13} />
              <span>Administrador</span>
            </button>
          </div>
        </div>

        {/* Notices and Errors */}
        {notice && (
          <div className="pub-auth-notice" role="status">
            <Check size={16} /> {notice}
          </div>
        )}
        {error && (
          <div className="pub-error" role="alert">
            {error}
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={submit} noValidate aria-busy={busy}>
          <fieldset disabled={busy} className="pub-auth-fieldset">
            {mode === 'register' && (
              <div className="pub-field-with-icon">
                <span className="pub-input-icon" aria-hidden="true">
                  <User size={18} />
                </span>
                <div className="pub-float-field">
                  <input
                    id="auth-name"
                    value={fields.name}
                    onChange={(event) => update('name', event.target.value)}
                    autoComplete="name"
                    placeholder=" "
                    required
                  />
                  <label htmlFor="auth-name">Nombre completo</label>
                </div>
              </div>
            )}

            <div className="pub-field-with-icon">
              <span className="pub-input-icon" aria-hidden="true">
                <Mail size={18} />
              </span>
              <div className="pub-float-field">
                <input
                  id="auth-email"
                  value={fields.email}
                  onChange={(event) => update('email', event.target.value)}
                  autoComplete="email"
                  type="email"
                  placeholder=" "
                  required
                />
                <label htmlFor="auth-email">Correo electrónico</label>
              </div>
            </div>

            <div className="pub-field-with-icon">
              <span className="pub-input-icon" aria-hidden="true">
                <Lock size={18} />
              </span>
              <div className="pub-float-field pub-password-group">
                <input
                  id="auth-password"
                  value={fields.password}
                  onChange={(event) => update('password', event.target.value)}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  type={visible ? 'text' : 'password'}
                  placeholder=" "
                  required
                />
                <label htmlFor="auth-password">Contraseña</label>
                <button
                  type="button"
                  className="pub-icon-button pub-password-toggle"
                  aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Simple Consumer Password Feedback */}
            {mode === 'register' && fields.password && (
              <div className="pub-pwd-guide" aria-live="polite">
                <div className="pub-pwd-bar-row">
                  <div
                    className="pub-pwd-bar-track"
                    role="progressbar"
                    aria-valuenow={pwdStatus.percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Fortaleza: ${pwdStatus.label}`}
                  >
                    <div
                      className={`pub-pwd-bar-fill pub-fill-${pwdStatus.level}`}
                      style={{ width: `${pwdStatus.percent}%` }}
                    />
                  </div>
                  <span className={`pub-pwd-status pub-status-${pwdStatus.level}`}>
                    {pwdStatus.label}
                  </span>
                </div>

                <div className="pub-pwd-chips" aria-label="Requisitos de contraseña">
                  {passwordCriteria.map((item) => (
                    <span
                      key={item.id}
                      className={`pub-pwd-chip ${item.met ? 'is-met' : ''}`}
                    >
                      {item.met && <Check size={12} strokeWidth={2.5} />}
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div className="pub-field-with-icon">
                <span className="pub-input-icon" aria-hidden="true">
                  <Lock size={18} />
                </span>
                <div className="pub-float-field">
                  <input
                    id="auth-confirm"
                    value={fields.confirm}
                    onChange={(event) => update('confirm', event.target.value)}
                    type={visible ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder=" "
                    required
                  />
                  <label htmlFor="auth-confirm">Confirmar contraseña</label>
                </div>
              </div>
            )}
          </fieldset>

          {/* Remember me & Forgot password */}
          {
            <div className="pub-auth-form-extras">
              <label className="pub-remember-me">
                <input
                  type="checkbox"
                  disabled={busy}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Recordar en este navegador</span>
              </label>
              <button
                type="button"
                className="pub-text-link pub-forgot-pwd"
                onClick={() => {
                  setNotice(
                    'Las cuentas de demostración usan Cinerama123. Las cuentas que creaste usan tu propia contraseña. Este prototipo no envía correos de recuperación; puedes usar el acceso de demostración para continuar.',
                  );
                }}
              >
                Ayuda con el acceso
              </button>
            </div>
          }

          <button className="pub-button pub-full pub-submit-button" disabled={busy} type="submit">
            {busy ? (
              <span className="pub-button-spinner-wrap">
                <span className="pub-spinner" aria-hidden="true" />
                <span>{mode === 'login' ? 'Iniciando sesión…' : 'Creando tu cuenta…'}</span>
              </span>
            ) : (
              <span className="pub-btn-inner-content">
                <span>{mode === 'login' ? 'Iniciar sesión' : 'Crear mi cuenta gratis'}</span>
                <ArrowRight size={18} />
              </span>
            )}
          </button>
        </form>

        {/* Security / Guarantee Footer */}
        <div className="pub-auth-security-footer">
          <ShieldCheck size={16} />
          <span>
            Prototipo local: sin cobros reales. Si desmarcas Recordar, la sesión dura hasta cerrar
            esta pestaña.
          </span>
        </div>
      </div>
    </section>
  );
}
