require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./database');

const app = express();
const port = process.env.PORT || 3000;

// Autorise votre projet Angular, lancé habituellement sur le port 4200.
app.use(cors({
  origin: 'http://localhost:4200'
}));

// Permet de lire les données JSON envoyées par Angular.
app.use(express.json());

/**
 * Vérifier que l'API fonctionne.
 */
app.get('/api/health', (req, res) => {
  res.json({ message: 'API gifts opérationnelle.' });
});

/**
 * Obtenir tous les utilisateurs.
 */
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, avatar, gender
      FROM users
      ORDER BY id
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des utilisateurs.'
    });
  }
});

/**
 * Créer un utilisateur.
 */
app.post('/api/users', async (req, res) => {
  const { name, avatar, gender } = req.body;

  if (!name || !gender) {
    return res.status(400).json({
      message: 'Les champs name et gender sont obligatoires.'
    });
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO users (name, avatar, gender)
        VALUES ($1, $2, $3)
        RETURNING id, name, avatar, gender
      `,
      [name, avatar || null, gender]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur lors de la création de l’utilisateur.'
    });
  }
});

/**
 * Obtenir tous les cadeaux, avec leur utilisateur et leurs catégories.
 */
app.get('/api/gifts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        g.id,
        g.name,
        g.brand,
        g.price,
        g.url,
        g.photo,
        g.user_id,
        u.name AS user_name,
        COALESCE(
          json_agg(
            json_build_object('id', c.id, 'name', c.name)
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'
        ) AS categories
      FROM gifts g
      JOIN users u ON u.id = g.user_id
      LEFT JOIN gift_categories gc ON gc.gift_id = g.id
      LEFT JOIN categories c ON c.id = gc.category_id
      GROUP BY g.id, u.id
      ORDER BY g.id
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des cadeaux.'
    });
  }
});

/**
 * Obtenir les cadeaux d'un utilisateur précis.
 */
app.get('/api/users/:userId/gifts', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `
        SELECT
          g.id,
          g.name,
          g.brand,
          g.price,
          g.url,
          g.photo,
          COALESCE(
            json_agg(
              json_build_object('id', c.id, 'name', c.name)
            ) FILTER (WHERE c.id IS NOT NULL),
            '[]'
          ) AS categories
        FROM gifts g
        LEFT JOIN gift_categories gc ON gc.gift_id = g.id
        LEFT JOIN categories c ON c.id = gc.category_id
        WHERE g.user_id = $1
        GROUP BY g.id
        ORDER BY g.id
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des cadeaux utilisateur.'
    });
  }
});

app.listen(port, () => {
  console.log(`API disponible sur http://localhost:${port}`);
});
