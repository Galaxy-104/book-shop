const express = require('express');
const router = expressRouter();
const {
    addLike,
    cancelLike
    } = require('../controller/LikeController');

router.use(express.json());

// 좋아요 추가
router.post('/:id', addLike);

// 좋아요 취소
router.delete('/:id', cancelLike);

module.exports = router;