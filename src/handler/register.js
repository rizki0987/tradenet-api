const db = require('../config/db');
const { nanoid } = require('nanoid');

const register = async (request, h) => {
  const id = nanoid(16);
  const { username, email, password, phoneNumber } = request.payload;

  // Check if username, email, password, and phoneNumber are empty
  if (!username || !email || !password || !phoneNumber) {
    const response = h.response({
      success: false,
      error: 'Missing required fields',
    });
    response.code(400);
    return response;
  }

  try {
    // Check if username already exists in the database
    const checkUsernameSql = 'SELECT * FROM users WHERE username = ?';
    const checkUsernameParams = [username];
    const existingUser = await query(checkUsernameSql, checkUsernameParams);

    if (existingUser.length > 0) {
      const response = h.response({
        success: false,
        error: 'Username already exists',
      });
      response.code(400);
      return response;
    }

    // Hash the password and save the user details to the database
    const sql = `INSERT INTO users (id, username, email, password, phoneNumber) VALUES (?, ?, ?, ?, ?)`;
    const params = [id, username, email, password, phoneNumber];
    await query(sql, params);

    const response = h.response({
      success: true,
      data: {
        userProfile: {
          userId: id,
          userName: username,
          userEmail: email,
          userPhone: phoneNumber,
          interest: [],
        },
      },
    });
    response.code(201);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      success: false,
      error: 'Terjadi kesalahan server',
    });
    response.code(500);
    return response;
  }
};

// Fungsi untuk menjalankan query dengan menggunakan Promise
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

module.exports = register;