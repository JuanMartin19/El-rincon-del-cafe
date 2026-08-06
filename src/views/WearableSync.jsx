import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/ToastProvider';
import { API_URL } from '../config';

export default function WearableSync() {
  const { usuario, token } = useAuth();
  const [estadoConexion, setEstadoConexion] = useState('Desconectado');
  const [pinGenerado, setPinGenerado] = useState(null);
  
  const [tiempoRestante, setTiempoRestante] = useState(0);

  useEffect(() => {
    if (tiempoRestante > 0) {
      const timer = setTimeout(() => setTiempoRestante(tiempoRestante - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tiempoRestante === 0 && pinGenerado) {
      setPinGenerado(null);
      setEstadoConexion('PIN expirado');
      
      fetch(`${API_URL}/auth/pin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pin: null })
      }).catch(err => console.error("Error al borrar el PIN", err));
    }
  }, [tiempoRestante, pinGenerado, token]);

  useEffect(() => {
    let intervalo;
    
    if (estadoConexion === 'Esperando emparejamiento' && pinGenerado) {
      intervalo = setInterval(async () => {
        try {
          const res = await fetch(`${API_URL}/auth/check-pin`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          
          if (data.emparejado) {
            setEstadoConexion('¡Conectado exitosamente!');
            setPinGenerado(null);
            setTiempoRestante(0);
            showToast({ icon: '🎉', title: '¡Sincronizado!', sub: 'Tu reloj ya está emparejado' });
          }
        } catch (err) {
          console.error("Error comprobando el estado de emparejamiento", err);
        }
      }, 2000);
    }
    
    return () => clearInterval(intervalo);
  }, [estadoConexion, pinGenerado, token]);

  const iniciarEnlace = async () => {
    setEstadoConexion('Generando código...');
    
    try {
      const nuevoPin = Math.floor(1000 + Math.random() * 9000).toString();

      const res = await fetch(`${API_URL}/auth/pin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pin: nuevoPin })
      });

      if (res.ok) {
        setPinGenerado(nuevoPin);
        setEstadoConexion('Esperando emparejamiento');
        setTiempoRestante(60);
        showToast({ icon: '⌚', title: 'Código activo', sub: 'Ingresa este PIN en tu reloj' });
      } else {
        setEstadoConexion('Error de sincronización');
        showToast({ icon: '✕', title: 'Error', sub: 'No se pudo guardar el PIN' });
      }
    } catch (error) {
      setEstadoConexion('Desconectado');
      showToast({ icon: '✕', title: 'Error de red', sub: 'Verifica tu conexión al servidor' });
    }
  };

  return (
    <div style={s.content}>
      <header style={s.header}>
        <h1 style={s.title}>Sincronización Wearable</h1>
        <p style={s.subtitle}>Vincula tu Smartwatch para Rincón del Café.</p>
      </header>

      {/* ⚡ Contenedor centrado sin el Grid de dos columnas */}
      <div style={s.container}>
        <div id="wearable-link-container" style={s.card}>
          <h3 style={s.cardTitle}>Sincronización de Dispositivo</h3>
          <p style={s.text}>Presiona el botón para generar un código de acceso y vincular tu reloj inteligente nativo.</p>

          <p id="status-display" style={s.statusText}>
            Estado actual: <span style={{ color: estadoConexion === 'Desconectado' || estadoConexion === 'PIN expirado' ? '#E24B4A' : '#3a9a5c' }}>{estadoConexion}</span>
          </p>

          {pinGenerado && (
            <div style={s.pinBox}>
              <div style={s.pinLabel}>TU PIN DE ACCESO:</div>
              <div style={s.pinNumber}>{pinGenerado}</div>
              <div style={s.pinUser}>Usuario: {usuario?.email}</div>
              <div style={s.pinTimer}>Expira en: {tiempoRestante}s</div>
            </div>
          )}

          <button id="btn-connect-wearable" onClick={iniciarEnlace} style={s.btnPrimary}>
            {estadoConexion === 'Desconectado' || estadoConexion === 'PIN expirado' ? 'Vincular Reloj' : 'Generar Nuevo PIN'}
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  content: { display: 'flex', flexDirection: 'column', height: '100%', background: '#0A0A0A', color: '#F9F6F0' },
  header: { padding: '40px 48px', borderBottom: '1px solid #1E1E1E', background: '#110D0C' },
  title: { fontSize: 32, fontWeight: 700, fontFamily: '"Playfair Display", serif', margin: 0, color: '#D4A373' },
  subtitle: { fontSize: 14, color: '#B0A39C', marginTop: 8 },
  container: { padding: '40px 48px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }, // Centra la tarjeta
  card: { background: '#16110F', border: '1px solid #3A2E2A', borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '500px' },
  cardTitle: { fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#D4A373', margin: 0, textAlign: 'center' },
  text: { fontSize: 13, color: '#B0A39C', lineHeight: 1.6, margin: 0, textAlign: 'center' },
  statusText: { fontSize: 14, fontWeight: 600, margin: 0, padding: '12px', background: '#0A0A0A', borderRadius: '6px', border: '1px solid #231C1A', textAlign: 'center' },
  pinBox: { background: '#231C1A', border: '1px dashed #D4A373', borderRadius: '8px', padding: '16px', textAlign: 'center' },
  pinLabel: { fontSize: 10, color: '#B0A39C', letterSpacing: '0.1em' },
  pinNumber: { fontSize: 32, fontWeight: 700, letterSpacing: '0.2em', color: '#F9F6F0', marginTop: 8 },
  pinUser: { fontSize: 11, color: '#B0A39C', marginTop: 8, fontStyle: 'italic' },
  pinTimer: { fontSize: 11, fontWeight: 700, color: '#E24B4A', marginTop: 12, textTransform: 'uppercase', letterSpacing: '0.1em' },
  btnPrimary: { background: '#D4A373', color: '#16110F', border: 'none', padding: '14px', borderRadius: '6px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', width: '100%', marginTop: 'auto' }
};