const db = require('../config/db');

const createPost = async (request, h) => {
  try {
    const { imageURL, caption, interest_id } = request.payload;

    if (!imageURL || !caption || !interest_id) {
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

    // Fetch email based on the token from the sessions table
    const email = await getEmailByToken(token);

    if (!email) {
      return h.response({
        success: false,
        error: 'Token tidak valid atau tidak tersedia',
      }).code(401);
    }

    const post = {
      imageURL,
      caption,
      interest_id,
    };

    // Save the post to the "content" table
    await db.query('INSERT INTO content (imageURL, caption, interest_id) VALUES (?, ?, ?)', [post.imageURL, post.caption, post.interest_id]);

    console.log('Postingan berhasil disimpan');
    return h.response({
      success: true,
      data: {
        content: {
          image: post.imageURL,
          caption: post.caption,
          interest_id: post.interest_id,
        },
      },
    }).code(200);
  } catch (error) {
    console.error('Gagal menyimpan postingan: ', error);
    return h.response({
      success: false,
      error: 'Terjadi kesalahan saat membuat postingan',
    }).code(500);
  }
};

// Function to fetch email by token from the sessions table
const getEmailByToken = (token) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT email FROM sessions WHERE token = ?', [token], (error, results) => {
      if (error) {
        reject(error);
      } else {
        const session = results[0];
        const email = session ? session.email : null;
        resolve(email);
      }
    });
  });
};

module.exports = createPost;