const db = require('../config/db');

const getInterestsById = async (request, h) => {
    try {
        const { id } = request.params;
        const sql = `
          SELECT id, genre, imageURL
          FROM interests
          WHERE id = ?
        `;
        const result = await query(sql, [id]);
        if (result.length > 0) {
          return {
            success: true,
            data: {
                list: {
                    id: result[0].id,
                    name: result[0].genre,
                    imageUrl: result[0].imageURL,
                }
            },
          };
        } else {
          return {
            success: false,
            error: 'Interest tidak ditemukan',
            errorCode: 404,
          };
        }
      } catch (error) {
        console.error('Terjadi kesalahan saat mengambil daftar interest: ', error);
        return {
          success: false,
          error: 'Terjadi kesalahan',
          errorCode: 500,
        };
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

module.exports =getInterestsById;