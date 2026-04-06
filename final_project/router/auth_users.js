const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
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
  
  return res.status(200).json({ message: "Successfully registered user",
                                token: accessToken })
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
