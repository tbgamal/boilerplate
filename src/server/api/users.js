const express = require('express')
const usersRouter = express.Router();
const { 
  createUser,
  getUser,
  getUserByEmail,
  getUserById
} = require ('../db')
const jwt = require ('jsonwebtoken')

usersRouter.post ('/login', async (req,res,next) => {
  const { email, password } = req.body;
  if(!email || !password) {
    next ({
      name: 'MissingCredentialsError',
      message: 'Please provide both an email and password'
    });
  }
  try {
    const user = await getUser({email, password});
    if (user) {
      const token = jwt.sign ({
        id: user.id,
        email
      }, process.env.JWT_SECRET, {
        expiresIn: '1w'
      });

      res.send ({
        message: 'Login successful!',
        token
      });
    }
    else {
      next({
        name: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect'
      })
    }
  } catch (err) {
    next(err)
  }
})