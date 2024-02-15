const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let findBookByKey = require("./auth_users.js").findBookByKey;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Get book details
public_users.get('/', async function (req, res) {
    await axios.get('/')
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  });
  
  // Get book details based on ISBN
  public_users.get('/isbn/:isbn', async function (req, res) {
    try {
      const response = await axios.get(`isbn/${req.params.isbn}`);
      res.send(response.data);
    } catch (error) {
      console.error(error);
    }
  });
  
  // Get book details based on author
  public_users.get('/author/:author',async function (req, res) {
    await axios.get(`author/${req.params.author}`)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  });
  
  // Get all books based on title
  public_users.get('/title/:title', async function (req, res) {
    try {
      const response = await axios.get(`title/${req.params.title}`);
      res.send(response.data);
    } catch (error) {
      console.error(error);
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const results = findBookByKey("isbn", isbn);

  if (!results) {
    res.status(404).json({message: `Book with the isbn  ${isbn} was not found.`});
  }
  res.send(results.reviews);
});

module.exports.general = public_users;
