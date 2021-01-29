const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ProductSchema = new Schema({
  product_id: {
    type: String,
    required: [true, 'Product id is required field']
  },
  game_id: {
    type: Schema.Types.ObjectId,
    required: [true, 'Game id is required field']
  },
  product_name: {
    type: String,
    required: [true, 'Product name is required field']
  },
  preoder: {
    type: Boolean,
    required: [true, 'Preoder is required field']
  },
  main_product: {
    type: Boolean,
    required: [true, 'Main product is required field']
  },
  distributor: {
    type: String,
    required: [true, 'Distributor is required field']
  },
  release_date: {
    type: Date,
    required: [true, 'Release date is required field']
  },
  check_date: {
    type: Date,
    required: [true, 'Check date is required field']
  },
  in_stock: {
    type: Number,
    required: [true, 'In stock is required field']
  },
  price_rub: {
    type: Number,
    required: [true, 'Price RUB is required field']
  },
  price_uah: {
    type: Number,
    required: [true, 'Price UAH is required field']
  },
  price_eur: {
    type: Number,
    required: [true, 'Price EUR is required field']
  },
  price_usd: {
    type: Number,
    required: [true, 'Price USD is required field']
  }
}, {collection: 'product'});

const ProductModel = mongoose.model('ProductModel', ProductSchema);

module.exports = ProductModel;
