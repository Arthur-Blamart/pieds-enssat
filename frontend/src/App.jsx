

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
  const [showIndice, setShowIndice] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Récupère une photo et le prénom à deviner
  const fetchRandomFoot = async () => {
    setLoading(true);
    setMessage("");
    setAnswer("");
    setShowIndice(false);
    try {
      const res = await fetch("https://pieds-enssat.onrender.com/pieds/random");
      const data = await res.json();
      setPhotoUrl(data.url_image);
      setPrenom(data.nom.split(" ")[0].toLowerCase());
      setIndice(data.indice || "");
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
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
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
          </div>
          {/* Panneau indice à droite */}
          <div style={{ minWidth: "220px", marginLeft: "2rem", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 2px 8px rgba(191,162,76,0.15)", padding: "1rem", minWidth: "180px", minHeight: "80px", display: "flex", flexDirection: "column", alignItems: "center" }}>
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
              <div style={{ minHeight: "24px", width: "100%", textAlign: "center" }}>
                {showIndice && indice && (
                  <div style={{ margin: "10px 0 0 0", fontWeight: "bold", fontSize: "1.1rem", color: "#bfa24c" }}>
                    Indice : {indice}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {page === "poster" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h1 style={{ color: "#bfa24c", marginBottom: "1rem" }}>Déposer la photo de vos pieds</h1>
          <input
            type="file"
            accept="image/*"
            style={{ marginBottom: "1rem", borderRadius: "8px", border: "2px solid #bfa24c", background: "#fff", color: "#5c6f6f" }}
            onChange={e => {
              const f = e.target.files[0];
              setFile(f);
              if (f) {
                const reader = new FileReader();
                reader.onloadend = () => setPreview(reader.result);
                reader.readAsDataURL(f);
              } else {
                setPreview(null);
              }
            }}
          />
          {preview && (
            <img src={preview} alt="Aperçu" style={{ maxWidth: "300px", marginBottom: "1rem", borderRadius: "16px", boxShadow: "0 2px 8px rgba(191,162,76,0.15)" }} />
          )}
          <input
            type="text"
            placeholder="Votre nom"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            style={{ padding: "0.5rem", fontSize: "1.2rem", width: "250px", textAlign: "center", marginBottom: "1rem", borderRadius: "8px", border: "2px solid #bfa24c", color: "#5c6f6f", background: "#fff" }}
          />
          <button
            style={{ padding: "0.5rem 1.5rem", fontSize: "1.1rem", borderRadius: "8px", background: "#bfa24c", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}
            onClick={async (e) => {
              e.preventDefault();
              setMessage("");
              if (!file || !answer.trim()) {
                setMessage("Merci de choisir une photo et d'indiquer votre nom.");
                return;
              }
              const formData = new FormData();
              formData.append("photo", file);
              formData.append("nom", answer.trim());
              try {
                const res = await fetch("https://pieds-enssat.onrender.com/upload", {
                  method: "POST",
                  body: formData
                });
                if (res.ok) {
                  setMessage("Photo envoyée avec succès ! Merci.");
                  setFile(null);
                  setPreview(null);
                  setAnswer("");
                } else {
                  setMessage("Erreur lors de l'envoi. Réessayez plus tard.");
                }
              } catch (err) {
                setMessage("Erreur lors de l'envoi. Réessayez plus tard.");
              }
            }}
          >
            Envoyer
          </button>
          <div style={{ margin: "10px", minHeight: "24px", fontWeight: "bold", fontSize: "1.1rem", color: message === "Photo envoyée avec succès ! Merci." ? "#1db954" : message ? "#d90429" : undefined }}>
            {message}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;