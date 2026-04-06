const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    const user = users.find(u => u.username === username);
    if (!user) {
        return false;
    }

    return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  //invalidate if username or password is missing
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  let user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(404).json({ message: "No user matches found" })
  }

  const accessToken = jwt.sign({ username: user.username }, 'fingerprint_customer', { expiresIn: 60 * 60 })
  req.session.authorization = { accessToken: accessToken }
  
  return res.status(200).json({ message: "Successfully logged in",
                                token: accessToken })
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  const { username, review } = req.body;

  if (!username || !review) {
    return res.status(400).json({ message: "username and review must be provided" });
  }

  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(400).json({ message: "book is not found" });
  }

  const reviews = book["reviews"]

  //find if this user has already inserted a review
  const user = reviews[username]
  if (user) {
    //edit the review: PUT
    user.review = review;
    return res.status(200).json({ message: "Review successfully edited" })
  }

  //add a new entry
  reviews[username] = { review: user.review };
  return res.status(200).json({ message: "Review successfully created"});
  
});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { username, review } = req.body;

  if (!username || !review) {
    return res.status(400).json({ message: "username and review must be provided" });
  }

  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(400).json({ message: "book is not found" });
  }

  const reviews = book["reviews"];

  //find if this user has already inserted a review
  delete reviews[username];

  return res.send(200).json({ message: "Review deleted" });


});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
