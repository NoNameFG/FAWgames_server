const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const RequirementsSchema = new Schema({
  game_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  processor: {
    type: String,
    required: [true, 'Processor is required field']
  },
  ram: {
    type: String,
    required: [true, 'RAM is required field']
  },
  video_card: {
    type: String,
    required: [true, 'Video card is required field']
  },
  disk_space: {
    type: String,
    required: [true, 'Disk space is required field']
  }
}, {collection: 'game_requirements'});

const GameRequirementsModel = mongoose.model('GameRequirementsModel', RequirementsSchema);

module.exports = GameRequirementsModel;
