import React, { useState } from 'react';
import { showToast } from './ToastProvider';
import s from './../views/Home.styles';
import { API_URL } from '../config';

const SUBMIT_URL = `${API_URL}/contacto`;

const initialState = { name: '', email: '', message: '' };

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Ingresa tu nombre';
    if (!form.email.trim()) {
      next.email = 'Ingresa tu correo';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Correo inválido';
    }
    if (!form.message.trim()) next.message = 'Escribe tu mensaje';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);
    try {
      const res = await fetch(SUBMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: form.name, email: form.email, mensaje: form.message }),
      });
      if (!res.ok) throw new Error('Error al enviar');

      showToast({ icon: '✓', title: 'Mensaje enviado', sub: 'Te responderemos pronto' });
      setForm(initialState);
    } catch (err) {
      showToast({ icon: '✕', title: 'No se pudo enviar', sub: 'Intenta de nuevo más tarde' });
    } finally {
      setSending(false);
    }
  };

  return (
    <form style={s.contactForm} onSubmit={handleSubmit} noValidate>
      <div style={s.formRow}>
        <label style={s.formLabel} htmlFor="cf-name">Nombre</label>
        <input
          id="cf-name"
          type="text"
          placeholder="Tu nombre"
          style={s.formInput}
          value={form.name}
          onChange={handleChange('name')}
        />
        {errors.name && <span style={s.formError}>{errors.name}</span>}
      </div>

      <div style={s.formRow}>
        <label style={s.formLabel} htmlFor="cf-email">Correo</label>
        <input
          id="cf-email"
          type="email"
          placeholder="tu@email.com"
          style={s.formInput}
          value={form.email}
          onChange={handleChange('email')}
        />
        {errors.email && <span style={s.formError}>{errors.email}</span>}
      </div>

      <div style={s.formRow}>
        <label style={s.formLabel} htmlFor="cf-message">Mensaje</label>
        <textarea
          id="cf-message"
          placeholder="¿En qué te ayudamos?"
          style={s.formTextarea}
          value={form.message}
          onChange={handleChange('message')}
        />
        {errors.message && <span style={s.formError}>{errors.message}</span>}
      </div>

      <button type="submit" style={{ ...s.ctaPrimary, opacity: sending ? 0.6 : 1 }} disabled={sending}>
        {sending ? 'Enviando…' : 'Enviar mensaje →'}
      </button>
    </form>
  );
}
