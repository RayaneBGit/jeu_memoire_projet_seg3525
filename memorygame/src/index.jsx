// Importe la méthode de rendu spécifique à React 18
import ReactDOM from 'react-dom/client';

// Importe le composant principal de l'application
import App from './App';

// Crée une "racine" React à partir de l'élément HTML avec l'ID 'root'
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rend l'application React dans cette racine
root.render(
    <App />
);
