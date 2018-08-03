require('dotenv').config()

const express = require('express')
const cors = require('cors')
const Twit = require('twit')

const app = express()

app.use(cors())

const PORT = 3000

app.listen(PORT, () => {
  console.log(`App is running on port: ${PORT}`)
})

const T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  app_only_auth: true
})

app.get('/', (req, res) => {
  res.send('SCD Guest Twitter Photos')
})

app.get('/lookup', (req, res) => {
  if (!req.query.screen_name) {
    res.status(500)
    res.json({
      error: 'Gotta have some screen_names in a query param to lookup!'
    })
    return
  }

  T.get(
    'users/lookup',
    { screen_name: req.query.screen_name.split(',') },
    (err, data, response) => {
      const slimData = data.map(({ profile_image_url_https, screen_name }) => ({
        profile_image_url_https,
        screen_name
      }))

      res.json(slimData)
    }
  )
})
