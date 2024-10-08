const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes'); 

const addLike = (req, res) => {
    res.json({ message : "좋아요 추가"})
}

const cancelLike = (req, res) => {
    res.json({ message : "좋아요 취소"})
}

module.exports = {
    addLike,
    cancelLike
};