const db = require('../config/db');

const interest = async (request, h) => {
  try {
    const { interest } = request.payload;
    const authorizationHeader = request.headers.authorization;
    const token = authorizationHeader.split(' ')[1];

    // Fetch the email from the sessions table based on the token
    const email = await getEmailByToken(token);

    if (!email) {
      return h.response({
        success: false,
        error: 'Invalid token',
      }).code(401);
    }

    // Fetch the existing interests for the user from the database
    const existingInterests = await getInterestsByEmail(email);

    // Convert the existing interests to an array of numbers
    const existingInterestsArray = existingInterests.map(Number);

    // Combine the existing interests with the new interests
    const updatedInterests = [...new Set([...existingInterestsArray, ...interest])];

    const interestsString = updatedInterests.join(',');

    // Update the interests in the database for the user
    await updateInterests(email, interestsString);

    const updatedInterestsData = await getInterestsByEmail(email);

    return h.response({
      success: true,
      data: updatedInterestsData,
    }).code(200);
  } catch (error) {
    console.error(error);
    return h.response({
      success: false,
      error: 'An error occurred while adding interests',
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

// Function to fetch existing interests by email
const getInterestsByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT interest FROM users WHERE email = ?', [email], (error, results) => {
      if (error) {
        reject(error);
      } else {
        const user = results[0];
        const interests = user ? (user.interest || '').split(',').filter(interest => interest !== '').map(Number) : [];
        resolve(interests);
      }
    });
  });
};

// Function to update interests by email
const updateInterests = (email, interest) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE users SET interest = ? WHERE email = ?', [interest, email], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

module.exports = interest;