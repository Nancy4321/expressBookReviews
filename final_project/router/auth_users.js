const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
        "username": "Alberta",
        "password": "oldman"
    }
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
          data: password
        }, 'access', { expiresIn: 60 * 60 });
    
        req.session.authorization = {
          accessToken,username
      }
      return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
    let book = findBookByKey("isbn", isbn)
    if (book) { //Check is book exists
        let author = req.body.author;
        let title = req.body.title;
        let reviews = req.body.reviews;

        if(author) {
            book["author"] = author
        }

        if(title) {
            book["title"] = title
        }

        if(reviews) {
            book["reviews"] = reviews
        }
        
        books[isbn]=book;
        res.send(`Book with the isbn  ${isbn} updated.`);
    }
    else{
        res.send("Unable to find book!");
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = findBookByKey("isbn", isbn)
    if (book){
        delete book
    }
    res.send(`Book with the isbn  ${isbn} deleted.`);
  });


const findBookByKey = (name, value) => {
    for (let key in books) {
        if (books[key][name] == value) {
            return books[key];
        }
        console.log('key', key);
        console.log('value', value);
        console.log('books[key][name]', books[key][name]);
    }
    return null;
};

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.findBookByKey = findBookByKey;
