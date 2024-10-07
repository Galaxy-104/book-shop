const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes'); 
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // 암호화 모듈
const dotenv = require('dotenv');

dotenv.config();

const join = (req, res) => {
    const { email, password } = req.body;
    
    // 비밀번호 암호화
    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');
    
    console.log(hashPassword);
    
    // 회원가입 시 비밀번호를 암호화해서 암호화된 비밀번호와 salt 값을 같이 저장
    let values = [ email, hashPassword, salt];
    let sql = 'INSERT INTO users (email, password, salt) VALUES (?, ?, ?)';
    
// 로그인 시 받은 이메일&비밀번호 -> salt값 꺼내서 비밀번호 암호화 해보고 -> 디비 비밀번호랑 비교
    conn.query(sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
            }

            return res.status(StatusCodes.CREATED).json(results);
        }
    )
};

const login = (req, res) => {
    const { email, password } = req.body;

    let sql = 'SELECT * FROM users WHERE = ?';
    conn.query(sql, email,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
            }

            const loginUser = results[0];

            if (loginUser && loginUser.password == password) {
                // 토큰 발행
                const token = jwt.sign({
                    email : loginUser.email
                }, process.env.PRIVATE_KEY, {
                    expiresIn : '30m',
                    inssuer : 'J'
                })

                // 토큰 쿠키에 담기
                res.cookie("token", token, {
                    httpOnly : true,

                });
                console.log(token);

                return res.status(StatusCodes.OK).json(results);
            } else {
                // 401 : Unauthorized (미인증)
                // 403 : Forbidden (접근 권리 없음)
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }

            
        }
    )    
};

const passwordResetRequest = (req, res) => {
    const { email } = req.body;

    let sql = 'SELECT * FROM users WHERE = ?';
    conn.query(sql, email,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
            }

            // 이메일로 유저가 있는지 찾기
            const user = results[0];
            if (user) {
                return res.status(StatusCodes.OK).json({
                    email
                });
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
        }
    )
};

const passwordReset = (req, res) => {
    const { email, password } = req.body;

    let sql = `UPDATE users SET password = ? WHERE email = ?`;
    let values = [ password, email ];
    conn.query(sql, values, 
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if (results.affectedRows == 0) {
                return res.status(StatusCodes.BAD_REQUEST).end();
            } else {
                return res.status(StatusCodes.OK).json(results);
            }
        }
    )

};

module.exports = {
    join,
    login,
    passwordResetRequest,
    passwordReset
};