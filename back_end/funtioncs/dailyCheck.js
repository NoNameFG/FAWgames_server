const digi = require('./../requests/digi.js'),
      ProductModel = require('./../models/productModel.js');

const dailyCheck = async () => {
  const products = await ProductModel.find({}, {product_id: 1, _id: 0});
  const productsIdList = products.map(({product_id}) => product_id);
  let data,
      recivedProductsIdList
  try{
    const request = await digi.get_product_by_id(productsIdList);
    data = request.data;
  } catch (error){
    return;
  }
  recivedProductsIdList = data.map(({id}) => id);
  let nonexistentProductsIdList = productsIdList.filter(el => {
    el = +el;
    return !recivedProductsIdList.includes(el);
  });
  nonexistentProductsIdList.forEach(async el => {
    await ProductModel.findOneAndUpdate(
      {product_id: el},
      {$set:{in_stock: 0}},
      {useFindAndModify: false},
      (error, result) => {
        if(error) resp.status(404).json(error);
      }
    );
  });
  await Promise.all(nonexistentProductsIdList);
  data.forEach(async el => {
    await ProductModel.findOneAndUpdate(
      {product_id: el.id},
      {$set:{
        in_stock: el.in_stock,
        price_eur: el.price_eur,
        price_rub: el.price_rub,
        price_usd: el.price_usd,
        price_uah: el.price_uah
      }},
      {useFindAndModify: false},
      (error, result) => {
        if(error) resp.status(404).json(error);
      }
    );
  });
  await Promise.all(data);
  console.log('CHECKED');
}

module.exports = dailyCheck;
