const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const KeySchema = new Schema({
  key_name: {
    type: String,
    required: [true, 'Key name is required field']
  },
  game_id: {
    type: Schema.Types.ObjectId,
    required: [true, 'Game id is required field']
  }
}, {collection: 'game_key_name'});

const KeyModel = mongoose.model('KeyModel', KeySchema);

module.exports = KeyModel;
