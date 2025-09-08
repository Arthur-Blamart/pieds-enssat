const fs = require('fs');
const path = require('path');
const multer = require('multer');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Création du dossier depot si besoin
const depot = path.join(__dirname, 'depot');
if (!fs.existsSync(depot)) {
  fs.mkdirSync(depot);
}
// Multer avec nom de fichier explicite (timestamp-nomoriginal)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, depot);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const ts = Date.now();
    cb(null, `${ts}_${base}${ext}`);
  }
});
const upload = multer({ storage });

/**
 * @swagger
 * /pieds:
 *   get:
 *     summary: Obtenir la liste de tous les pieds
 *     responses:
 *       200:
 *         description: Liste de tous les pieds
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
app.get('/pieds', (req, res) => {
  try {
    const pieds = getAllFeet();
    // Ajoute une URL d'accès à l'image si le champ chemin existe
    const piedsAvecUrl = pieds.map(pied => pied.chemin ? { ...pied, url_image: `${req.protocol}://${req.get('host')}/${pied.chemin}` } : pied);
    res.json(piedsAvecUrl);
  } catch (e) {
    res.status(500).json({ error: 'Erreur lors de la récupération des pieds.' });
  }
});

// Route pour recevoir un objet JSON { nom: string, photo: base64 }
app.post('/upload', async (req, res) => {
  try {
    const { nom, photo } = req.body;
    if (!nom || !photo) {
      return res.status(400).json({ success: false, message: 'Photo ou nom manquant' });
    }
    // photo doit être une string base64 (ex: data:image/jpeg;base64,...)
    const matches = photo.match(/^data:(image\/(jpeg|png|jpg));base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ success: false, message: 'Format de photo non supporté (attendu: base64 data url)' });
    }
    const ext = matches[2] === 'jpeg' ? '.jpg' : '.' + matches[2];
    const base64Data = matches[3];
    const ts = Date.now();
    const safeNom = nom.replace(/[^a-zA-Z0-9_-]/g, '_');
    const nomFichier = `${ts}_${safeNom}${ext}`;
    const filePath = path.join(depot, nomFichier);
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
    // Stocker le nom dans un .txt à côté
    const metaPath = path.join(depot, nomFichier + '.txt');
    fs.writeFileSync(metaPath, nom, 'utf8');
    res.json({ success: true, filename: nomFichier, nom });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur lors de l\'enregistrement', error: err.message });
  }
});

const { getAllFeet, getRandomFeet } = require('./traitements');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API des pieds',
    version: '1.0.0',
    description: 'Documentation de l’API des pieds avec Swagger',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./index.js'], // Documentation dans ce fichier
};

const swaggerSpec = swaggerJsdoc(options);

// Servir les images statiques
app.use('/pieds/photos', express.static(path.join(__dirname, 'pieds/photos')));

// Routes de base
/**
 * @swagger
 * /:
 *   get:
 *     summary: Test de l'API
 *     responses:
 *       200:
 *         description: Ping/Pong
 */
app.get('/ping', (req, res) => {
  res.json({ message: 'Pong !' });
});

/**
 * @swagger
 * /pieds/random:
 *   get:
 *     summary: Obtenir un pied aléatoire
 *     description: Retourne un objet pied aléatoire.
 *     responses:
 *       200:
 *         description: Pied aléatoire
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nom:
 *                   type: string
 *                 taille:
 *                   type: number
 *                   format: float
 */
app.get('/pieds/random', (req, res) => {
  const pied = getRandomFeet();
  // Ajoute une URL d'accès à l'image si le champ chemin existe
  let piedAvecUrl = { ...pied };
  if (pied.chemin) {
    piedAvecUrl.url_image = `${req.protocol}://${req.get('host')}/${pied.chemin}`;
  }
  res.json(piedAvecUrl);
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Documentation Swagger: http://localhost:${PORT}/api-docs`);
});