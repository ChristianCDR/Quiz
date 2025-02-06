import { FaEllipsisV } from "react-icons/fa";

const AccountDeletionPage = () => {

    return (
        <div className="flex flex-col items-center p-2 bg-white text-black">
            <h1 className="text-center text-xl sm:text-3xl font-bold text-primary mb-4">Suppression de compte et de données personnelles</h1>
            <div className="w-full bg-white lg:w-3/5 sm:text-xl text-base"> 
                <div className="py-5 px-5">
                    <p>Chez RESQ18, nous respectons votre droit à la confidentialité et nous vous offrons une option simple et claire pour supprimer votre compte ainsi que les données qui y sont associées.</p>
                </div>
                <div className="bg-gray-100 py-5 px-5">
                    <h2 className="sm:text-2xl text-lg mb-3 font-bold">1. Supprimer votre compte via les paramètres de l'application</h2>
                    <p className="mb-2">Si vous souhaitez supprimer votre compte et toutes les données associées, vous pouvez le faire directement dans l'application en suivant ces étapes :</p>
                    <div>
                        <ul>
                            <li> <span className="font-bold">Étape 1 :</span> Ouvrez l'application et cliquez sur <FaEllipsisV className="inline"/> </li>
                            <li> <span className="font-bold">Étape 2 :</span> Accédez à <span className="font-bold">Mon Compte</span>. </li>
                            <li> <span className="font-bold">Étape 3 :</span> Cliquez sur  <span className="font-bold">Supprimer mon compte</span>.</li>
                            <li> <span className="font-bold">Étape 4 :</span> Sélectionnez <span className="font-bold">Oui</span> pour confirmer la suppression de votre compte et de toutes les données associées.</li>
                        </ul>
                    </div>
                </div>
                <div className="py-5 px-5">
                    <h2 className="sm:text-2xl text-lg mb-3 font-bold">2. Contacter notre service d'assistance</h2>
                    <p>Si vous avez des questions ou rencontrez des problèmes, vous pouvez nous contacter via notre service d'assistance :</p>
                    <p> <span className="font-bold">Par e-mail :</span> envoyez votre demande à <a href="mailto:contact@resq18.fr">contact@resq18.fr</a>.</p>
                    <p>Notre équipe est à votre disposition pour vous assister et traiter votre demande dans les plus brefs délais.</p>
                </div>
                <div className="bg-gray-100 py-5 px-5">
                    <h2 className="sm:text-2xl text-lg mb-3 font-bold">3. Détails importants à connaître avant de supprimer votre compte</h2>
                    <p>La suppression de votre compte entraîne la suppression irréversible de toutes les données associées, à savoir :</p>
                    <div className="my-2">
                        <ul>
                            <li className="font-bold">Votre adresse e-mail</li>
                            <li className="font-bold">Votre mot de passe</li>
                            <li className="font-bold">Votre nom d'utilisateur</li>
                            <li><span className="font-bold">Votre photo de profil </span>(si vous en avez téléchargé une).</li>
                        </ul>
                    </div>
                    <p>
                        <span className="font-bold">Attention :</span> Cette action est <span className="font-bold"> définitive.</span> Vous ne pourrez pas récupérer votre compte ou les informations qui y sont associées après la suppression.
                    </p>
                </div>
                <div className="py-5 px-5">
                    <h2 className="sm:text-2xl text-lg mb-3 font-bold">4. Autres questions ?</h2>
                    <p>Si vous avez des questions supplémentaires ou des préoccupations, vous pouvez nous contacter directement via notre service d'assistance. Nous sommes là pour vous aider.</p>
                </div>
            </div>
        </div> 
    );
}
export default AccountDeletionPage;