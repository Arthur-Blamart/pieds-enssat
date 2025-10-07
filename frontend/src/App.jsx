

import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [answer, setAnswer] = useState("");
  const [page, setPage] = useState("jeu");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [prenom, setPrenom] = useState("");
  const [indice, setIndice] = useState("");
  const [indice2, setIndice2] = useState("");
  const [showIndice, setShowIndice] = useState(false);
  const [showIndice2, setShowIndice2] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Récupère une photo et le prénom à deviner
  const fetchRandomFoot = async () => {
    setLoading(true);
    setMessage("");
    setAnswer("");
  setShowIndice(false);
  setShowIndice2(false);
    try {
      const res = await fetch("https://pieds-enssat.onrender.com/pieds/random");
      const data = await res.json();
  setPhotoUrl(data.url_image);
  setPrenom(data.nom.split(" ")[0].toLowerCase());
  setIndice(data.indice || "");
  setIndice2(data.indice2 || "");
    } catch (e) {
      setMessage("Erreur lors du chargement de la photo.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (page === "jeu") fetchRandomFoot();
  }, [page]);

  const handleValidation = (e) => {
    e.preventDefault();
    if (answer.trim().toLowerCase() === prenom) {
      setMessage("Bravo, bonne réponse !");
    } else {
      setMessage("Mauvaise réponse, essaie encore !");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#5c6f6f" }}>
      {/* Barre de navigation */}
      <header style={{ width: "100%", background: "#bfa24c", color: "#fff", padding: "1rem 0", marginBottom: "2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
        <nav style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
          <button onClick={() => setPage("jeu")} style={{ background: "#bfa24c", border: "none", color: "#fff", fontSize: "1.1rem", cursor: "pointer", padding: "0.5rem 1.5rem", borderRadius: "8px", fontWeight: "bold" }}>
            Jeu
          </button>
          <button onClick={() => setPage("poster")} style={{ background: "#bfa24c", border: "none", color: "#fff", fontSize: "1.1rem", cursor: "pointer", padding: "0.5rem 1.5rem", borderRadius: "8px", fontWeight: "bold" }}>
            Déposer la photo
          </button>
        </nav>
      </header>

      {/* Contenu selon la page */}
      {page === "jeu" && (
        <div style={{ position: "relative", display: "flex", flexDirection: "row", alignItems: "flex-start", justifyContent: "center", minHeight: "70vh" }}>
          {/* Colonne principale */}
          <div className="main-col-padding-mobile" style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            {loading ? (
              <div style={{ width: "300px", height: "300px", display: "flex", alignItems: "center", justifyContent: "center", background: "#eee", borderRadius: "30px", marginBottom: "2rem" }}>Chargement...</div>
            ) : (
              photoUrl && (
                <img src={photoUrl} alt="Qui est sur la photo ?" style={{ maxWidth: "300px", marginBottom: "2rem", borderRadius: "30px", boxShadow: "0 4px 16px rgba(191,162,76,0.15)" }} />
              )
            )}
            <h1 style={{ color: "#bfa24c", marginBottom: "1rem" }}>À qui appartiennent les pieds ?</h1>
            <form onSubmit={handleValidation} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <input
                type="text"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                style={{ padding: "0.5rem", fontSize: "1.2rem", width: "250px", textAlign: "center", borderRadius: "8px", border: "2px solid #bfa24c", marginBottom: "1rem", color: "#5c6f6f", background: "#fff" }}
                placeholder="Devine le prénom"
              />
              <button type="submit" style={{ padding: "0.5rem 1.5rem", fontSize: "1.1rem", borderRadius: "8px", background: "#bfa24c", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>Valider</button>
            </form>
            <div style={{ margin: "10px", minHeight: "24px", fontWeight: "bold", fontSize: "1.3rem", color: message === "Bravo, bonne réponse !" ? "#1db954" : message ? "#d90429" : undefined }}>
              {message}
            </div>
            {/* Panneau indices : en bas sur mobile, à droite sur desktop */}
            <div className="indices-panel">
              <div style={{ background: "#bfa24c", color: "#111", borderRadius: "16px", boxShadow: "0 2px 8px rgba(191,162,76,0.15)", padding: "1rem", minWidth: "180px", minHeight: "80px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <button
                  style={{ marginBottom: "0.5rem", padding: "0.5rem 1.2rem", fontSize: "1.05rem", borderRadius: "8px", background: "#5c6f6f", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold", width: "100%" }}
                  onClick={() => {
                    if (indice) {
                      setShowIndice(true);
                    }
                  }}
                  disabled={!indice}
                >
                  {showIndice ? "Indice révélé" : "Révéler l'indice"}
                </button>
                <button
                  style={{ marginBottom: "0.5rem", padding: "0.5rem 1.2rem", fontSize: "1.05rem", borderRadius: "8px", background: "#5c6f6f", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold", width: "100%" }}
                  onClick={() => {
                    if (indice2) {
                      setShowIndice2(true);
                    }
                  }}
                  disabled={!indice2}
                >
                  {showIndice2 ? "2ᵉ indice révélé" : "Révéler le 2ᵉ indice"}
                </button>
                <div style={{ minHeight: "24px", width: "100%", textAlign: "center" }}>
                  {showIndice && indice && (
                    <div style={{ margin: "10px 0 0 0", fontWeight: "bold", fontSize: "1.1rem", color: "#111" }}>
                      Indice : {indice}
                    </div>
                  )}
                  {showIndice2 && indice2 && (
                    <div style={{ margin: "10px 0 0 0", fontWeight: "bold", fontSize: "1.1rem", color: "#111" }}>
                      2ᵉ indice : {indice2}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Panneau indices supprimé ici, il est dans la colonne principale */}
        </div>
      )}

      {page === "poster" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "40vh" }}>
          <h1 style={{ color: "#bfa24c", marginBottom: "1rem" }}>Envoyer la photo de vos pieds</h1>
          <p style={{ fontSize: "1.2rem", color: "#5c6f6f", marginBottom: "2rem", textAlign: "center" }}>
            Pour participer, envoyez simplement votre photo par mail à&nbsp;
            <a href="mailto:caca@arthurblamart.fr" style={{ color: "#bfa24c", fontWeight: "bold", textDecoration: "underline" }}>caca@arthurblamart.fr</a>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;