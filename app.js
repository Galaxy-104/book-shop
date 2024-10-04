// express 모듈
const express = require('express');
const app = express();

// dotenv 모듈
const dotenv = require('dotenv');
dotenv.config();

// 유의미한 포트 번호 지정
app.listen(process.env.PORT);
