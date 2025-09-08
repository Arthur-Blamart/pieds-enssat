import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [answer, setAnswer] = useState("");
  const [page, setPage] = useState("jeu");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    if (page === "jeu") {
      fetch("https://pieds-enssat-production.up.railway.app/pieds/random")
        .then(res => res.json())
        .then(data => {
          if (data && data.url_image) {
            setPhotoUrl(data.url_image);
          } else {
            setPhotoUrl(null);
          }
        })
        .catch(() => setPhotoUrl(null));
    }
  }, [page]);

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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          {photoUrl ? (
            <img src={photoUrl} alt="Qui est sur la photo ?" style={{ maxWidth: "300px", marginBottom: "2rem", borderRadius: "30px", boxShadow: "0 4px 16px rgba(191,162,76,0.15)" }} />
          ) : (
            <div style={{ width: "300px", height: "300px", display: "flex", alignItems: "center", justifyContent: "center", background: "#eee", borderRadius: "30px", marginBottom: "2rem" }}>Chargement...</div>
          )}
          <h1 style={{ color: "#bfa24c", marginBottom: "1rem" }}>À qui appartiennent les pieds ?</h1>
          <input
            type="text"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            style={{ padding: "0.5rem", fontSize: "1.2rem", width: "250px", textAlign: "center", borderRadius: "8px", border: "2px solid #bfa24c", marginBottom: "1rem", color: "#5c6f6f", background: "#fff" }}
          />
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
          <input type="text" placeholder="Votre nom" style={{ padding: "0.5rem", fontSize: "1.2rem", width: "250px", textAlign: "center", marginBottom: "1rem", borderRadius: "8px", border: "2px solid #bfa24c", color: "#5c6f6f", background: "#fff" }} />
          <button style={{ padding: "0.5rem 1.5rem", fontSize: "1.1rem", borderRadius: "8px", background: "#bfa24c", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>Envoyer</button>
        </div>
      )}
    </div>
  );
}

export default App