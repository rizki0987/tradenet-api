const db = require('../config/db');

const interest = async (request, h) => {
    try {
        const { username, interest } = request.payload;

        // Fetch the existing interests for the user from the database
        const existingInterests = await getInterestsByUsername(username);

        // Convert the existing interests to an array of numbers
        const existingInterestsArray = existingInterests.map(Number);

        // Combine the existing interests with the new interests
        const updatedInterests = [...new Set([...existingInterestsArray, ...interest])];

        const interestsString = updatedInterests.join(',');

        // Update the interests in the database for the user
        await updateInterests(username, interestsString);

        return h.response({
            status: 'success',
            message: 'Interests added successfully',
        }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({
            status: 'fail',
            message: 'An error occurred while adding interests',
        }).code(500);
    }
};

// Function to fetch existing interests by username
const getInterestsByUsername = (username) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT interest FROM users WHERE username = ?', [username], (error, results) => {
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

// Function to update interests by username
const updateInterests = (username, interest) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE users SET interest = ? WHERE username = ?', [interest, username], (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
};
module.exports = interest;