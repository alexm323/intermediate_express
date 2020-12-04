/** Routes for demonstrating authentication in Express. */

const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require('../config');
const { ensureLoggedIn, ensureAdmin } = require('../middleware/auth')

router.get('/', (req, res, next) => {
  res.send("APP IS WORKING!!!")
})

router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      throw new ExpressError("Username and Password required", 400)
    }
    // hash password 
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR)
    // save to db
    results = await db.query(`INSERT INTO users (username,password) VALUES ($1,$2) RETURNING username`, [username, hashedPassword]);

    return res.json(results.rows[0])


  } catch (e) {
    if (e.code === '23505') {
      return next(new ExpressError("Username taken. Please pick another!", 400))
    }
    // console.log(e)
    return next(e)
  }
})


router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      throw new ExpressError("Username and Password required", 400)
    }
    const results = await db.query(`SELECT username,password FROM users WHERE username =$1`, [username])
    const user = results.rows[0]
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        // so with sign we set our payload as the first variable, in this case we only have a username table to keep track of, and secondly we will use our Secret_key which we set in our config file
        const token = jwt.sign({ username, type: 'admin' }, SECRET_KEY)
        // now that we are creating our token we can also respond with it 
        res.json({ message: `Logged In`, token })
      }
    }
    throw new ExpressError("Invalid username/password not found", 400)

  } catch (e) {

    return next(e)
  }
})

router.get('/topsecret', ensureLoggedIn, (req, res, next) => {
  try {
    // note that there is no real standard way to use jwt and different sites will use different ways of using this
    // the way we send them and what we call it etc is not standardized 
    // in this case we will be expecting _token in our request body
    // const token = req.body._token;
    // const data = jwt.verify(token, SECRET_KEY)
    return res.json({ message: 'Signed in! This is top secret. I like purple' })
  } catch (e) {
    return next(new ExpressError("Please login first", 401))
  }
})

router.get('/private', ensureLoggedIn, (req, res, next) => {
  return res.json({ msg: `Welcome to my VIP section, ${req.user.username}` })
})
router.get('/adminHome', ensureAdmin, (req, res, next) => {
  return res.json({ msg: `Admin Dashboard! Welcome!, ${req.user.username}` })
})
module.exports = router;

