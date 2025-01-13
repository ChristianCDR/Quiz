import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center h-screen bg-white text-black" >
      <h1 className="text-xl sm:text-3xl font-bold text-primary mb-4">Erreur 404</h1>
      <p className="sm:text-2xl text-md mb-3 font-bold">La page que vous recherchez n'existe pas.</p>
      <Link to="/" className="sm:text-xl">Retour à la page d'accueil</Link>
    </div>
  );
};

export default NotFound;