const GameModel = require('./../models/gameModel.js'),
      GameRequirementsModel = require('./../models/gameRequirements.js'),
      KeyModel = require('./../models/keyModel.js');
      ProductModel = require('./../models/productModel.js');


class SiteController{
  async get_slider_games(req, resp){
    const slider_games = await GameModel.find({}, {name: 1, game_url: 1, image1: 1}).sort({popularity: -1}).limit(9);
    if(!slider_games) resp.status(400).send();

    let exact_slider_product_treatment = slider_games.map(async el => {
          const main_product = await ProductModel.findOne({game_id: el._id, main_product: true}, {price_eur: 1, price_rub: 1, price_uah: 1, price_usd: 1}),
                products_publisher = await ProductModel.find({game_id: el._id}, {distributor: 1});

          let uniq_publisher = [...new Set(products_publisher.map( el => el.distributor))];
          let game_data = {};
          game_data.name = el.name;
          game_data.image1 = el.image1;
          game_data.game_url = el.game_url;
          game_data.prices = {
            price_eur: main_product.price_eur,
            price_rub: main_product.price_rub,
            price_uah: main_product.price_uah,
            price_usd: main_product.price_usd
          }
          game_data.distributor = uniq_publisher;

          return game_data
        }),
        exact_slider_product = await Promise.all(exact_slider_product_treatment);

    resp.status(200).json(exact_slider_product);
  }

  async get_page_count(req, resp){
    const count = await GameModel.countDocuments((error, result) => {
      if(error) resp.status(404).json(error);
    });
    if(!count) resp.status(404).send();
    resp.status(200).json({pageCount: Math.ceil(count/12)});
  }

  async get_template_games(req, resp){
    const body = req.query,
          template_games = await GameModel.find({}, {name: 1, game_url: 1, image3: 1}).sort({_id: -1}).skip(12*(body.page-1)).limit(12);

    if(!template_games) resp.status(400).send();

    let exact_template_product_treatment = template_games.map(async el => {
          const main_product = await ProductModel.findOne({game_id: el._id, main_product: true}, {price_eur: 1, price_rub: 1, price_uah: 1, price_usd: 1}),
                products_publisher = await ProductModel.find({game_id: el._id}, {distributor: 1});

          let uniq_publisher = [...new Set(products_publisher.map( el => el.distributor))];

          let game_data = {};
          game_data.name = el.name;
          game_data.image3 = el.image3;
          game_data.game_url = el.game_url;
          game_data.prices = {
            price_eur: main_product.price_eur,
            price_rub: main_product.price_rub,
            price_uah: main_product.price_uah,
            price_usd: main_product.price_usd
          }
          game_data.distributor = uniq_publisher;

          return game_data
        }),
        exact_template_product = await Promise.all(exact_template_product_treatment);

    resp.status(200).json(exact_template_product);
  }

  async get_game_page(req, resp){
    const body = req.query,
          game = await GameModel.findOneAndUpdate(
            {game_url: body.game_url},
            {$inc: {popularity: 1}},
            {useFindAndModify: false, new: true, name: 1, image2: 1, game_url: 1,video: 1,description: 1,genres: 1,language: 1,release_date: 1,publisher: 1,developer: 1,region: 1},
            );

    if(!game){
      resp.status(404).send();
      return;
    }

    const main_product = await ProductModel.findOne(
            {game_id: game._id, main_product: true},
            {
                product_id: 1,
                distributor: 1,
                preoder: 1,
                price_eur: 1,
                price_rub: 1,
                price_uah: 1,
                price_usd: 1
            }
          ),
          game_products = await ProductModel.find(
            {game_id: game.id, main_product: false},
            {
              price_rub: 1,
              price_eur: 1,
              price_usd: 1,
              price_uah: 1,
              product_id: 1,
              product_name: 1,
              distributor: 1
            }
          ),
          game_requirements = await GameRequirementsModel.findOne({game_id: game.id}, {_id: 0, processor: 1, ram: 1, video_card: 1, disk_space: 1});

    if(!game || !main_product || !game_products || !game_requirements) resp.status(400).send();

    game_products.map( el => {
      let exact_el = {};
      exact_el.product_id = el.product_id;
      exact_el.product_name = el.product_name;
      exact_el.distributor = el.distributor;
      exact_el.prices = {
        price_rub: el.price_rub,
        price_eur: el.price_eur,
        price_usd: el.price_usd,
        price_uah: el.price_uah,
      }
    })

    resp.status(200).json({
      main_game:{
        name: game.name,
        image2: game.image2,
        game_url: game.game_url,
        video: game.video,
        description: game.description,
        genres: game.genres,
        language: game.language,
        release_date: game.release_date,
        publisher: game.publisher,
        developer: game.developer,
        region: game.region,
        preoder: main_product.preoder,
        product: {
          product_id: main_product.product_id,
          distributor: main_product.distributor,
          prices: {
            price_rub: main_product.price_rub,
            price_eur: main_product.price_eur,
            price_usd: main_product.price_usd,
            price_uah: main_product.price_uah,
          }
        },
        requirements: {
          ...game_requirements._doc
        }
      },
      other_game_products: game_products,
    });
  }


  async game_search_by_name(req, resp){
    const body = req.query,
          keys = await KeyModel.find({
            key_name: {
              $regex: body.name,
              $options: 'i'
            }
          },
          {
            game_id: 1,
            _id: 0
          },
          (error, result) => {
            if(error) resp.status(404).json(error);
          }).limit(6);

    const exactgames_treatment = keys.map(async el => {
      const main_product = await ProductModel.findOne(
        {game_id: el.game_id, main_product: true},
        {price_eur: 1, price_usd: 1, price_rub: 1, price_uah: 1}
      );
      const game = await GameModel.findOne(
        {_id: el.game_id},
        {name: 1, game_url: 1}
      );

      return {
        _id: game._id,
        name: game.name,
        game_url: game.game_url,
        prices: main_product ? {
          price_eur: main_product.price_eur,
          price_rub: main_product.price_rub,
          price_usd: main_product.price_usd,
          price_uah: main_product.price_uah
        }
        :
        {
          price_eur: 'none',
          price_rub: 'none',
          price_usd: 'none',
          price_uah: 'none'
        }
      };
    });
    const exactgames = await Promise.all(exactgames_treatment);

    resp.status(200).json(exactgames);
  }

  async game_search_page_count_by_params(req, resp){
    const body = req.query,        //body.genres == ['category', 'category2'], tag = 'string'
          paramsToSearch = {};

    if(body.genres) paramsToSearch.genres = {$in: body.genres};
    if(body.tag){
      const keys = await KeyModel.find({
        key_name: {
          $regex: body.tag,
          $options: 'i'
        }
      },
      {
        game_id: 1,
        _id: 0
      },
      (error, result) => {
        if(error) resp.status(404).json(error);
      })
      paramsToSearch._id = {$in: keys.map(el => el.game_id)}
    }

    const count = await GameModel.countDocuments(paramsToSearch, (error, result) => {
            if(error) resp.status(404).json(error);
          });

    resp.status(200).json({pageCount: Math.ceil(count/12)})
  }

  async game_search_by_params(req, resp){
    const body = req.query,        //body.genres == ['category', 'category2'], tag = 'string', page = num
          paramsToSearch = {};

    if(body.genres) paramsToSearch.genres = {$in: body.genres};
    if(body.tag){
      const keys = await KeyModel.find({
        key_name: {
          $regex: body.tag,
          $options: 'i'
        }
      },
      {
        game_id: 1,
        _id: 0
      },
      (error, result) => {
        if(error) resp.status(404).json(error);
      })
      paramsToSearch._id = {$in: keys.map(el => el.game_id)}
    }

    const games = await GameModel.find(paramsToSearch, {name: 1, game_url: 1, image3: 1}).sort({_id: -1}).skip(12*(body.page-1)).limit(12);;

    const gamesexact_treatment = games.map(async el => {
            const main_product = await ProductModel.findOne({game_id: el._id, main_product: true}, {price_eur: 1, price_rub: 1, price_uah: 1, price_usd: 1}),
                  products_publisher = await ProductModel.find({game_id: el._id}, {distributor: 1});

            let uniq_publisher = [...new Set(products_publisher.map( el => el.distributor))];


            let game_data = {};
            game_data.name = el.name;
            game_data.image3 = el.image3;
            game_data.game_url = el.game_url;
            game_data.prices = {
              price_eur: main_product.price_eur,
              price_rub: main_product.price_rub,
              price_uah: main_product.price_uah,
              price_usd: main_product.price_usd
            }
            game_data.distributor = uniq_publisher;

            return game_data
          });
    const gamesexact = await Promise.all(gamesexact_treatment);

    resp.status(200).json(gamesexact);
  }
}

module.exports = new SiteController();
