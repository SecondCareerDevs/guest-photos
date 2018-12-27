require('dotenv').config()

const express = require('express')
const cors = require('cors')
const Twit = require('twit')

const app = express()

app.use(cors())

const PORT = 3000

const T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  app_only_auth: true
})

app.get('/', (req, res) => {
  res.send('SCD Guest Twitter Photos')
  res.end()
})

app.get('/lookup', (req, res) => {
  if (!req.query.screen_name) {
    res.status(500)
    res.json({
      error: 'Gotta have some screen_names in a query param to lookup!'
    })
    res.end()
  }

  T.get(
    'users/lookup',
    { screen_name: req.query.screen_name.split(',') },
    (err, data, response) => {
      if (err) {
        throw new Error(err)
      }

      const slimData = data.map(({ profile_image_url_https, screen_name }) => ({
        profile_image_url_https,
        screen_name
      }))

      res.json(slimData)
      res.end()
    }
  )
})

app.get('/show', (req, res) => {
  if (!req.query.screen_name) {
    res.status(500)
    res.json({
      error:
        'Gotta have a screen_name in a query param to look up the user data!'
    })
    res.end()
  }

  T.get(
    'users/show',
    { screen_name: req.query.screen_name },
    (err, data, response) => {
      if (err) {
        throw new Error(err)
      }

      res.json(data)
      res.end()
    }
  )
})

app.listen(PORT, () => {
  console.log(`App is running on port: ${PORT}`)
})
