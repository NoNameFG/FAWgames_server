const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const GameSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Game name is required field']
  },
  image1: {
    type: String,
    required: [true, 'Image 1 is required field']
  },
  image2: {
    type: String,
    required: [true, 'Image 2 is required field']
  },
  image3: {
    type: String,
    required: [true, 'Image 3 is required field']
  },
  game_url:{
    type: String,
    required: [true, 'Game_url is required field']
  },
  video: {
    type: String,
    required: [true, 'Video is required field']
  },
  description: {
    type: String,
    required: [true, 'Description is required field']
  },
  genres: {
    type: Array,
    required: [true, 'Genres is required field']
  },
  language: {
    type: String,
    required: [true, 'Language is required field']
  },
  release_date: {
    type: Date,
    required: [true, 'Release date is required field']
  },
  publisher: {
    type: String,
    required: [true, 'Publisher is required field']
  },
  developer: {
    type: String,
    required: [true, 'Developer is required field']
  },
  region: {
    type: String,
    required: false
  },
  popularity: {
    type: Number,
    required: true
  }
}, {collection: 'game'});

const GameModel = mongoose.model('GameModel', GameSchema);

module.exports = GameModel;
