const db = require('../config/db');
const { nanoid } = require('nanoid');

const login = async (request, h) => {
  try {
    const { email, password } = request.payload;

    // Lakukan validasi username dan password dengan mengambil data dari MySQL
    const sql = `
      SELECT users.*, GROUP_CONCAT(interests.genre) AS interests
      FROM users
      LEFT JOIN interests ON FIND_IN_SET(interests.id, users.interest)
      WHERE email = ?
      GROUP BY users.id, users.username
    `;

    const results = await query(sql, [email]);
    const user = results[0];

    if (!user) {
      const response = {
        success: false,
        error: 'Login Username tidak valid',
      };
      return h.response(response).code(401);
    }

    if (user.password !== password) {
      const response = {
        success: false,
        error: 'password tidak valid',
      };
      return h.response(response).code(401);
    }

    // Cek apakah sudah login sebelumnya
    const sessionCheckSql = `SELECT * FROM sessions WHERE email = ?`;
    const sessionCheckParams = [email];
    const existingSession = await query(sessionCheckSql, sessionCheckParams);

    if (existingSession.length > 0) {
      const response = {
        success: false,
        error: 'Sudah login',
      };
      return h.response(response).code(401);
    }

    // Simpan informasi sesi ke dalam database
    if (existingSession.length === 0) {
      const token = nanoid(16);
      const sessionSql = `INSERT INTO sessions (email, token) VALUES (?, ?)`;
      const sessionParams = [email, token];
      await query(sessionSql, sessionParams);
      user.token = token;
    }

    if (user.interest) {
      // Pengguna sudah pernah memilih interest content sebelumnya
      const response = {
        success: true,
        data: {
          token: {
            token: user.token,
          },
          userProfile: {
            userId: user.id,
            userName: user.username,
            userEmail: user.email,
            userPhone: user.phoneNumber,
            interest: user.interests.split(','),
          },
        },
      };
      return h.response(response).code(200);
    } else {
      // Pengguna belum memiliki minat (interest)
      const response = {
        success: true,
        data: {
          token: {
            token: user.token,
          },
          userProfile: {
            userId: user.id,
            userName: user.username,
            userEmail: user.email,
            userPhone: user.phoneNumber,
            interest: [],
          },
        },
      };
      return h.response(response).code(200);
    }
  } catch (error) {
    console.error(error);
    const response = {
      success: false,
      error: 'Terjadi kesalahan server',
    };
    return h.response(response).code(500);
  }
};

// Fungsi untuk menjalankan query dengan menggunakan Promise
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = login;