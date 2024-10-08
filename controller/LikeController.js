const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes'); 

const addLike = (req, res) => {

    const { id } = req.params;
    const { user_id } = req.body;
    
    let sql = `INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)`;
    const values = [ user_id, id ];
    conn.query(sql, values,
        (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
        }

        return res.status(StatusCodes.OK).json(results);

    })

}

const cancelLike = (req, res) => {
    res.json({ message : "좋아요 취소"})
}

module.exports = {
    addLike,
    cancelLike
};