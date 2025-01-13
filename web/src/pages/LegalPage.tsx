const LegalPage = () => {

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white text-black">
            <h1 className="text-xl sm:text-3xl font-bold text-primary mb-4">Mentions légales</h1>
            <div className="w-full bg-white lg:w-3/5 sm:text-xl text-base"> 
                <div className="mb-5 py-5 px-5">
                    <h2 className="sm:text-2xl text-lg mb-3 font-bold">Éditeur de l'application</h2>
                    <ul>
                        <li>L'éditeur de l'application est :</li>
                        <li>Christian CLAUDE DIT REGENT</li>
                        <li>Téléphone : 07 69 17 50 00</li>
                        <li>Email : christian.cdr@outlook.fr</li>
                        <li></li>
                    </ul>
                </div>
                <div className="bg-gray-100 mb-5 py-5 px-5">
                    <h2 className="sm:text-2xl text-lg mb-3 font-bold">Hébergeur de l'application</h2>
                    <ul>
                        <li>L'hébergement de l'application est assuré par :</li>
                        <li>IONOS</li>
                        <li>Adresse : 7, Place de la Gare - BP 70109,</li>
                        <li>57200 Sarreguemines, France</li>
                        <li>Téléphone : +33 (0) 970 808 911</li>
                    </ul>
                </div>
                <div className="mb-5 px-5">
                    <h2 className="sm:text-2xl text-lg mb-3 font-bold">Collecte de données personnelles</h2>
                    <p>
                        L'application collecte l'adresse email des utilisateurs dans le cadre de l'authentification. Ces données sont uniquement utilisées pour permettre l'accès à l'application et ne sont pas partagées avec des tiers.
                    </p>
                </div>
                <div className="bg-gray-100 mb-5 py-5 px-5">
                    <h2 className="sm:text-2xl text-lg mb-3 font-bold">Politique de confidentialité</h2>
                    <p>
                        La politique de confidentialité, décrivant la gestion et la protection des données personnelles, est disponible <a href="/politique-de-confidentialite">[ici]</a>. Elle explique comment les données collectées sont traitées, les droits des utilisateurs concernant leurs données, et les mesures de sécurité mises en place.
                    </p>
                </div>
                <div className="mb-5 px-5">
                    <h2  className="sm:text-2xl text-lg mb-3 font-bold">Propriété intellectuelle</h2>
                    <p>
                        Les contenus de l'application (textes, images, icônes) sont protégés par les droits d'auteur. Certaines images et icônes proviennent de Freepik, avec l'autorisation de leur utilisation, sous réserve de mentionner leur origine conformément aux conditions d'utilisation de Freepik.
                    </p>
                </div>
                <div className="bg-gray-100 mb-5 py-5 px-5">
                    <h2  className="sm:text-2xl text-lg mb-3 font-bold">Responsabilité</h2>
                    <p>
                        L'éditeur de l'application ne saurait être tenu responsable des éventuels dysfonctionnements techniques, erreurs ou omissions dans le contenu de l'application. Les conseils fournis par l'application, notamment en matière de secourisme, ne remplacent pas une formation officielle ou un avis médical. L'utilisateur doit consulter un professionnel de la santé ou suivre une formation agréée pour obtenir des conseils pratiques et validés. L'utilisateur reste seul responsable de l'utilisation de l'application.
                    </p>
                </div>
                <div className="mb-5 px-5">
                    <h2  className="sm:text-2xl text-lg mb-3 font-bold">Droit applicable</h2>
                    <p>
                        Le droit applicable à l'utilisation de l'application est le droit français. Tout litige sera soumis à la compétence des tribunaux français.
                    </p>
                </div>                
            </div>
        </div>
  );
};

export default LegalPage;