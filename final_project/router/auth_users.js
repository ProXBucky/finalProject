const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const _ = require('lodash');

let users = [];



const isValid = (username) => { //returns boolean
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username
  const password = req.body.password
  if (!username || !password) {
    return res.status(404).json({ message: "Username or Password is missing" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("Logged in");
  } else {
    return res.status(208).json({ message: "Wrong username or password. Check username and password" });
  }
});

// Add a book review

function addOrEditReview(bookId, reviewerName, reviewText) {
  let obj = {
    reviewerName: reviewText,
  }
  // _.set(books[bookId], `reviews`, { obj });
  books[bookId][`reviews`] = obj

}

regd_users.post("/auth/review/:isbn", (req, res) => {
  const id = req.params.isbn
  const reviewText = req.body.reviewText
  const authorization = req.session.authorization;
  if (authorization) {
    const username = authorization.username;
    addOrEditReview(books[id], username, reviewText)
    return res.status(200).json({ message: "Review success" })
  } else {
    return res.status(404).json({ message: "User is not log in" })
  }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
