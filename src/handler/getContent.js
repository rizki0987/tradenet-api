
const db = require('../config/db');

const getContent = (request, h) => {
    const id = request.params.id;

    // Query untuk mengambil postingan berdasarkan interestId dari tabel users
    const query = `
      SELECT
        content.userId,
        users.userProfilePicture AS userProfilePictureSmallURL,
        content.contentId,
        content.imageURL,
        content.title,
        content.caption,
        content.likeCount,
        content.liked,
        content.priceItem,
        CONCAT('Rp.', content.priceItem) AS priceItemPrintAble
      FROM
        content
      INNER JOIN
        users ON content.userId = users.id
      WHERE
        FIND_IN_SET(content.interest_id, (SELECT interest FROM users WHERE id = ?)) > 0;`;
  
    return new Promise((resolve, reject) => {
      db.query(query,[id], (error, results, fields) => {
        if (error) {
          console.error('Gagal mengambil postingan: ', error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
module.exports = getContent;