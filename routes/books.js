const express = require('express');
const router = expressRouter();
const { 
    allBooks, 
    bookDetail
} = require('../controller/BookController');

router.use(express.json());

// 도서 조회
router.get('/', allBooks);

// 개별 도서 조회
router.get('/:id', bookDetail);

module.exports = router;