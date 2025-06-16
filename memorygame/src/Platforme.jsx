
import Dalles_color from "./Dalles_color";
import "./Platforme.css"

function Platforme (parameter){

    return <div>
    <div><h2>Platforme, {parameter.nom_jeu}</h2></div>
    <div className="conteneur_platforme">
        <Dalles_color></Dalles_color>
    </div>
    </div>
}

export default Platforme;