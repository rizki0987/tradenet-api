const db = require('../config/db');

const logout = async (request, h) => {
  try {
    const { email } = request.payload;

    // Hapus informasi sesi dari database
    const sql = `DELETE FROM sessions WHERE email = ?`;
    const params = [email];

    await query(sql, params);

    const response = h.response({
      status: 'success',
      message: 'Logout berhasil'
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: 'fail',
      message: 'Terjadi kesalahan server'
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