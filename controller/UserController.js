const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes'); 
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const join = (req, res) => {
    const { email, password } = req.body;

    let sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    let values = [ email, password ];

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