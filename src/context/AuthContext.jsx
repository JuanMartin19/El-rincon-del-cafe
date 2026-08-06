import React, { createContext, useContext, useState, useEffect } from 'react'
import { API_URL } from '../config'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('rdc_token'))
  const [usuario, setUsuario] = useState(() => {
    const raw = localStorage.getItem('rdc_usuario')
    return raw ? JSON.parse(raw) : null
  })

  useEffect(() => {
    if (token) localStorage.setItem('rdc_token', token)
    else localStorage.removeItem('rdc_token')
  }, [token])

  useEffect(() => {
    if (usuario) localStorage.setItem('rdc_usuario', JSON.stringify(usuario))
    else localStorage.removeItem('rdc_usuario')
  }, [usuario])

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) return { ok: false, error: data.error || 'Credenciales inválidas' }

      setToken(data.token)
      setUsuario(data.usuario)
      
      // ⚡ ASEGURAMOS QUE DEVUELVA EL ROL CORRECTAMENTE
      const rolEncontrado = data.usuario && data.usuario.rol ? data.usuario.rol : 'cliente';
      return { ok: true, rol: rolEncontrado } 
    } catch (err) {
      return { ok: false, error: 'No se pudo conectar con el servidor' }
    }
  }

  const register = async (nombre, email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password }),
      })
      const data = await res.json()
      if (!res.ok) return { ok: false, error: data.error || 'No se pudo crear la cuenta' }
      return { ok: true }
    } catch (err) {
      return { ok: false, error: 'No se pudo conectar con el servidor' }
    }
  }

  const logout = () => {
    setToken(null)
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ token, usuario, isAutenticado: !!token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}