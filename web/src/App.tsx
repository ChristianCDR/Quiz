import LegalPage from './pages/LegalPage';
import NotFound from './pages/NotFound';
import HomePage from './pages/HomePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AccountDeletionPage from './pages/AccountDeletionPage';
import { Route, Routes } from 'react-router-dom';


function App() {

  return (
    <>  
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mentions-legales" element={<LegalPage />} />
        <Route path="/politique-de-confidentialite" element={<PrivacyPolicyPage />} />
        <Route path="/supprimer-mon-compte" element={<AccountDeletionPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App;
