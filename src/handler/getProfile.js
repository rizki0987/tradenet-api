const db = require('../config/db');

const getProfile = async (request, h) => {
  const { id } = request.params;
  try {
    const sql = `
      SELECT u.username, u.email, u.phoneNumber, GROUP_CONCAT(g.genre SEPARATOR ', ') AS interest
      FROM users u
      JOIN interests g ON FIND_IN_SET(g.id, u.interest)
      WHERE u.id = ?
      GROUP BY u.id
    `;
    const result = await query(sql, [id]);
    if (result.length > 0) {
      return result[0]; // Mengembalikan profil user sebagai respons JSON
    } else {
      return h.response('Profil tidak ditemukan').code(404);
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil profil user: ', error);
    return h.response('Terjadi kesalahan').code(500);
  }
};

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

module.exports = getProfile;