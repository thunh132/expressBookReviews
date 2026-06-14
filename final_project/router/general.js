const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({
      message: "Unable to register user."
    });
  }

  if (isValid(username)) {
    return res.status(404).json({
      message: "User already exists!"
    });
  }

  users.push({
    username,
    password
  });

  return res.status(200).json({
    message: "User successfully registered. Now you can login"
  });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  let filteredBooks = Object.keys(books)
    .filter(key => books[key].author === author)
    .reduce((obj, key) => {
      obj[key] = books[key];
      return obj;
    }, {});

  return res.status(200).json(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  let filteredBooks = Object.keys(books)
    .filter(key => books[key].title === title)
    .reduce((obj, key) => {
      obj[key] = books[key];
      return obj;
    }, {});

  return res.status(200).json(filteredBooks);
});

// Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});
public_users.get('/async/books', async function (req, res) {
    try {
      const response = await axios.get('http://localhost:5000/');
      return res.status(200).json(response.data);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });
  public_users.get('/async/isbn/:isbn', async function (req, res) {
    try {
      const response = await axios.get(
        `http://localhost:5000/isbn/${req.params.isbn}`
      );
      return res.status(200).json(response.data);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });
  public_users.get('/async/author/:author', async function (req, res) {
    try {
      const response = await axios.get(
        `http://localhost:5000/author/${req.params.author}`
      );
      return res.status(200).json(response.data);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });
  public_users.get('/async/title/:title', async function (req, res) {
    try {
      const response = await axios.get(
        `http://localhost:5000/title/${req.params.title}`
      );
      return res.status(200).json(response.data);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });
module.exports.general = public_users;