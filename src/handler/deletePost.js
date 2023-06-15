const db = require('../config/db');

const deletePost = (request, h) => {
  return new Promise((resolve, reject) => {
    const contentId = request.params.contentId;
    const deleteQuery = 'DELETE FROM content WHERE contentId = ?';
    db.query(deleteQuery, contentId, (error, results, fields) => {
      if (error) {
        console.error('Gagal menghapus postingan: ', error);
        reject(error);
      } else {
        console.log('Postingan berhasil dihapus');
        resolve('Postingan berhasil dihapus');
      }
    });
  });
};

module.exports = deletePost;