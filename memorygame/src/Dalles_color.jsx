import './style.css';
// Import du fichier CSS pour styliser les dalles de couleur
import "./Dalles_color.css";

// Import des hooks React nécessaires
import { useEffect, useState } from "react";

// Déclaration du composant principal du jeu Simon Says
function Dalles_color(parameter) {
  // Couleurs possibles pour les dalles
  const [couleursDalles] = useState(["rouge", "jaune", "vert", "bleu"]);

  // La séquence actuelle à reproduire (générée par l'IA)
  const [sequence, setSequence] = useState([]);

  // La séquence de clics faite par le joueur
  const [clicsJoueur, setClicsJoueur] = useState([]);

  // Indique si le joueur a perdu
  const [perdu, setPerdu] = useState(false);

  // Indique si le joueur a réussi à reproduire la séquence
  const [sequenceGagner, setSequenceGagner] = useState(false);

  // Score actuel du joueur
  const [score, setScore] = useState(0);

  // État global du jeu (messages affichés : "Tu joues", "IA joue", etc.)
  const [etat, setEtat] = useState("jeu fermé");

  // État qui veut dire que c'est permissible de jouer vs non
  const [permission, setPermission] = useState(false);

  // Fonction appelée quand on clique sur "Commencer jeu"
  function commencerJeu() {
    refaireNiveauParametres();      // Réinitialise les clics et les états gagnant/perdu
    genererSequenceInitiale();      // Lance la première séquence IA (1 seule couleur)
    setEtat("Commencement du jeu en cours..."); // Message d'intro temporaire
    // ✅ Affiche "Monsieur IA joue..." 1.5 sec plus tard
    setTimeout(() => {
      setEtat("Monsieur Ia joue...");
    }, 1500);
  }

  // Fonction pour jouer un son à partir d'un fichier audio
  function jouerSon(fichier) {
    const audio = new Audio(fichier);
    audio.volume = 0.5;
    audio.play();
  }

  // Génère la première couleur de la séquence (au début du jeu ou après une défaite)
  function genererSequenceInitiale() {
    let indice = Math.floor(Math.random() * couleursDalles.length);
    let couleur = couleursDalles[indice];
    setSequence([couleur]); // Nouvelle séquence = [1 couleur]
    console.log("Première couleur générée :", couleur);
  }

  // Ajoute une nouvelle couleur à la séquence (quand le joueur a réussi)
  function genererNouvelleSequence() {
    let indice = Math.floor(Math.random() * couleursDalles.length);
    let couleur = couleursDalles[indice];
    const nouvelleSequence = [...sequence, couleur];
    setSequence(nouvelleSequence); // Met à jour la séquence avec une nouvelle couleur
    console.log("Nouvelle séquence :", nouvelleSequence);
  }


   
  // Gère le clic du joueur sur une dalle de couleur
  function gererClic(couleur) {
    const clics = [...clicsJoueur, couleur]; // Ajoute le clic à la liste
    setClicsJoueur(clics); // Met à jour l’état

    // Joue un son différent selon la couleur cliquée
    if (couleur === "rouge") jouerSon("/sons/mixkit-select-click-1109.wav");
    else if (couleur === "jaune") jouerSon("/sons/mixkit-interface-option-select-2573.wav");
    else if (couleur === "vert") jouerSon("/sons/mixkit-software-interface-back-2575.wav");
    else if (couleur === "bleu") jouerSon("/sons/mixkit-software-interface-start-2574.wav");

    // Vérifie la séquence seulement si on n’a pas encore perdu
    if (!perdu) {
      for (let i = 0; i < clics.length; i++) {
        if (clics[i] !== sequence[i]) {
          setPerdu(true); // Mauvais clic → on perd
          return;
        }
      }
      // Si le joueur a reproduit toute la séquence correctement
      if (clics.length === sequence.length) {
        setSequenceGagner(true); // Indique qu’il a gagné ce niveau
      }
    }
  }

  // Récupère les clics du joueur dans le localStorage au démarrage
  useEffect(() => {
    const sauvegarde = localStorage.getItem("clicsJoueur");
    if (sauvegarde) setClicsJoueur(JSON.parse(sauvegarde));
  }, []);

  // Sauvegarde les clics du joueur à chaque modification
  useEffect(() => {
    localStorage.setItem("clicsJoueur", JSON.stringify(clicsJoueur));
  }, [clicsJoueur]);

  // Quand on perd, joue un son et redémarre le jeu avec une nouvelle séquence
  useEffect(() => {
    if (perdu) {
      console.log("J'ai perdu.");
      jouerSon("/sons/mixkit-software-interface-remove-2576.wav");
      refaireTousLesNiveauxParametres();     // Reset total
      genererSequenceInitiale();             // Recommence à 1
      setEtat("Game Over!");                 // Mettre l'état de perte au joueur
      // ✅ Message après 1.5 sec pour dire que l’IA joue
      setTimeout(() => {
        setEtat("Monsieur Ia joue...");
      }, 1500);
    }
  }, [perdu]);



  // Quand on réussit la séquence, joue un son, augmente le score et recommence
  useEffect(() => {
    if (sequenceGagner) {
      console.log("J'ai gagné !");
      setTimeout(() => {
        jouerSon("/sons/mixkit-game-bonus-reached-2065.wav");
        setScore((s) => s + 1);           // Incrémente le score
        genererNouvelleSequence();        // Nouvelle étape du jeu
        refaireNiveauParametres();        // Reset partiel
        setEtat("Bravo, tu a gagné un niveau!");
        // ✅ Après 1.5 sec, retour au tour de l'IA
        setTimeout(() => {
          setEtat("Monsieur Ia joue...");
        }, 1500);
      }, 2000); // Délai pour laisser le joueur savourer la victoire
    }
  }, [sequenceGagner]);

  // Chaque fois que la séquence change, l’IA la rejoue automatiquement
  useEffect(() => {
    if (sequence.length > 0) {
      const DELAI_INITIAL = 2000;                      // Pause avant que l'IA commence
      const DELAI_ENTRE_COULEURS = 1000;               // Temps entre chaque couleur
      const DELAI_AJOUT_ERREUR_SYNCRONISATION = 1000;  // Buffer pour éviter les chevauchements
  
      jouerSequenceIA();                            // Joue la séquence IA

      // ✅ Affiche "Ton tour de jouer" à la fin de l’animation IA
      setTimeout(() => {
        setEtat("Ton tour de jouer!");
      }, DELAI_INITIAL + (DELAI_ENTRE_COULEURS * (sequence.length - 1)) + DELAI_AJOUT_ERREUR_SYNCRONISATION);
    }
  }, [sequence]);

  // Joue la séquence de l’IA avec des délais entre chaque couleur
  function jouerSequenceIA() {
    const DELAI_INITIAL = 2000;
    const DELAI_ENTRE_COULEURS = 1000;

    sequence.forEach((couleur, index) => {
      setTimeout(() => {
        animerDalleIA(couleur); // Animation visuelle
        // Joue le son correspondant
        if (couleur === "rouge") jouerSon("/sons/mixkit-select-click-1109.wav");
        if (couleur === "jaune") jouerSon("/sons/mixkit-interface-option-select-2573.wav");
        if (couleur === "vert") jouerSon("/sons/mixkit-software-interface-back-2575.wav");
        if (couleur === "bleu") jouerSon("/sons/mixkit-software-interface-start-2574.wav");
        console.log("IA a joué :", couleur);
      }, DELAI_INITIAL + index * DELAI_ENTRE_COULEURS);
    });
  }

  // Anime la dalle cliquée en la grossissant brièvement
  function animerDalleIA(couleur) {
    const dalle = document.querySelector(`.dalle_complet_${couleur}`);

    dalle.classList.remove("dalle_grossir"); // On retire la classe si elle y est déjà
    void dalle.offsetWidth; // Force un reflow pour relancer l'animation
    dalle.classList.add("dalle_grossir"); // On applique l’animation

    // Retire l'effet après 0.5 sec
    setTimeout(() => {
      dalle.classList.remove("dalle_grossir");
    }, 500);
  }

  // Réinitialise les états du niveau actuel
  function refaireNiveauParametres() {
    setClicsJoueur([]);
    setSequenceGagner(false);
    setPerdu(false);
  }

  // Réinitialise totalement le jeu
  function refaireTousLesNiveauxParametres() {
    console.log("Réinitialisation complète");
    refaireNiveauParametres();
    setScore(0);
    setSequence([]);
  }

  // Fonction appelée quand on clique sur "Réinitialiser jeu"
  function reinitialiserJeu() {
    jouerSon("/sons/mixkit-retro-arcade-casino-notification-211.wav");
    refaireTousLesNiveauxParametres();
    setEtat("Jeu reinitialisé");
  }
     // Interface graphique principale du jeu
return (
  <div>

    {/* Bloc affichant le score et l’état du jeu, côte à côte */}
    <div className="div_affichages_score_etat_jeu">

      {/* Affichage dynamique du score du joueur */}
      <div className="div_scores">
        <p>Score: {score}</p>
      </div>

      {/* Message d'état du jeu (ex: "jeu fermé", "Ton tour", "IA joue...", etc.) */}
      <div className="div_etat_gagner_ou_perdu">
        <p>{etat}</p>
      </div>

    </div>

    {/* Les 4 dalles de couleur à cliquer, disposées en grille */}
    <div className="groupe_dalles">

      {/* Dalle rouge */}
      <div
        className="dalle_complet_rouge"
        onClick={() => gererClic("rouge")}
      ></div>

      {/* Dalle jaune */}
      <div
        className="dalle_complet_jaune"
        onClick={() => gererClic("jaune")}
      ></div>

      {/* Dalle verte */}
      <div
        className="dalle_complet_vert"
        onClick={() => gererClic("vert")}
      ></div>

      {/* Dalle bleue */}
      <div
        className="dalle_complet_bleu"
        onClick={() => gererClic("bleu")}
      ></div>

    </div>

    {/* Groupe de boutons du bas : commencer et réinitialiser */}
    <div className="div_tous_boutons_jeu">

      {/* Bouton pour démarrer le jeu (première séquence IA) */}
      <div className="div_btn_commencer_jeu">
        <input
          type="button"
          value="Commencer jeu"
          onClick={commencerJeu}
        />
      </div>

      {/* Bouton pour réinitialiser complètement le jeu */}
      <div className="div_btn_reinitialiser_jeu">
        <input
          type="button"
          className="btn_reinitialiser_jeu"
          value="Reinitialiser jeu"
          onClick={reinitialiserJeu}
        />
      </div>

    </div>

  </div>
);


}

// Export du composant pour qu’il puisse être utilisé ailleurs
export default Dalles_color;

