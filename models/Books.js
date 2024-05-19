const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema(
  {
   
    author_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    },
   
    category: {
      type: String,
      enum: ['fiction', 'non-fiction'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
  
   
  }, 
 );
 
const Book = mongoose.model('Book', BookSchema);
module.exports = Book;
