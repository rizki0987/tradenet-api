const db = require('../config/db');

const getContent = (request, h) => {
  const { q } = request.query;

  // Mengatur nilai default untuk q jika tidak ada input dari pengguna
  const qValue = q || '';

  // Query untuk mencari postingan berdasarkan caption dari tabel content
  const query = `
    SELECT
      content.userId,
      users.userProfilePicture AS userProfilePictureSmallURL,
      content.contentId,
      content.imageURL,
      content.title,
      content.caption,
      content.likeCount,
      CASE WHEN content.liked = 1 THEN 'true' ELSE 'false' END AS liked, -- Menggunakan CASE statement untuk mengubah 0/1 menjadi true/false
      content.priceItem,
      CONCAT('Rp.', content.priceItem) AS priceItemPrintAble
    FROM
      content
    INNER JOIN
      users ON content.userId = users.id
    WHERE
      content.caption LIKE '%${qValue}%';
  `;

  return new Promise((resolve, reject) => {
    db.query(query, (error, results, fields) => {
      if (error) {
        console.error('Gagal mengambil postingan: ', error);
        reject({
          success: false,
          error: 'Terjadi kesalahan saat mengambil postingan',
        });
      } else {
        resolve({
          success: true,
          data: {
            list: results.map((result) => ({
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
            })),
          },
        });
      }
    });
  });
};

module.exports = getContent;
