const fs = require('fs');
const multer = require('multer');
// Création du dossier depot si besoin
const depot = path.join(__dirname, 'depot');
if (!fs.existsSync(depot)) {
  fs.mkdirSync(depot);
}
const upload = multer({ dest: depot });
// Route pour recevoir les photos et le nom
app.post('/upload', upload.single('photo'), (req, res) => {
  // req.file contient la photo, req.body.nom le nom
  if (!req.file || !req.body.nom) {
    return res.status(400).json({ success: false, message: 'Photo ou nom manquant' });
  }
  res.json({ success: true, filename: req.file.filename, originalname: req.file.originalname, nom: req.body.nom });
});
const { getAllFeet, getRandomFeet } = require('./traitements');
const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

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