const dotenv = require('dotenv')
const qs = require('querystring')
dotenv.config()
const http = require('http')
const morgan = require('morgan')
const express = require('express')
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
app.set('port', process.env.PORT || 3000);
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

// app.use((req, res, next) => {
//     console.log()
//     console.log('[Current Session ID]:', req.session.id)
//     let currTime = new Date();
//     let timeStamp = currTime.getHours() + ':' + currTime.getMinutes();
//     console.log('[HTTP CALL]:', timeStamp)
//     // console.log('req.cookies', req.cookies)
//     console.log('[Cookie]:', req.headers.cookie)
//     next()
// })
// app.use('/user', require('./routes/user')(io));

app.use('/activities/:channelId', (req, res) => {
    req.params.channelId = qs.unescape(req.params.channelId)
    req.query.publishedAfter = req.query.publishedAfter || null
    req.query.publishedBefore = req.query.publishedBefore || null
    req.query.maxResults = req.query.maxResults || null
    req.query.pageToken = req.query.pageToken || null

    const url = process.env.base_url + '/activities?part=snippet,contentDetails' +
        `&channelId=${req.params.channelId}` +
        (req.query.maxResults ? `&maxResults=${req.query.maxResults}` : '') +
        (req.query.pageToken ? `&pageToken=${req.query.pageToken}` : '') +
        (req.query.publishedAfter ? `&publishedAfter=${new Date(req.query.publishedAfter).toISOString()}` : '') +
        (req.query.publishedBefore ? `&publishedBefore=${new Date(req.query.publishedBefore).toISOString()}` : '') +
        `&key=${process.env.key}`

    console.log(url)

    request({
        url,
        method: 'GET'
    }, (err, response, body) => {

        // console.log('response', response)
        console.log('Status', response.statusCode);
        body = JSON.parse(body)
        console.log('prevPageToken', body.prevPageToken)
        console.log('nextPageToken', body.nextPageToken)

        // console.log('Headers', JSON.stringify(response.headers));
        // console.log('body', body)

        // let ret = body.items.map(item => {
        //     // return {
        //     //     // snippet: item.snippet,
        //     //     contentDetails: item.contentDetails,
        //     // }
        //     return item.contentDetails
        // })
        let ret = body.items.map(item => item.contentDetails)
        console.log(ret)

        if (err) return res.status(500).json(err)
        if (response.statusCode !== 200) return res.status(response.statusCode).json(null)

        // console.log(`[lRouter]: Now handling items found by q: ${req.params.q}...`)
        // console.log()

        res.status(200).json(ret)
    })
})

app.use('/:q/:type', (req, res) => {
    req.params.q = qs.unescape(req.params.q)
    req.params.type = qs.unescape(req.params.type)
    req.query.maxResults = req.query.maxResults || null
    req.query.pageToken = req.query.pageToken || null

    const url = process.env.base_url +
        '/search?part=snippet' +
        `&q=${req.params.q}` +
        `&type=${req.params.type}` +
        (req.query.maxResults ? `&maxResults=${req.query.maxResults}` : '') +
        (req.query.pageToken ? `&pageToken=${req.query.pageToken}` : '') +
        `&key=${process.env.key}`

    // console.log(url)

    request({
        url,
        method: 'GET'
    }, (err, response, body) => {

        // console.log('response', response)
        console.log('Status', response.statusCode);
        body = JSON.parse(body)
        console.log('prevPageToken', body.prevPageToken)
        console.log('nextPageToken', body.nextPageToken)
        // console.log('Headers', JSON.stringify(response.headers));
        // console.log('body', body)

        let ret = body.items.map(item => {
            return {
                channelTitle: item.snippet.channelTitle,
                description: item.snippet.description,
                channelId: item.snippet.channelId,
            }
        })
        console.log(ret)

        if (err) return res.status(500).json(err)
        if (response.statusCode !== 200) return res.status(response.statusCode).json(null)

        console.log(`[lRouter]: Now handling items found by q: ${req.params.q}...`)
        console.log()

        res.status(200).json(ret)
    })
})

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


// GET https://youtube.googleapis.com/youtube/v3/channels?mySubscribers=true&key=[YOUR_API_KEY] HTTP/1.1
