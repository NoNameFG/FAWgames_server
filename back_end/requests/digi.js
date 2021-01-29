const axios = require('axios');

const digi = {
  get_product_by_id: async ids => axios.post('https://api.digiseller.ru/api/products/list', {ids: ids})
}

module.exports = digi;
