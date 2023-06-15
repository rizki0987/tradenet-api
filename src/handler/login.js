const db = require('../config/db');
const interest = require('./interest')
const { nanoid } = require('nanoid');
const login = async (request, h) => {
    try {
      const { email, password } = request.payload;

      // Lakukan validasi username dan password dengan mengambil data dari MySQL
      const sql = `SELECT users.*, GROUP_CONCAT(interests.genre) AS interests
      FROM users
      LEFT JOIN interests ON FIND_IN_SET(interests.id, users.interest)
      WHERE email = ?
      GROUP BY users.id`;

      const results = await query(sql, [email]);
      const user = results[0];

      if (!user) {
        const response = h.response({
          status: "fail",
          message: "Login Username tidak valid"
        });
        response.code(401);
        return response;
      }

      if (user.password !== password) {
        const response = h.response({
          status: "fail",
          message: "password tidak valid"
        });
        response.code(401);
        return response;
      }

      //Cek apakah sudah login sebelumnya
      const sessionCheckSql = `SELECT * FROM sessions WHERE email = ?`;
      const sessionCheckParams = [email];
      const existingSession = await query(sessionCheckSql, sessionCheckParams);

      if (existingSession.length > 0) {
        const response = h.response({
          status: "fail",
          message: "Sudah login",
        });
        response.code(401);
        return response;
      }

      // Simpan informasi sesi ke dalam database
      if (existingSession.length === 0) {
      const token = nanoid(16);
      const sessionSql = `INSERT INTO sessions (email, token) VALUES (?, ?)`;
      const sessionParams = [email, token];
      await query(sessionSql, sessionParams);

      }
      if (user.interest) {
        // Pengguna sudah pernah memilih interest content sebelumnya
        const response = h.response({
          status: "success",
          message: "Sukses login",
          interests: user.interests.split(','), // Mengembalikan interest content dari pengguna
        });
        response.code(200);
        return response;
      } else {
        // Pengguna login pertama kali
        // Arahkan ke handler interest.js
        return h.redirect(interest);
      }

    } catch (error) {
      console.error(error);
      const response = h.response({
        status: "fail",
        message: "Terjadi kesalahan server"
      });
      response.code(500);
      return response;
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
module.exports = login
