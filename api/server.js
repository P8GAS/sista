require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:4200'
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'API gifts available.' });
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, surname, avatar
      FROM users
      ORDER BY id
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error while getting users.'
    });
  }
});

app.post('/api/users', async (req, res) => {
  try {

    const { name, surname, avatar, password } = req.body;

    const cleanName = name?.trim();
    const cleanSurname = surname?.trim();

    if (!cleanName || !cleanSurname || !password) {
      return res.status(400).json({
        message: 'Name, surname and password are required.'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'The password must contain at least 8 characters.'
      });
    }

    const existingUser = await pool.query(
      `
          SELECT id
          FROM users
          WHERE name = $1 AND surname = $2
        `,
      [cleanName, cleanSurname]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: 'An account already exists with this name and surname.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `
          INSERT INTO users (
            name,
            surname,
            avatar,
            password_hash
          )
          VALUES ($1, $2, $3, $4)
        `,
      [
        cleanName,
        cleanSurname,
        avatar?.trim() || null,
        passwordHash
      ]
    );

    const createdUser = await pool.query(
      `
          SELECT
            id,
            name,
            surname,
            avatar
          FROM users
          WHERE id = $1
        `,
      [result.lastID]
    );

    return res.status(201).json(createdUser);
  } catch (error) {
    console.error('Unable to create user - full error:', error);
    console.error('PostgreSQL message:', error.message);
    console.error('PostgreSQL code:', error.code);
    console.error('PostgreSQL detail:', error.detail);

  return res.status(500).json({
    message: 'Unable to create the user.'
  });
}
});

app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
        SELECT id, name, surname, avatar
        FROM users
        WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'User not found.'
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Unable to retrieve the user.'
    });
  }
});

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
          g.photo
        FROM gifts g
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
      message: 'Error while getting gifts.'
    });
  }
});

app.post('/api/users/:userId/gifts', async (req, res) => {
  const { userId } = req.params;
  const { name, brand, price, url, photo } = req.body;

  if (!name || !name.trim() || !brand || !price || !url) {
    return res.status(400).json({
      message: 'You are missing required fields.'
    });
  }

  try {
    const userResult = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: 'User not found.'
      });
    }

    const result = await pool.query(
      `
        INSERT INTO gifts (name, brand, price, url, photo, user_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, brand, price, url, photo, user_id
      `,
      [
        name.trim(),
        brand?.trim() || null,
        price || null,
        url?.trim() || null,
        photo?.trim() || null,
        userId
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Unable to create gift.'
    });
  }
});

app.listen(port, () => {
  console.log(`API available on http://localhost:${port}`);
});

app.post('/api/login', async (req, res) => {
  try {
    const { name, surname, password } = req.body;

    const cleanName = name?.trim();
    const cleanSurname = surname?.trim();

    if (!cleanName || !cleanSurname || !password) {
      return res.status(400).json({
        message: 'Name, surname and password are required.'
      });
    }

    const result = await pool.query(
      `
        SELECT id, name, surname, avatar, password_hash
        FROM users
        WHERE name = $1 AND surname = $2
      `,
      [cleanName, cleanSurname]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials.'
      });
    }

    const passwordIsValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordIsValid) {
      return res.status(401).json({
        message: 'Invalid credentials.'
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        name: user.name,
        surname: user.surname
      },
      process.env.JWT,
      {
        expiresIn: '2h'
      }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Unable to log in:', error);

    return res.status(500).json({
      message: 'Unable to log in.'
    });
  }
});
