const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const AdminSchema = new Schema({
  login: {
    type: String
  },
  password: {
    type: String
  }
}, {collection: 'admin'});

const AdminModel = mongoose.model('AdminModel', AdminSchema);

module.exports = AdminModel;
