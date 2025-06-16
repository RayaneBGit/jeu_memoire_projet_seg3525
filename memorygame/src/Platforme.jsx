// Importe le composant du jeu Simon Says
import Dalles_color from "./Dalles_color";

// Importe le fichier CSS associé à cette plateforme
import "./Platforme.css";

// Déclaration du composant Platforme (reçoit des paramètres depuis le parent)
function Platforme(parameter) {

    // JSX retourné : structure HTML du composant
    return <div>

        {/* Titre de la plateforme avec le nom du jeu passé en prop */}
        <div><h2>Platforme, {parameter.nom_jeu}</h2></div>

        {/* Conteneur flex pour afficher le jeu Dalles_color */}
        <div className="conteneur_platforme">
            <Dalles_color></Dalles_color> {/* Appel du composant du jeu */}
        </div>

    </div>
}

// Rend le composant utilisable ailleurs
export default Platforme;
