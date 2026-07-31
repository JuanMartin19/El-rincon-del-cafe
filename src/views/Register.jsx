import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Ingresa tu nombre.');
    if (!form.email.includes('@')) return setError('Email inválido.');
    if (form.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
    if (form.password !== form.confirm) return setError('Las contraseñas no coinciden.');

    setError('');
    setLoading(true);
    const result = await register(form.name, form.email, form.password);
    setLoading(false);

    if (!result.ok) return setError(result.error);
    navigate('/login');
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.eyebrow}>— Nueva cuenta</div>
        <h1 style={s.title}>Registro</h1>
        <p style={s.sub}>Crea tu cuenta en El Rincón del Café</p>

        {error && <div style={s.error}>{error}</div>}

        <div style={s.form}>
          {[
            { label: 'Nombre', field: 'name',     type: 'text' },
            { label: 'Email',  field: 'email',    type: 'email' },
            { label: 'Contraseña', field: 'password', type: 'password' },
            { label: 'Confirmar contraseña', field: 'confirm', type: 'password' },
          ].map(({ label, field, type }) => (
            <div key={field} style={s.fieldGroup}>
              <label style={s.label}>{label}</label>
              <input
                type={type}
                value={form[field]}
                onChange={set(field)}
                required
                style={s.input}
                onFocus={(e) => (e.target.style.borderColor = '#F0E040')}
                onBlur={(e)  => (e.target.style.borderColor = '#1E1E1E')}
              />
            </div>
          ))}

          <button onClick={handleSubmit} style={{ ...s.btn, opacity: loading ? 0.6 : 1 }} disabled={loading}>
            {loading ? 'Creando cuenta…' : 'Crear cuenta →'}
          </button>

          <p style={s.footer}>
            ¿Ya tienes cuenta?{' '}
            <button onClick={() => navigate('/login')} style={s.link}>
              Ingresar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: 'calc(100vh - 56px)',
    background: '#0A0A0A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 16px',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: '#0F0F0F',
    border: '1px solid #1E1E1E',
    padding: '40px 36px',
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#F0E040',
    marginBottom: 10,
    fontWeight: 500,
  },
  title: {
    fontSize: 32,
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '-0.03em',
    color: '#F5F5F0',
    margin: 0,
  },
  sub: {
    fontSize: 12,
    color: '#555',
    letterSpacing: '0.04em',
    marginTop: 6,
    marginBottom: 28,
  },
  error: {
    background: '#1a0000',
    border: '1px solid #3a0000',
    color: '#ff6b6b',
    padding: '10px 14px',
    fontSize: 12,
    marginBottom: 20,
    letterSpacing: '0.03em',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#666',
  },
  input: {
    background: '#111',
    border: '1px solid #1E1E1E',
    borderRadius: 0,
    padding: '11px 14px',
    color: '#F5F5F0',
    fontSize: 14,
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  btn: {
    marginTop: 8,
    background: '#F0E040',
    border: 'none',
    color: '#0A0A0A',
    padding: '14px',
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background 0.15s',
  },
  footer: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginTop: 4,
  },
  link: {
    background: 'none',
    border: 'none',
    color: '#F0E040',
    cursor: 'pointer',
    fontSize: 12,
    fontFamily: 'inherit',
    textDecoration: 'underline',
  },
};