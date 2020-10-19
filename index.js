if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const axios = require('axios');

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.get('/submit', (req, res) => {
  res.render('index');
});

app.post('/submit', async (req, res) => {
    // console.log(req.body['g-recaptcha-response']);
    if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
      return res.render('index', { error: 'Please select the recaptcha' });
    }

    // Verify the response
    const GOOGLE_RECAPTCHA_SECRET = process.env.GOOGLE_RECAPTCHA_SECRET;
    const URL =  `https://www.google.com/recaptcha/api/siteverify?secret=${GOOGLE_RECAPTCHA_SECRET}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`;
    // axios.get(URL, )
    try {
      let response = await axios.get(URL);
      if (response.status !== 200) {
        return res.render('index', { error: 'Go away you bot' })
      }
      res.send('Welcome to my site');
    } catch (err) {
      console.log(err);
    }

});

app.get("*", (req, res) => res.redirect('/submit'));

app.listen(port, console.log(`Server started at port ${port}`));
