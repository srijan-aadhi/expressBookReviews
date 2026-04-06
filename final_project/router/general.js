const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const BASE_URL = "https://srijanaad19-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/"
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "username and password must be provided"})
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "username already exists" })
  } 

  users.push({ username: username, password: password });
  return res.status(200).json({ message: "Successfully created user" })


});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  try {
    const fetchBooks = () => new Promise((resolve) => setTimeout(resolve(books), 1000))
    const allBooks = await fetchBooks();
    
    return res.send(JSON.stringify(allBooks));
  } catch (err) {
    res.status(500).json({ message: "Error fetching books" })
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  try {
    const fetchBook = () => new Promise((resolve) => setTimeout(resolve(books[isbn]), 1000));
    const book = await fetchBook();
    return res.status(200).send(JSON.stringify(book));
  } catch (err) {
    return res.status(400).json({ message: "Error returning book" })
  }
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const book = Object.entries(books).find(([_, val]) => val.author === author);
  
  if (!book) {
    return res.status(404).json({ message: "no book found" })
  } else {
    return res.status(200).send(JSON.stringify(book));
  } 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const book = Object.entries(books).find(([_, val]) => val.title === title);
  
  if (!book) {
    return res.status(404).json({ message: "no book found" })
  } else {
    return res.status(200).send(JSON.stringify(book));
  } 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(400).json({ message: "invalid book isbn" })
  }

  const reviews = book["reviews"];

  if (!reviews || Object.keys(reviews).length === 0) {
    return res.status(400).json({ message: "no reviews found for book" })
  } 

  return res.status(200).json(reviews);
  
});

module.exports.general = public_users;
