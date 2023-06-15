const db = require('../config/db');
const getPost = (request, h) => {

    const userId = request.params.userId;

  // Query untuk mengambil postingan berdasarkan userId
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
      CONCAT('Rp.', content.priceItem) AS priceItemPrintAble,
      content.commentCount
    FROM
      content
    INNER JOIN
      users ON content.userId = users.id
    WHERE
      content.userId = ?
    GROUP BY
      content.contentId
    ORDER BY
      content.contentId DESC;
  `;

  return new Promise((resolve, reject) => {
    db.query(query, userId, (error, results, fields) => {
      if (error) {
        console.error('Gagal mengambil postingan: ', error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = getPost;