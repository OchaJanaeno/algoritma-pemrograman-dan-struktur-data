import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import GithubProfileCard from '../components/GithubProfileCard'

export default function GithubFinder() {
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showToast, setShowToast] = useState(false)
  const prevOnline = useRef(null)

  // ─── useEffect 1: Auto-Fetch on Type ───────────────────────────────────────
  useEffect(() => {
    if (!username.trim()) {
      setUser(null)
      setError('')
      return
    }

    const controller = new AbortController()

    const fetchUser = async () => {
      setLoading(true)
      setError('')
      setUser(null)
      try {
        const res = await fetch(`https://api.github.com/users/${username.trim()}`, {
          signal: controller.signal,
        })
        if (!res.ok) {
          if (res.status === 404) throw new Error(`User "${username}" tidak ditemukan.`)
          throw new Error('Gagal mengambil data dari GitHub.')
        }
        const data = await res.json()
        setUser(data)
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
    return () => controller.abort()
  }, [username])

  // ─── useEffect 2: Connectivity Monitor ─────────────────────────────────────
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const poll = setInterval(() => {
      setIsOnline(navigator.onLine)
    }, 2000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(poll)
    }
  }, [])

  // ─── useEffect 3: Title Sync ────────────────────────────────────────────────
  useEffect(() => {
    document.title = user ? `Viewing: ${user.name || user.login}` : 'GitHub Finder'
    return () => { document.title = 'GitHub Finder' }
  }, [user])

  // ─── useEffect 4: Notification Timer ───────────────────────────────────────
  useEffect(() => {
    if (prevOnline.current === null) {
      prevOnline.current = isOnline
      return
    }

    if (!isOnline) {
      prevOnline.current = false
      return
    }

    if (prevOnline.current === false && isOnline) {
      setShowToast(true)
      prevOnline.current = true
      const timer = setTimeout(() => setShowToast(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline])

  return (
    <>
      {/* ── Keyframes ── */}
      <style>{`
        @keyframes pulseBar {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @keyframes slideInRight {
          from { transform: translateX(120%); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
        @keyframes skeletonShimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 400px 100%;
          animation: skeletonShimmer 1.4s ease infinite;
        }
      `}</style>

      {/* ── Pulse Bar ── */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: '4px',
        zIndex: 9999,
        backgroundColor: isOnline ? '#22c55e' : '#ef4444',
        animation: isOnline ? 'none' : 'pulseBar 1.2s ease-in-out infinite',
        transition: 'background-color 0.4s ease',
        boxShadow: isOnline
          ? '0 0 8px rgba(34,197,94,0.6)'
          : '0 0 8px rgba(239,68,68,0.6)',
      }} />

      {/* ── Toast Back Online ── */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(16,185,129,0.15)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(16,185,129,0.3)',
          color: '#6ee7b7',
          padding: '12px 20px',
          borderRadius: '12px',
          fontWeight: 600,
          fontSize: '0.875rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          animation: 'slideInRight 0.3s ease',
        }}>
          ✅ Koneksi kembali online!
        </div>
      )}

      {/* ── Main Container ── */}
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#020617', /* slate-950 */
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 20% -10%, rgba(99,102,241,0.15) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 80% 110%, rgba(6,182,212,0.10) 0%, transparent 60%)
        `,
        color: '#f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '72px 16px 64px', /* pt-18 for fixed pulse bar */
      }}>

        {/* ── Back Link ── */}
        <div style={{ width: '100%', maxWidth: '512px', marginBottom: '24px' }}>
          <Link to="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            color: '#94a3b8',
            textDecoration: 'none',
            padding: '6px 14px',
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(8px)',
            transition: 'color 0.2s, border-color 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
          >
            ← Home
          </Link>
        </div>

        {/* ── Header ── */}
        <header style={{ width: '100%', maxWidth: '512px', textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.75rem',
            color: '#94a3b8',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '999px',
            padding: '6px 16px',
            backgroundColor: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(8px)',
            marginBottom: '16px',
          }}>
            {/* GitHub icon SVG */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.54-1.37-1.32-1.74-1.32-1.74-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.23 1.83 1.23 1.06 1.82 2.78 1.3 3.46.99.1-.77.41-1.3.75-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Real-Time Profile Finder
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            letterSpacing: '-0.025em',
            background: 'linear-gradient(to right, #818cf8, #c084fc, #22d3ee)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 8px',
            lineHeight: 1.1,
          }}>
            GitHub Finder
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
            Temukan profil GitHub siapa pun, seketika.
          </p>
        </header>

        {/* ── Search Input ── */}
        <div style={{ width: '100%', maxWidth: '512px', position: 'relative', marginBottom: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            padding: '14px 20px',
            transition: 'border-color 0.3s, box-shadow 0.3s',
          }}
            onFocusCapture={e => {
              e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'
              e.currentTarget.style.boxShadow = '0 0 20px rgba(129,140,248,0.15)'
            }}
            onBlurCapture={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {/* Search icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Ketik username GitHub..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#f1f5f9',
                fontSize: '0.875rem',
              }}
            />
            {username && (
              <button
                onClick={() => setUsername('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  padding: 0,
                  lineHeight: 1,
                }}
              >✕</button>
            )}
          </div>
        </div>

        {/* ── Offline Warning ── */}
        {!isOnline && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#f87171',
            fontSize: '0.75rem',
            marginBottom: '16px',
          }}>
            {/* WifiOff icon */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
            </svg>
            Periksa koneksi internetmu untuk mencari profil
          </div>
        )}

        {/* ── Loading Skeleton ── */}
        {loading && (
          <div style={{
            width: '100%',
            maxWidth: '512px',
            marginTop: '32px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            padding: '32px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              <div className="skeleton" style={{ width: '80px', height: '80px', borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="skeleton" style={{ height: '18px', borderRadius: '8px', width: '70%' }} />
                <div className="skeleton" style={{ height: '14px', borderRadius: '8px', width: '45%' }} />
              </div>
            </div>
            <div className="skeleton" style={{ height: '14px', borderRadius: '8px', width: '100%', marginBottom: '10px' }} />
            <div className="skeleton" style={{ height: '14px', borderRadius: '8px', width: '80%', marginBottom: '24px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton" style={{ height: '64px', borderRadius: '12px' }} />
              ))}
            </div>
          </div>
        )}

        {/* ── Error State ── */}
        {!loading && error && (
          <div style={{
            width: '100%',
            maxWidth: '512px',
            marginTop: '32px',
            borderRadius: '16px',
            border: '1px solid rgba(239,68,68,0.2)',
            backgroundColor: 'rgba(239,68,68,0.05)',
            backdropFilter: 'blur(20px)',
            padding: '32px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>👻</div>
            <p style={{ color: '#f87171', fontWeight: 600, margin: '0 0 6px' }}>{error}</p>
            <p style={{ color: '#475569', fontSize: '0.8rem', margin: 0 }}>Coba periksa ejaan username-nya</p>
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && !error && !user && !username && (
          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
            <p style={{ color: '#475569', fontSize: '0.875rem' }}>Mulai ketik username GitHub di atas</p>
          </div>
        )}

        {/* ── Profile Card (komponen terpisah kamu) ── */}
        {/* GithubProfileCard kamu akan dirender di sini. */}
        {/* Bungkus dengan glass wrapper agar style nyambung */}
        {!loading && user && (
          <div style={{
            width: '100%',
            maxWidth: '512px',
            marginTop: '32px',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(24px)',
            padding: '32px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
            transition: 'border-color 0.3s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
          >
            <GithubProfileCard user={user} />
          </div>
        )}

      </div>
    </>
  )
}