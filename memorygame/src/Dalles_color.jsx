import "./Dalles_color.css";
import { useEffect, useState } from "react";

function Dalles_color(parameter) {
  const [couleursDalles] = useState(["rouge", "jaune", "vert", "bleu"]);
  const [sequence, setSequence] = useState([]);
  const [clicsJoueur, setClicsJoueur] = useState([]);
  const [perdu, setPerdu] = useState(false);
  const [sequenceGagner, setSequenceGagner] = useState(false);
  const [score, setScore] = useState(0);

  function commencerJeu() {
    refaireNiveauParametres();
    genererSequenceInitiale(); // ✅ Laisse jouerSequenceIA être appelée via useEffect
  }

  function jouerSon(fichier) {
    const audio = new Audio(fichier);
    audio.volume = 0.5;
    audio.play();
  }

  function genererSequenceInitiale() {
    let indice = Math.floor(Math.random() * couleursDalles.length);
    let couleur = couleursDalles[indice];
    setSequence([couleur]);
    console.log("Première couleur générée :", couleur);
  }

  function genererNouvelleSequence() {
    let indice = Math.floor(Math.random() * couleursDalles.length);
    let couleur = couleursDalles[indice];
    const nouvelleSequence = [...sequence, couleur];
    setSequence(nouvelleSequence);
    console.log("Nouvelle séquence :", nouvelleSequence);
  }

  function gererClic(couleur) {
    const clics = [...clicsJoueur, couleur];
    setClicsJoueur(clics);

    if (couleur === "rouge") jouerSon("/sons/mixkit-select-click-1109.wav");
    else if (couleur === "jaune") jouerSon("/sons/mixkit-interface-option-select-2573.wav");
    else if (couleur === "vert") jouerSon("/sons/mixkit-software-interface-back-2575.wav");
    else if (couleur === "bleu") jouerSon("/sons/mixkit-software-interface-start-2574.wav");

    if (!perdu) {
      for (let i = 0; i < clics.length; i++) {
        if (clics[i] !== sequence[i]) {
          setPerdu(true);
          return;
        }
      }
      if (clics.length === sequence.length) {
        setSequenceGagner(true);
      }
    }
  }

  useEffect(() => {
    const sauvegarde = localStorage.getItem("clicsJoueur");
    if (sauvegarde) setClicsJoueur(JSON.parse(sauvegarde));
  }, []);

  useEffect(() => {
    localStorage.setItem("clicsJoueur", JSON.stringify(clicsJoueur));
  }, [clicsJoueur]);

  useEffect(() => {
    if (perdu) {
      console.log("J'ai perdu.");
      jouerSon("/sons/mixkit-software-interface-remove-2576.wav");
      refaireTousLesNiveauxParametres();
      genererSequenceInitiale(); // recommence à 1
    }
  }, [perdu]);

  useEffect(() => {
    if (sequenceGagner) {
      console.log("J'ai gagné !");
      setTimeout(() => {
        jouerSon("/sons/mixkit-game-bonus-reached-2065.wav");
        setScore((s) => s + 1);
        genererNouvelleSequence(); // ⬅️ Appelle setSequence → useEffect → joue
        refaireNiveauParametres();
      }, 2000);
    }
  }, [sequenceGagner]);

  useEffect(() => {
    if (sequence.length > 0) {
      jouerSequenceIA();
    }
  }, [sequence]);

  function jouerSequenceIA() {
    const DELAI_INITIAL = 2000;
    const DELAI_ENTRE_COULEURS = 1000;

    sequence.forEach((couleur, index) => {
      setTimeout(() => {
        animerDalleIA(couleur);
        if (couleur === "rouge") jouerSon("/sons/mixkit-select-click-1109.wav");
        if (couleur === "jaune") jouerSon("/sons/mixkit-interface-option-select-2573.wav");
        if (couleur === "vert") jouerSon("/sons/mixkit-software-interface-back-2575.wav");
        if (couleur === "bleu") jouerSon("/sons/mixkit-software-interface-start-2574.wav");
        console.log("IA a joué :", couleur);
      }, DELAI_INITIAL + index * DELAI_ENTRE_COULEURS);
    });
  }

  function animerDalleIA(couleur) {
    const dalle = document.querySelector(`.dalle_complet_${couleur}`);
    dalle.classList.add("dalle_grossir");
    setTimeout(() => {
      dalle.classList.remove("dalle_grossir");
    }, 1000);
  }

  function refaireNiveauParametres() {
    setClicsJoueur([]);
    setSequenceGagner(false);
    setPerdu(false);
  }

  function refaireTousLesNiveauxParametres() {
    console.log("Réinitialisation complète");
    refaireNiveauParametres();
    setScore(0);
    setSequence([]);
  }

  function reinitialiserJeu() {
    jouerSon("/sons/mixkit-retro-arcade-casino-notification-211.wav");
    refaireTousLesNiveauxParametres();
  }

  return (
    <div>
      <div className="div_scores">
        <p>Score: {score}</p>
      </div>
      <div className="div_btn_commencer_jeu">
        <input type="button" value="Commencer jeu" onClick={commencerJeu} />
      </div>
      <div className="groupe_dalles">
        <div className="dalle_complet_rouge" onClick={() => gererClic("rouge")}></div>
        <div className="dalle_complet_jaune" onClick={() => gererClic("jaune")}></div>
        <div className="dalle_complet_vert" onClick={() => gererClic("vert")}></div>
        <div className="dalle_complet_bleu" onClick={() => gererClic("bleu")}></div>
      </div>
      <div className="div_btn_reinitialiser_jeu">
        <input type="button" className="btn_reinitialiser_jeu" value="Reinitialiser jeu" onClick={reinitialiserJeu} />
      </div>
    </div>
  );
}

export default Dalles_color;
