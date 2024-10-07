const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allBooks = (req, res) => {
    // 전체 도서 리스트
    let sql = `SELECT * FROM books`;
    conn.query(sql, 
        (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
        }

        return res.status(StatusCodes.OK).json(results);
    })
};

const bookDetail = (req, res) => {
    const { id } = req.params;

    let sql = `SELECT * FROM books WHERE id = ?`;
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

const booksByCategory = (req, res) => {
    res.json({ message : "카테고리별 도서 목록 조회"})
};

module.exports = {
    allBooks,
    bookDetail,
    booksByCategory
}