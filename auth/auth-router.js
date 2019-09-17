// deps needed
const router = require('express').Router();
const bcrypt = require('bcryptjs');

// files needed
const Users = require('../users/users-model.js');

// register (found at /api/auth)
router.post('/register', (req, res) =>{
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
})

  router.post("/login", (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compare(password, user.password)) {
        req.session.username = user.username;
        req.session.loggedIn = true;
        res.status(200).json({ message: "Logged in." });
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ message: "There was an error logging in." });
    });
});
  
  router.get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.status(200).json({ bye: 'felicia' });
    });
  });
  
  module.exports = router;