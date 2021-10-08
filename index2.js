const dotenv = require('dotenv')
const qs = require('querystring')
dotenv.config()
const http = require('http')
const morgan = require('morgan')
const express = require('express')
const aligoapi = require('aligoapi')
const request = require('request')
// const session = require('express-session');
// const cookieParser = require('cookie-parser')
// const passport = require('passport');
// const passportConfig = require('./config/passportConfig');
// const webSettings = require('./config/webSettings')
// const errorHandler = require('./utils/errorHandler')
// const cors = require('cors');
const app = express();
app.use(morgan('short'))
app.use(express.json())

// app.use(webSettings.sessionRedisMiddleware)
// app.use(session(webSettings.sessionRedisSettings))
// app.use(cookieParser()) // cookieParser adds cookies to req.
// important: this [cors] must come before Router
// app.use(passport.initialize());
// app.use(passport.session());
// cors called after session and passport
// app.use(cors(webSettings.corsSettings));
// passportConfig()

const server = http.createServer(app);

const AuthData = {
    key: 'vz4a8jukxlwpixepllch16mhjc2je7xf',
    // 이곳에 발급받으신 api key를 입력하세요
    user_id: 'gameberry',
    // 이곳에 userid를 입력하세요
}
// 인증용 데이터는 모든 API 호출시 필수값입니다.

// AuthData.testmode_yn = 'Y'
// test 모드를 사용하시려면 'Y'값으로 설정하세요

// form데이터를 포함한 request를 모두 보내시고 JSON data는 body parse를 사용하시기 바랍니다.

// console.log(45, aligoapi)

app.use(express.json())
// app.use(session(webSettings.sessionSettings))
app.set('port', process.env.PORT || 3008);
// app.use(cors(webSettings.corsSettings))
// app.options('/login', cors(webSettings.corsSettings))
// app.options('/isAuthenticated', cors(webSettings.corsSettings))

app.use((req, res, next) => {
    // console.log('current sessionID', req.session.id)
    console.log('Server Call Time: ', Date.now())
    next()
})

const send = (req, res) => {
    console.log(59, 'send')
    // 메시지 발송하기

    // req.body = {
    /*** 필수값입니다 ***/
    //   sender: 발신자 전화번호  // (최대 16bytes)
    //   receiver: 수신자 전화번호 // 컴마()분기 입력으로 최대 1천명
    //   msg: 메시지 내용	// (1~2,000Byte)
    /*** 필수값입니다 ***/
    //   msg_type: SMS(단문), LMS(장문), MMS(그림문자)
    //   title: 문자제목(LMS, MMS만 허용) // (1~44Byte)
    //   destination: %고객명% 치환용 입력
    //   rdate: 예약일(현재일이상) // YYYYMMDD
    //   rtime: 예약시간-현재시간기준 10분이후 // HHMM
    //   image: 첨부이미지 // JPEG, PNG, GIF
    // }
    // req.body 요청값 예시입니다.

    console.log(40, req.body)
    console.log(41, AuthData)

    aligoapi.send(req, AuthData)
        .then(r => {
            console.log(84, r)
            res.send(r)
        })
        .catch(e => {
            console.log(87, e)
            res.send(e)
        })
}

const middle1 = (req, res, next) => {
    console.log(92, 'middle1')
    // console.log(95, req)
    const obj = {}
    obj.body = {
        sender: '---',
        receiver: '01056416786',
        msg: 'test aligo',
        'content-type': 'application/json',
    }
    // next(obj, res)

    req.body = {
        sender: '---',
        receiver: '01056416786',
        msg: 'test aligo',
        'content-type': 'application/json',
    }
    next()

}
app.use('/aligo', middle1, send)

// 404
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.reason = 'noPage'
    err.status = 404;
    next(err);
});
// error handler
app.use(function (err, req, res, next) {
    console.log('reached the end...404 or 500')
    console.log('check cors, path, method...etc')
    console.log(err)
    console.log()
    // res.json(errorHandler(err))
    res.status(err.status).json(err)
});

server.listen(app.get('port'), () => {
    console.log('http://localhost:%d', app.get('port'));
});
