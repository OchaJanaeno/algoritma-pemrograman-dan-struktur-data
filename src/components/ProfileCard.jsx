import { Link } from 'react-router-dom'
import '../styles/ProfileCard.css'

function ProfileCard({ nama, foto, umur, kota, jurusan, hobi, narasi }) {
  return (
    <div className="profile-container">
      <div className="bubble bubble1"></div>
      <div className="bubble bubble2"></div>
      <div className="bubble bubble3"></div>

      <div className="profile-card">
        <Link to="/" className="back-btn">← Back</Link>
        <div className="profile-left">
          <img src={foto} alt={nama} className="profile-foto" />
          <div className="profile-info">
            <h2 className="profile-nama">{nama}</h2>
            <div className="profile-detail">
              <span>🎂</span> <p>{umur} tahun</p>
            </div>
            <div className="profile-detail">
              <span>📍</span> <p>{kota}</p>
            </div>
            <div className="profile-detail">
              <span>🎓</span> <p>{jurusan}</p>
            </div>
            <div className="profile-detail">
              <span>🎯</span> <p>{hobi}</p>
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <div className="profile-right">
          <h3>Tentang Saya</h3>
          <p className="profile-narasi">{narasi}</p>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard