import { Link } from 'react-router-dom'
import './Welcome.css'

function Welcome() {
  return (
    <div className="container">
      <div className="bubble bubble1"></div>
      <div className="bubble bubble2"></div>
      <div className="bubble bubble3"></div>
      <div className="content">
        <h1 className="title">Selamat Datang</h1><br></br>
        <p className="subtitle">Pilih destinasi kalian!</p>
        <nav className="navbar">
          <Link to="/ocha" className="nav-btn">Ocha</Link>
          <Link to="/fauzan" className="nav-btn">Fauzan</Link>
          <Link to="/huda" className="nav-btn">Huda</Link>
        </nav>
      </div>
    </div>
  )
}

export default Welcome