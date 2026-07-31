import { useState, useCallback } from 'react';

let _setToast = null;

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  _setToast = setToast;

  if (toast) {
    setTimeout(() => setToast(null), 2800);
  }

  return (
    <>
      {children}
      {toast && (
        <div style={ts.wrap}>
          <span style={ts.icon}>{toast.icon}</span>
          <div>
            <div style={ts.title}>{toast.title}</div>
            <div style={ts.sub}>{toast.sub}</div>
          </div>
          <button onClick={() => setToast(null)} style={ts.close}>✕</button>
        </div>
      )}
    </>
  );
}

export function showToast({ icon = '✓', title, sub }) {
  if (_setToast) _setToast({ icon, title, sub });
}

const ts = {
  wrap: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    zIndex: 200,
    background: '#0F0F0F',
    border: '1px solid #2A2A2A',
    borderLeft: '3px solid #F0E040',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    maxWidth: 300,
    animation: 'toastIn 0.2s ease',
  },
  icon: {
    fontSize: 16,
    color: '#F0E040',
    flexShrink: 0,
    marginTop: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#F5F5F0',
    marginBottom: 2,
  },
  sub: {
    fontSize: 11,
    color: '#666',
    letterSpacing: '0.04em',
  },
  close: {
    background: 'none',
    border: 'none',
    color: '#555',
    cursor: 'pointer',
    fontSize: 11,
    marginLeft: 'auto',
    flexShrink: 0,
    fontFamily: 'inherit',
    lineHeight: 1,
    padding: 0,
  },
};