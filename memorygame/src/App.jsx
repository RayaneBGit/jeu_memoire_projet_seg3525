// Importe le composant Platforme qui contient le jeu Simon Says
import Platforme from "./Platforme";

// Composant principal de l'application
function App() {
  return (
    <div className="App">
    
      {/* En-tête de la page (titre principal) */}
      <header className="App-header">
        <h1>Jeu de memoire ici! </h1>
      </header>

      {/* Zone principale de l'application */}
      <main>
        {/* Appel du composant Platforme, avec la prop "nom_jeu" */}
        <Platforme nom_jeu="jeu memoire simon says"></Platforme>
      </main>

    </div>
  );
}

// Rend le composant App accessible à ReactDOM
export default App;
