const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username
  const password = req.body.password
  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred." });
    } else {
      return res.status(404).json({ message: "User already existsssss!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.send(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const id = req.params.isbn
  return res.send(books[id])
});

// Get book details based on author
function findBooksByAuthor(authorName) {
  const matchingBooks = [];
  for (const bookId in books) {
    const book = books[bookId];
    if (book.author === authorName) {
      matchingBooks.push(book);
    }
  }
  return matchingBooks;
}
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author
  const austenBooks = findBooksByAuthor(author);
  return res.send(austenBooks)
});

// Get all books based on title
function findBooksByTitle(title) {
  const matchingBooks = [];
  for (const bookId in books) {
    const book = books[bookId];
    if (book.title === title) {
      matchingBooks.push(book);
    }
  }
  return matchingBooks;
}
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title
  const austenBooks = findBooksByTitle(title);
  return res.send(austenBooks)
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const id = req.params.isbn
  return res.send(books[id].reviews)
});


// Task 10
public_users.get('/api/', async function getlistBook(req, res) {
  let respone = await axios.get('http://localhost:5000/')
  return res.send(respone.data)
})

//Task 11
public_users.get('/api/isbn/:isbn', async function getlistBook(req, res) {
  let isbn = req.params.isbn
  let respone = await axios.get(`http://localhost:5000/isbn/${isbn}`)
  return res.send(respone.data)
})

//Task 12
public_users.get('/api/author/:author', async function getlistBook(req, res) {
  let author = req.params.author
  let respone = await axios.get(`http://localhost:5000/author/${author}`)
  return res.send(respone.data)
})

//Task 13
public_users.get('/api/title/:title', async function getlistBook(req, res) {
  let title = req.params.title
  let respone = await axios.get(`http://localhost:5000/title/${title}`)
  return res.send(respone.data)
})




module.exports.general = public_users;
