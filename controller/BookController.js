const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allBooks = (req, res) => {
    const { categoty_id, new_books } = req.query;

    let sql = `SELECT * FROM books`;
    let values = [];

    if (categoty_id && new_books) {
        sql += ' AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
        values = [ categoty_id, new_books ];
    } else if (categoty_id) {
        sql += ` WHERE category_id = ?`;
        values = [ categoty_id ];
    } else if (new_books) {
        sql += ' WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
        values = [ new_books ];
    }

    conn.query(sql, values, 
        (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
        }

        if (results.length) {
            return res.status(StatusCodes.OK).json(results);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
            
    })

};

const bookDetail = (req, res) => {
    const { id } = req.params;

    let sql = `SELECT * FROM books LEFT JOIN category ON books.category_id = category.id WHERE books.id = ?`;
    conn.query(sql, id, 
        (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
        }

        if (results[0]) {
            return res.status(StatusCodes.OK).json(results[0]);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
            
    })
};

module.exports = {
    allBooks,
    bookDetail
}