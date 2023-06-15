const db = require('../config/db');

const getInterests = async (request, h) => {
  try {
    const sql = `
      SELECT id, genre, imageURL
      FROM interests
    `;
    const results = await query(sql);
    const interests = results.map((row) => ({
      id: row.id,
      name: row.genre,
      imageUrl: row.imageURL,
    }));
    return {
      success: true,
      data: {
        list: interests,
      },
    };
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil daftar interest: ', error);
    return {
      success: false,
      error: 'Terjadi kesalahan',
      errorCode: 500,
    };
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

module.exports = getInterests;
