const db = require('../config/db')
const { nanoid } = require('nanoid');
const register = async (request, h) => {
    const id = nanoid(16);
    const { username, email, password, phoneNumber } = request.payload;
  
    // Check if username is empty
    if (!username) {
      const response = h.response({
        status: 'fail',
        message: 'Username cannot be empty',
      });
      response.code(400);
      return response;
    }
    if (!email) {
        const response = h.response({
          status: 'fail',
          message: 'email cannot be empty',
        });
        response.code(400);
        return response;
      }
      if (!password) {
        const response = h.response({
          status: 'fail',
          message: 'password cannot be empty',
        });
        response.code(400);
        return response;
      }
      if (!phoneNumber) {
        const response = h.response({
          status: 'fail',
          message: 'phone Number cannot be empty',
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
          status: 'fail',
          message: 'Username already exists',
        });
        response.code(400);
        return response;
      }
  
      // Hash the password
  
      const sql = `INSERT INTO users (id, username, email, password, phoneNumber) VALUES (?, ?, ?, ?, ?)`;
  
      const params = [id, username, email, password, phoneNumber];
  
      db.query(sql, params, function (err, result) {
        if (err) throw err;
        console.log('Result: ' + result);
      });
  
      const response = h.response({
        status: 'success',
        message: 'sukses register',
      });
      response.code(201);
      return response;
    } catch (e) {
      const response = h.response({
        status: 'fail',
        message: e.message,
      });
      response.code(400);
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

module.exports = register
