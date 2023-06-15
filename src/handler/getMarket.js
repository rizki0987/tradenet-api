const db = require('../config/db');

const getMarket = (request, h) => {
  const userId = request.query.userId;
  const startIndex = parseInt(request.query.startIndex) || 0;
  const limit = parseInt(request.query.limit) || 20;

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
      CONCAT('Rp', content.priceItem) AS priceItemPrintAble
    FROM
      content
    INNER JOIN
      users ON content.userId = users.id
    WHERE
      content.userId = ?
    GROUP BY
      content.contentId, users.userProfilePicture
    ORDER BY
      content.contentId DESC
    LIMIT ?, ?;
  `;

  return new Promise((resolve, reject) => {
    db.query(query, [userId, startIndex, limit], (error, results, fields) => {
      if (error) {
        console.error('Gagal mengambil postingan: ', error);
        reject(error);
      } else {
        const list = results.map((result) => ({
          creatorProfile: {
            userId: result.userId,
            userProfilePictureSmallURL: result.userProfilePictureSmallURL,
          },
          content: {
            contentId: result.contentId,
            imageURL: result.imageURL,
            title: result.title,
            caption: result.caption,
            likeCount: result.likeCount,
            liked: result.liked,
            priceItem: result.priceItem,
            priceItemPrintAble: result.priceItemPrintAble,
          },
        }));
        resolve(list);
      }
    });
  });
};

module.exports = getMarket;
