var express = require("express");
const mongoose = require("mongoose");
const authenticate = require('../middlewares/authenticate.js');
const Book = require('../models/Books'); // Add the missing import statement for the Service model
const Users = require('../models/User'); // Add the missing import statement for the Service model
var router = express.Router();


router.use(authenticate);

 // POST route to get author details and their books
 router.post('/getAuthorWithBooks', async (req, res) => {
  try {
    const { author_id } = req.body;

    // Validate the author exists
    const author = await Users.findById(author_id, 'firstName lastName email phone -_id');
    if (!author) {
      return res.status(404).json({ msg: 'Author not found' });
    }

    // Find all books by this author and populate the author details
    const books = await Book.find({ author_id }).populate('author_id', 'firstName lastName email phone -_id');

    res.status(200).json({ author, books });
  } catch (error) {
    console.error('Error fetching author details and books:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});
// POST route to add a new book
router.post('/newbook', async (req, res) => {
  try {
    const { author_id, category, title, description, price } = req.body;

    // Validate the author exists
    const author = await Users.findById(author_id);
    if (!author) {
      return res.status(400).json({ error: 'Invalid author ID' });
    }

    // Create a new book
    const book = new Book({
      author_id,
      category,
      title,
      description,
      price,
    });

    // Save the book to the database
    await book.save();

    res.status(201).json({ msg: 'Book created successfully', book });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

router.delete('/deletebook/:book_id', async (req, res) => {
  try {
    const { book_id } = req.params;

    // Validate if the book exists
    const book = await Book.findOneAndDelete({ _id: book_id });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json({ msg: 'Book deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




 

  module.exports = router;