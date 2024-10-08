const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allBooks = (req, res) => {
    const { categoty_id } = req.query;

    if (categoty_id) {
        // 카테고리별 도서 조회
        let sql = `SELECT * FROM books WHERE category_id = ?`;
        conn.query(sql, categoty_id, 
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
    } else {
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
    }

    
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

module.exports = {
    allBooks,
    bookDetail
}