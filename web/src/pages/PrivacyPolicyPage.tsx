const PrivacyPolicyPage = () => {

    return (
        <div className="flex flex-col items-center p-8 bg-white text-black">
            <h1 className="text-xl sm:text-3xl font-bold text-primary mb-4">Politique de confidentialité</h1>
            <div className="w-full bg-white lg:w-3/5 sm:text-xl text-base"> 
                <div className="py-5 px-5">
                    <h2 className="sm:text-2xl text-lg mb-3 font-bold">1. Responsable du traitement des données</h2>
                    <p>L'application est gérée par Christian CLAUDE DIT REGENT. </p> 
                    <p> Pour toute question concernant la collecte de vos données, vous pouvez nous contacter à l'adresse suivante : contact@resq18.fr.</p>
                </div>
                <div className="bg-gray-100 py-5 px-5">
                    <h2 className="sm:text-2xl text-lg mb-3 font-bold">2. Types de données collectées</h2>
                    <p>Nous collectons uniquement l'adresse email pour l'authentification des utilisateurs. Aucune donnée sensible n'est collectée.</p>
                </div>
                <div className="py-5 px-5">
                    <h2 className="sm:text-2xl text-lg mb-3 font-bold">3. Finalité de la collecte des données</h2>
                    <p>Les données collectées sont utilisées pour permettre l'authentification des utilisateurs et améliorer l'expérience de l'application.</p>
                </div>
                <div className="bg-gray-100 py-5 px-5">
                    <h2 className="sm:text-2xl text-lg mb-3 font-bold">4. Base légale du traitement</h2>
                    <p>Le traitement de vos données repose sur votre consentement explicite lors de la création de votre compte.</p>
                </div>
                <div className="py-5 px-5">
                    <h2 className="sm:text-2xl text-lg mb-3 font-bold">5. Durée de conservation</h2>
                    <p>Nous conservons vos données personnelles uniquement pendant la durée nécessaire à la gestion de votre compte. Après cela, vos données seront supprimées.</p>
                </div>
                <div className="bg-gray-100 py-5 px-5">
                    <h2 className="sm:text-2xl text-lg mb-3 font-bold">6. Destinataires des données</h2>
                    <p>Vos données personnelles ne sont en aucun cas partagées avec des tiers, sauf si nécessaire pour assurer les services de l'application.</p>
                </div>
                <div className="py-5 px-5">
                    <h2 className="sm:text-2xl text-lg mb-3 font-bold">7. Transfert de données</h2>
                    <p>Aucune donnée personnelle n'est transférée en dehors de l'Union Européenne.</p>
                </div>
                <div className="bg-gray-100 py-5 px-5">
                    <h2 className="sm:text-2xl text-lg mb-3 font-bold">8. Sécurité des données</h2>
                    <p>Nous mettons en place des mesures de sécurité techniques et organisationnelles pour protéger vos données personnelles contre toute perte, accès non autorisé ou divulgation.</p>
                </div>
                <div className="py-5 px-5">
                    <h2 className="sm:text-2xl text-lg mb-3 font-bold">9. Vos droits</h2>
                    <p>En vertu des lois applicables, vous avez certains droits concernant vos données personnelles, notamment :</p>
                    <ul className="my-3">
                        <li> <strong className="text-lg">Droit d'accès</strong> : Vous avez le droit de demander une copie des informations personnelles que nous détenons à votre sujet.</li>
                        <li> <strong className="text-lg">Droit de rectification</strong>  : Vous pouvez corriger ou mettre à jour vos informations personnelles si elles sont incorrectes ou incomplètes.
                        </li>
                        <li><strong className="text-lg">Droit de suppression</strong> : Vous pouvez demander la suppression de vos informations personnelles dans certaines circonstances.</li>
                        <li><strong className="text-lg">Droit d’opposition</strong> : Vous pouvez vous opposer à l'utilisation de vos données personnelles à des fins de marketing direct.</li>
                    </ul>
                    <p>Pour exercer ces droits, veuillez nous contacter à l'adresse suivante : <a href="mailto:contact@resq18.fr">contact@resq18.fr.</a></p>
                </div>
                <div className="bg-gray-100 py-5 px-5">
                    <h2 className="sm:text-2xl text-lg mb-3 font-bold">10. Modifications de la politique</h2>
                    <p>Cette politique de confidentialité peut être modifiée à tout moment. Nous vous informerons de toute mise à jour par email ou via l'application.</p>
                </div>
            </div>
        </div> 
    );
}
export default PrivacyPolicyPage;