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
  const prevOnline = useRef(null) // track status sebelumnya, null = belum pernah berubah

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
  // Pakai polling setiap 2 detik karena event window online/offline
  // tidak selalu reliable di semua browser/OS.
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Polling fallback setiap 2 detik
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
  // prevOnline.current null = mount pertama, skip.
  // Toast hanya muncul kalau sebelumnya false (offline) lalu jadi true (online).
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
    <div>
      <style>{`
        @keyframes pulseBar {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {/* Pulse Bar */}
      <div style={{
        height: '5px',
        width: '100%',
        backgroundColor: isOnline ? '#22c55e' : '#ef4444',
        animation: isOnline ? 'none' : 'pulseBar 1.2s ease-in-out infinite',
        transition: 'background-color 0.4s ease',
      }} />

      {/* Status label */}
      <div style={{
        fontSize: '0.75rem',
        textAlign: 'right',
        padding: '2px 10px',
        color: isOnline ? '#22c55e' : '#ef4444',
        fontWeight: 600,
      }}>
        {isOnline ? '● Online' : '● Offline'}
      </div>

      {/* Toast Back Online */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#22c55e',
          color: '#fff',
          padding: '10px 18px',
          borderRadius: '8px',
          fontWeight: 600,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          animation: 'slideIn 0.3s ease',
          zIndex: 9999,
        }}>
          ✅ Back Online
        </div>
      )}

      <Link to="/">← Home</Link>
      <h1>GitHub Finder</h1>

      <input
        type="text"
        placeholder="Masukkan username GitHub..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {loading && <p>Mencari...</p>}
      {error && <p>{error}</p>}

      {user && <GithubProfileCard user={user} />}
    </div>
  )
}