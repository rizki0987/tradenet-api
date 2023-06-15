const db = require('../config/db');

const createPost = (request, h) => {
  const { imageURL, title, caption, priceItem, userId, interest_id } = request.payload;

  if (!imageURL || !title || !caption || !priceItem || !interest_id) {
    throw new Error('Semua field harus diisi');
  }

  const post = { imageURL, title, caption, priceItem, userId, interest_id };

  try {
    // Simpan postingan ke tabel "content"
    const query = db.query('INSERT INTO content SET ?', post);
    console.log('Postingan berhasil disimpan');
    return 'Postingan berhasil dibuat';
  } catch (error) {
    console.error('Gagal menyimpan postingan: ', error);
    throw error;
  }
};

module.exports = createPost;