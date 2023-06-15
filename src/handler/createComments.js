const db = require('../config/db');

const createComments = async (request, h) => {
  try {
    const { message, postID } = request.payload;

    if (!message || !postID) {
      return h.response({
        success: false,
        error: 'Semua field harus diisi',
      }).code(400);
    }

    const authorizationHeader = request.headers.authorization;
    const token = authorizationHeader.split(' ')[1];

    if (!token) {
      return h.response({
        success: false,
        error: 'Token tidak valid atau tidak tersedia',
      }).code(401);
    }

    // Fetch userId based on the token from the sessions table
    const { userId } = await getUserIdByToken(token);

    if (!userId) {
      return h.response({
        success: false,
        error: 'Token tidak valid atau tidak tersedia',
      }).code(401);
    }

    // Save the comment to the "comments" table with userId
    await db.query('INSERT INTO comments (message, postID, userId) VALUES (?, ?, ?)', [message, postID, userId]);

    console.log('Komentar berhasil disimpan');
    return h.response({
      success: true,
      data: {
        message
      },
    }).code(200);
  } catch (error) {
    console.error('Gagal menyimpan komentar: ', error);
    return h.response({
      success: false,
      error: 'Terjadi kesalahan saat membuat komentar',
      errorCode: 500,
    }).code(500);
  }
};

// Function to fetch userId by token from the sessions table
const getUserIdByToken = (token) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT u.id AS userId FROM sessions s JOIN users u ON s.email = u.email WHERE s.token = ?', [token], (error, results) => {
      if (error) {
        reject(error);
      } else {
        const session = results[0];
        const userId = session ? session.userId : null;
        resolve({ userId });
      }
    });
  });
};

module.exports = createComments;
