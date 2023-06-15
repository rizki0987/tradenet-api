const db = require('../config/db');

const logout = async (request, h) => {
  try {
    const authorizationHeader = request.headers.authorization;
    const token = authorizationHeader.split(' ')[1]; // Mengambil nilai token setelah "Bearer "

    // Melakukan query ke tabel sesi untuk mencari token yang cocok
    const sessionCheckSql = `SELECT * FROM sessions WHERE token = ?`;
    const sessionCheckParams = [token];
    const existingSession = await query(sessionCheckSql, sessionCheckParams);

    if (existingSession.length === 0) {
      const response = h.response({
        success: false,
        error: 'Token tidak valid',
      });
      response.code(401);
      return response;
    }

    // Hapus informasi sesi dari database berdasarkan token
    const deleteSessionSql = `DELETE FROM sessions WHERE token = ?`;
    const deleteSessionParams = [token];
    await query(deleteSessionSql, deleteSessionParams);

    const response = h.response({
      success: true,
      data: null,
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      success: false,
      error: 'Terjadi kesalahan server',
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

module.exports = logout;