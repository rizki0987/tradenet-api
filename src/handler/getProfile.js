const db = require('../config/db');

const getProfile = async (request, h) => {
  const authorizationHeader = request.headers.authorization;
  const token = authorizationHeader.split(' ')[1];

  try {
    const sql = `
      SELECT u.id AS userId, u.username AS userName, u.email AS userEmail, u.phoneNumber AS userPhone, u.userProfilePicture, u.followers, GROUP_CONCAT(g.id SEPARATOR ', ') AS interest
      FROM users u
      JOIN interests g ON FIND_IN_SET(g.id, u.interest)
      JOIN sessions s ON u.email = s.email
      WHERE s.token = ?
      GROUP BY u.id, u.username, u.email, u.phoneNumber, u.userProfilePicture, u.followers
    `;
    const result = await query(sql, [token]);
    if (result.length > 0) {
      const profile = {
        userId: result[0].userId,
        userName: result[0].userName,
        userEmail: result[0].userEmail,
        userPhone: result[0].userPhone,
        profilePictureURL: result[0].userProfilePicture,
        followerCount: result[0].followers,
        interest: result[0].interest.split(', '),
      };
      return {
        success: true,
        data: {
          userProfile: profile,
        },
      };
    } else {
      return h.response('Profil tidak ditemukan').code(404);
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil profil user: ', error);
    return h.response('Terjadi kesalahan').code(500);
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

module.exports = getProfile;
