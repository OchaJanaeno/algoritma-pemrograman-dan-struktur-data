import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Welcome from './pages/Welcome'
import Ocha from './pages/Ocha'
import Fauzan from './pages/Fauzan'
import Huda from './pages/Huda'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/ocha" element={<Ocha />} />
        <Route path="/fauzan" element={<Fauzan />} />
        <Route path="/huda" element={<Huda />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App