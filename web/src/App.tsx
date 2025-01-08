import LegalPage from './pages/LegalPage'
import { Route, Routes, Link } from 'react-router-dom';

function App() {

  return (
    <>
      <nav className="p-4 bg-gray-800 text-white">
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:text-blue-400">Accueil</Link>
          </li>
          <li>
            <Link to="/legal" className="hover:text-red-500">Mentions Légales</Link>
          </li>
        </ul>
      </nav>
      
      <Routes>
        <Route path="/legal" element={<LegalPage />} />
      </Routes>
    </>
  )
}

export default App
