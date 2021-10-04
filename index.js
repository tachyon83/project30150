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
        // let ret = body.items.map(item => item.contentDetails)
        let ret = body.items.map(item => {
            return {
                title: item.snippet.title,
                description: item.snippet.description,
                type: item.snippet.type,
                videoId: item.contentDetails,
            }
        })
        console.log(ret)

        if (err) return res.status(500).json(err)
        if (response.statusCode !== 200) return res.status(response.statusCode).json(null)

        // console.log(`[lRouter]: Now handling items found by q: ${req.params.q}...`)
        // console.log()

        res.status(200).json(ret)
    })
})

// about videos with topicDetails
app.use('/topicdetails/:id', (req, res) => {
    // req.query.maxResults = req.query.maxResults || null
    // req.query.pageToken = req.query.pageToken || null
    // // req.params.relatedToVideoId = qs.unescape(req.params.relatedToVideoId)
    // req.params.id = qs.unescape(req.params.id)

    // const url = process.env.base_url2 +
    const url = process.env.base_url +
        '/videos?' +
        `id=${req.params.id}` +
        '&part=snippet,contentDetails,statistics,status,topicDetails' +
        //     (req.query.maxResults ? `&maxResults=${req.query.maxResults}` : '') +
        //     (req.query.pageToken ? `&pageToken=${req.query.pageToken}` : '') +
        `&key=${process.env.key}`

    // url = `https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&part=snippet,topicDetails` + `&key=${process.env.key}`
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
        console.log('body', body)

        // let ret = body.items.map(item => {
        //     return {
        //         videoId: item.id.videoId,
        //         title: item.snippet.title,
        //         snippet: item.snippet,
        //         topicDetails: item.topicDetails,
        //     }
        //     // item.id.videoId
        // })
        let ret = body.items
        console.log(ret)

        if (err) return res.status(500).json(err)
        if (response.statusCode !== 200) return res.status(response.statusCode).json(null)

        // console.log(`[lRouter]: Now handling items found by q: ${req.params.q}...`)
        console.log()

        res.status(200).json(ret)
        // res.status(200).json(body)
    })
})

// about channels with topicDetails
app.use('/channels/topicdetails/:id', (req, res) => {
    // req.query.maxResults = req.query.maxResults || null
    // req.query.pageToken = req.query.pageToken || null
    // // req.params.relatedToVideoId = qs.unescape(req.params.relatedToVideoId)
    // req.params.id = qs.unescape(req.params.id)

    // const url = process.env.base_url2 +
    const url = process.env.base_url +
        '/channels?' +
        `id=${req.params.id}` +
        '&part=snippet,contentDetails,statistics,status,topicDetails' +
        //     (req.query.maxResults ? `&maxResults=${req.query.maxResults}` : '') +
        //     (req.query.pageToken ? `&pageToken=${req.query.pageToken}` : '') +
        `&key=${process.env.key}`

    // url = `https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&part=snippet,topicDetails` + `&key=${process.env.key}`
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
        console.log('body', body)

        let ret = body.items.map(item => {
            return {
                videoId: item.id.videoId,
                title: item.snippet.title,
                snippet: item.snippet,
                topicDetails: item.topicDetails,
            }
            // item.id.videoId
        })
        console.log(ret)

        if (err) return res.status(500).json(err)
        if (response.statusCode !== 200) return res.status(response.statusCode).json(null)

        // console.log(`[lRouter]: Now handling items found by q: ${req.params.q}...`)
        console.log()

        res.status(200).json(ret)
        // res.status(200).json(body)
    })
})

// topic-based
app.use('/topicbased', (req, res) => {
    // req.query.maxResults = req.query.maxResults || null
    // req.query.pageToken = req.query.pageToken || null
    // // req.params.relatedToVideoId = qs.unescape(req.params.relatedToVideoId)
    // req.params.id = qs.unescape(req.params.id)

    console.log(req.query.topicId)

    const url = process.env.base_url +
        '/search?part=snippet' +
        `&topicId=${req.query.topicId}` +
        `&type=channel` +
        //     (req.query.maxResults ? `&maxResults=${req.query.maxResults}` : '') +
        //     (req.query.pageToken ? `&pageToken=${req.query.pageToken}` : '') +
        `&key=${process.env.key}`

    // url = `https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&part=snippet,topicDetails` + `&key=${process.env.key}`
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
        console.log('body', body)

        // let ret = body.items.map(item => {
        //     return {
        //         videoId: item.id.videoId,
        //         title: item.snippet.title,
        //         snippet: item.snippet,
        //         topicDetails: item.topicDetails,
        //     }
        //     // item.id.videoId
        // })
        let ret = body.items
        console.log(ret)

        if (err) return res.status(500).json(err)
        if (response.statusCode !== 200) return res.status(response.statusCode).json(null)

        // console.log(`[lRouter]: Now handling items found by q: ${req.params.q}...`)
        console.log()

        res.status(200).json(ret)
        // res.status(200).json(body)
    })
})

// videoCategories
app.use('/videocategories', (req, res) => {
    // req.query.maxResults = req.query.maxResults || null
    // req.query.pageToken = req.query.pageToken || null
    // // req.params.relatedToVideoId = qs.unescape(req.params.relatedToVideoId)
    // req.params.id = qs.unescape(req.params.id)

    console.log(req.query.topicId)

    const url = process.env.base_url +
        '/videoCategories?part=snippet' +
        `&regionCode=KR` +
        //     (req.query.maxResults ? `&maxResults=${req.query.maxResults}` : '') +
        //     (req.query.pageToken ? `&pageToken=${req.query.pageToken}` : '') +
        `&key=${process.env.key}`

    // url = `https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&part=snippet,topicDetails` + `&key=${process.env.key}`
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
        console.log('body', body)

        // let ret = body.items.map(item => {
        //     return {
        //         videoId: item.id.videoId,
        //         title: item.snippet.title,
        //         snippet: item.snippet,
        //         topicDetails: item.topicDetails,
        //     }
        //     // item.id.videoId
        // })
        let ret = body.items
        console.log(ret)

        if (err) return res.status(500).json(err)
        if (response.statusCode !== 200) return res.status(response.statusCode).json(null)

        // console.log(`[lRouter]: Now handling items found by q: ${req.params.q}...`)
        console.log()

        res.status(200).json(ret)
        // res.status(200).json(body)
    })
})


let tagFinder = async videoId => {

    const url = process.env.base_url +
        `/videos?key=${process.env.key}` +
        `&fields=items(snippet(title,description,tags))` +
        `&part=snippet&id=${videoId}`

    // console.log('url in tagFinder', url)

    return new Promise((resolve, reject) => {
        request({
            url,
            method: 'GET'
        }, (err, response, body) => {

            if (err || response.statusCode !== 200) return reject(err)
            console.log('status in tagFinder', response.statusCode)
            // console.log('body in tagFinder', videoId, body)

            body = JSON.parse(body).items[0].snippet
            resolve({
                title: body.title,
                description: body.description,
                tags: body.tags || [],
            })
        })
    })
}

// categoryId=28
app.use('/categoryId/:categoryId', (req, res) => {
    // req.query.maxResults = req.query.maxResults || null
    // req.query.pageToken = req.query.pageToken || null
    // // req.params.relatedToVideoId = qs.unescape(req.params.relatedToVideoId)
    // req.params.id = qs.unescape(req.params.id)

    // console.log(req.query.topicId)

    const url = process.env.base_url +
        // '/videos?part=snippet' +
        '/videos?' +
        `&chart=mostPopular` +
        `&regionCode=KR` +
        `&videoCategoryId=${req.params.categoryId}` +
        (req.query.maxResults ? `&maxResults=${req.query.maxResults}` : '') +
        //     (req.query.pageToken ? `&pageToken=${req.query.pageToken}` : '') +
        `&key=${process.env.key}`

    // url = `https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&part=snippet,topicDetails` + `&key=${process.env.key}`
    console.log(url)

    request({
        url,
        method: 'GET'
    }, async (err, response, body) => {

        // console.log('response', response)
        console.log('Status', response.statusCode);
        body = JSON.parse(body)
        console.log('prevPageToken', body.prevPageToken)
        console.log('nextPageToken', body.nextPageToken)
        // console.log('Headers', JSON.stringify(response.headers));
        // console.log('body', body)

        // let ret = body.items.map(item => {
        //     return {
        //         videoId: item.id.videoId,
        //         title: item.snippet.title,
        //         snippet: item.snippet,
        //         topicDetails: item.topicDetails,
        //     }
        //     // item.id.videoId
        // })
        let ret = body.items
        // console.log(ret)

        if (err) return res.status(500).json(err)
        if (response.statusCode !== 200) return res.status(response.statusCode).json(null)

        // console.log(`[lRouter]: Now handling items found by q: ${req.params.q}...`)
        // console.log()

        let videos = [], descriptions = [], tag_analysis = {}
        // for (let obj of ret) {
        //     let temp = await tagFinder(obj.id)
        //     console.log(temp.length)
        //     // console.log('temp', obj.id, temp)
        //     temp.forEach(e => {
        //         if (!(e in tag_analysis)) tag_analysis[e] = 0
        //         tag_analysis[e]++
        //     })
        // }
        await Promise.all(ret.map(async obj => {
            let temp = await tagFinder(obj.id)
            console.log('temp', temp)
            videos.push(temp.title)
            descriptions.push(temp.description)
            // console.log('temp', obj.id, temp)
            console.log(temp.tags.length)
            temp.tags.forEach(e => {
                if (!(e in tag_analysis)) tag_analysis[e] = 0
                tag_analysis[e]++
            })
        }))
        res.status(200).json({
            videos,
            descriptions,
            tag_analysis,
        })
        // res.status(200).json(body)
    })
})

app.use('/related/:relatedToVideoId', (req, res) => {
    req.query.maxResults = req.query.maxResults || null
    req.query.pageToken = req.query.pageToken || null
    req.params.relatedToVideoId = qs.unescape(req.params.relatedToVideoId)

    const url = process.env.base_url +
        '/search?part=snippet' +
        `&relatedToVideoId=${req.params.relatedToVideoId}` +
        (req.query.maxResults ? `&maxResults=${req.query.maxResults}` : '') +
        (req.query.pageToken ? `&pageToken=${req.query.pageToken}` : '') +
        `&type=video` +
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
        console.log('body', body)

        let ret = body.items.map(item => {
            return {
                videoId: item.id.videoId,
                title: item.snippet.title,
            }
            // item.id.videoId
        })
        console.log(ret)

        if (err) return res.status(500).json(err)
        if (response.statusCode !== 200) return res.status(response.statusCode).json(null)

        console.log(`[lRouter]: Now handling items found by q: ${req.params.q}...`)
        console.log()

        res.status(200).json(ret)
        // res.status(200).json(body)
    })
})

app.use('/type/:q/:type', (req, res) => {
    console.log(req.params.q)
    req.params.q = qs.escape(req.params.q)
    req.params.type = qs.unescape(req.params.type)
    req.query.maxResults = req.query.maxResults || null
    req.query.pageToken = req.query.pageToken || null

    const url = process.env.base_url +
        // '/search?part=snippet' +
        '/search?' +
        `part=snippet` +
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

        if (err) return res.status(500).json(err)

        // console.log('response', response)
        console.log('Status', response.statusCode);
        body = JSON.parse(body)
        console.log('prevPageToken', body.prevPageToken)
        console.log('nextPageToken', body.nextPageToken)
        console.log('Headers', JSON.stringify(response.headers));
        console.log('body', body)
        if (body.error) console.log('body-err', body.error.errors)

        // let ret = body.items.map(item => {
        //     return {
        //         channelTitle: item.snippet.channelTitle,
        //         description: item.snippet.description,
        //         channelId: item.snippet.channelId,
        //     }
        // })
        let ret = body.items
        console.log(ret)


        if (response.statusCode !== 200) return res.status(response.statusCode).json(null)

        console.log(`[Router]: Now handling items found by q: ${req.params.q}...`)
        console.log()

        res.status(200).json(ret)
    })
})


app.use('/test1/:videoId', (req, res) => {

    const url = process.env.base_url +
        `/videos?key=${process.env.key}` +
        `&fields=items(snippet(title,description,tags))` +
        `&part=snippet&id=${req.params.videoId}`

    console.log('url:', url)

    request({
        url,
        method: 'GET'
    }, (err, response, body) => {

        if (err) return res.status(500).json(err)

        // console.log('response', response)
        console.log('response Status:', response.statusCode)
        body = JSON.parse(body)
        // console.log('prevPageToken', body.prevPageToken)
        // console.log('nextPageToken', body.nextPageToken)
        // console.log('Headers', JSON.stringify(response.headers));
        console.log('body', body)

        // let ret = body.items.map(item => {
        //     return {
        //         channelTitle: item.snippet.channelTitle,
        //         description: item.snippet.description,
        //         channelId: item.snippet.channelId,
        //     }
        // })
        // let ret = body.items
        // console.log(ret)


        if (response.statusCode !== 200) return res.status(response.statusCode).json(null)

        res.status(200).json(body)
    })
})


// videos about a particular subject
app.use('/particular/:subject', (req, res) => {

    if (req.params) for (let e of Object.keys(req.params)) req.params[e] = qs.unescape(req.params[e])
    req.query.maxResults = req.query.maxResults || null
    req.query.pageToken = req.query.pageToken || null

    // snippet,contentDetails,statistics,status,topicDetails

    const url = process.env.base_url +
        '/search?part=snippet' +
        // `&q=YouTube+Data+API` +
        `&q=${req.params.subject}` +
        `&type=video` +
        `&videoCaption=closedCaption` +
        // (req.query.maxResults ? `&maxResults=${req.query.maxResults}` : '') +
        // (req.query.pageToken ? `&pageToken=${req.query.pageToken}` : '') +
        `&key=${process.env.key}`

    console.log(url)

    request({
        url,
        method: 'GET'
    }, (err, response, body) => {

        if (err) return res.status(500).json(err)

        // console.log('response', response)
        console.log('Status', response.statusCode);
        body = JSON.parse(body)
        console.log('prevPageToken', body.prevPageToken)
        console.log('nextPageToken', body.nextPageToken)
        // console.log('Headers', JSON.stringify(response.headers));
        console.log('body', body)

        // let ret = body.items.map(item => {
        //     return {
        //         channelTitle: item.snippet.channelTitle,
        //         description: item.snippet.description,
        //         channelId: item.snippet.channelId,
        //     }
        // })
        let ret = body.items
        console.log(ret)


        if (response.statusCode !== 200) return res.status(response.statusCode).json(null)

        console.log(`[Router]: Now handling items found by a particular subject...`)
        console.log()

        res.status(200).json(ret)
    })
})

const channelTagFinder = async (channelId, maxResults) => {
    const url = process.env.base_url2 + `/search` +
        `?key=${process.env.key}` +
        `&channelId=${channelId}` +
        `&part=snippet,id` +
        `&order=date` +
        `&type=video` +
        // `&maxResults=${req.query.maxResults}`
        // `&maxResults=4`
        `&maxResults=${maxResults ? maxResults : 20}`

    let tagsForThisChannel = {}

    return new Promise((resolve, reject) => {
        request({
            url,
            method: 'GET'
        }, async (err, response, body) => {

            if (err || response.statusCode !== 200) return reject(err)

            body = JSON.parse(body)
            let videosWithTags = []
            await Promise.all(body.items.map(async video => {
                if (video.id.videoId) videosWithTags.push(await tagFinder(video.id.videoId))
            }))
            // console.log('videosWithTags', videosWithTags)
            videosWithTags.forEach(videoWithTags => {
                videoWithTags.tags.forEach(tag => {
                    if (!(tag in tagsForThisChannel)) tagsForThisChannel[tag] = 0
                    tagsForThisChannel[tag]++
                })
            })
            resolve(tagsForThisChannel)
        })
    })
}

// retrieve a channel's uploaded videos
app.use('/channel', (req, res) => {
    console.log('/channel')

    req.query.maxResults = req.query.maxResults ? req.query.maxResults : 100

    const url = process.env.base_url2 + `/search` +
        `?key=${process.env.key}` +
        `&channelId=${req.query.channelId}` +
        `&part=snippet,id` +
        `&order=date` +
        `&maxResults=${req.query.maxResults}`

    console.log(url)

    request({
        url,
        method: 'GET'
    }, (err, response, body) => {

        if (err) return res.status(500).json(err)
        console.log('Status', response.statusCode);
        body = JSON.parse(body)

        // let ret = body.items.map(item => {
        //     return {
        //         channelTitle: item.snippet.channelTitle,
        //         description: item.snippet.description,
        //         channelId: item.snippet.channelId,
        //     }
        // })
        let ret = body.items

        // await Promise.all(ret.map(async obj => {
        //     let temp = await tagFinder(obj.id)
        //     console.log('temp', temp)
        //     videos.push(temp.title)
        //     descriptions.push(temp.description)
        //     // console.log('temp', obj.id, temp)
        //     console.log(temp.tags.length)
        //     temp.tags.forEach(e => {
        //         if (!(e in tag_analysis)) tag_analysis[e] = 0
        //         tag_analysis[e]++
        //     })
        // }))

        console.log(ret)
        // console.log(ret.)


        if (response.statusCode !== 200) return res.status(response.statusCode).json(null)
        res.status(200).json(ret)
    })
})

// https://www.googleapis.com/youtube/v3/search?query=sketching&part=snippet&channelId=UC4GRKWUEhUvsCqD-yNQpxQw&maxResults=25&order=date&type=video&key=GOOGLE_KEY
// to retrieve any videos that have the given tag or the word used in the title or description.
// app.use('/channel/videos', (req, res) => {
//     console.log(Object.keys(req.query))

//     req.query.query = qs.escape(req.query.query)

//     const url = process.env.base_url2 + `/search` +
//         `?query=${req.query.query}` +
//         `&part=snippet` +
//         `&channelId=${req.query.channelId}` +
//         `&maxResults=${req.query.maxResults}` +
//         `&order=date` +
//         `&type=video` +
//         `&key=${process.env.key}`

//     console.log(url)

//     request({
//         url,
//         method: 'GET'
//     }, (err, response, body) => {

//         if (err) return res.status(500).json(err)

//         // console.log('response', response)
//         console.log('Status', response.statusCode);
//         body = JSON.parse(body)
//         console.log('prevPageToken', body.prevPageToken)
//         console.log('nextPageToken', body.nextPageToken)

//         let ret = body.items
//         console.log(ret)
//         // console.log(ret.)


//         if (response.statusCode !== 200) return res.status(response.statusCode).json(null)
//         res.status(200).json(ret)
//     })
// })

// steps:
// - escapse
// - url 
// - search
// - additional search
// - response

app.use('/stat', (req, res) => {
    // console.log('/stat')

    req.query.q = qs.escape(req.query.q)
    req.query.maxResults = req.query.maxResults || 20

    const url = process.env.base_url2 + `/search` +
        `?key=${process.env.key}` +
        `&part=snippet` +
        `&regionCode=KR` +
        `&relevanceLanguage=ko` +
        // `&channelId=${req.query.channelId}` +
        `&order=relevance` +
        // `&order=date` +
        // `&order=viewCount` +
        // `&relatedToVideoId=${req.query.relatedToVideoId}` +
        `&q=${req.query.q}` +
        `&type=channel` +
        // `&type=video` +
        // `&videoDuration=medium`
        // `&pageToken=${req.query.pageToken}` +
        `&maxResults=${req.query.maxResults}`
    // `&maxResults=100`
    // `&maxResults=5`

    request({
        url,
        method: 'GET'
    }, async (err, response, body) => {

        if (err) return res.status(500).json(err)
        // console.log('Status', response.statusCode);
        body = JSON.parse(body)
        if (response.statusCode !== 200) {
            console.error(body.error)
            return res.status(response.statusCode).json(body.error)
        }

        let ret

        try {
            ret = await Promise.all(body.items.map(async channel => {
                let temp = {}
                temp.channelId = channel.snippet.channelId
                temp.title = channel.snippet.title
                temp.description = channel.snippet.description
                temp.tags = await channelTagFinder(channel.snippet.channelId, req.query.howmanyVideos)
                return temp
            }))
        } catch (err) {
            console.error(err)
            return res.status(500).json(err)
        }
        res.status(200).json(ret)
    })
})

// videos filtered by keyword, channelId(optional)
// https://www.googleapis.com/youtube/v3/search
app.use('/videos', (req, res) => {
    console.log('entered /videos')

    req.query.maxResults = req.query.maxResults || null
    req.query.pageToken = req.query.pageToken || null
    req.query.q = qs.escape(req.query.q)

    // channelId (when given, set type=video), order=relevance, q (not,or), 
    // type, videoDuration

    const url = process.env.base_url2 + `/search` +
        `?key=${process.env.key}` +
        `&part=snippet` +
        `&regionCode=KR` +
        `&relevanceLanguage=ko` +
        // `&channelId=${req.query.channelId}` +
        // `&order=relevance` +
        // `&order=date` +
        // `&order=viewCount` +
        `&relatedToVideoId=${req.query.relatedToVideoId}` +
        // `&q=${req.query.q}` +
        // `&type=channel` +
        `&type=video` +
        // `&videoDuration=medium`
        // `&pageToken=${req.query.pageToken}` +
        `&maxResults=${req.query.maxResults}`

    // const url = process.env.base_url +
    //     // `youtube.channels.list` +
    //     '/channels' +
    //     // '?part=contentDetails' +
    //     '?part=snippet,contentDetails' +
    //     `&id=${req.query.id}` +
    //     // `&forUsername=${req.params.username}` +
    //     (req.query.maxResults ? `&maxResults=${req.query.maxResults}` : '') +
    //     // (req.query.pageToken ? `&pageToken=${req.query.pageToken}` : '') +
    //     `&key=${process.env.key}`

    console.log(url)

    request({
        url,
        method: 'GET'
    }, (err, response, body) => {

        if (err) return res.status(500).json(err)

        // console.log('response', response)
        console.log('Status', response.statusCode);
        body = JSON.parse(body)
        console.log('prevPageToken', body.prevPageToken)
        console.log('nextPageToken', body.nextPageToken)
        // console.log('Headers', JSON.stringify(response.headers));
        // console.log('body', body)

        // let ret = body.items.map(item => {
        //     return {
        //         channelTitle: item.snippet.channelTitle,
        //         description: item.snippet.description,
        //         channelId: item.snippet.channelId,
        //     }
        // })
        let ret = body.items
        console.log(ret)
        // console.log(ret.)


        if (response.statusCode !== 200) return res.status(response.statusCode).json(null)
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
