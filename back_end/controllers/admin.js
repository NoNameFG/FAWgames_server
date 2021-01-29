const AdminModel = require('./../models/adminPriv.js'),
      GameModel = require('./../models/gameModel.js'),
      GameRequirementsModel = require('./../models/gameRequirements.js'),
      ProductModel = require('./../models/productModel.js'),
      KeyModel = require('./../models/keyModel.js'),
      digi = require('./../requests/digi.js'),
      jwt = require('jsonwebtoken'),
      bcrypt = require('bcrypt-nodejs');


class AdminController{
  async login_admin(req, resp){
    const body = req.query,
          admin = await AdminModel.findOne({login: 'admin'});
    if(!bcrypt.compareSync(body.password, admin.password)) resp.status(401).json({message: 'login dennied'});

    const token = jwt.sign({ admin: admin._id }, 'FAWgames');

    resp.setHeader('auth', `Bareer ${token}`);
    resp.status(200).json({message: 'success'});
  }

  async add_game(req, resp){
    const body = req.body,
          game = new GameModel({
            name: body.name,
            image1: body.image1,
            image2: body.image2,
            image3: body.image3,
            game_url: body.game_url,
            video: body.video,
            description: body.description,
            genres: body.genres,
            language: body.language,
            release_date: body.release_date,
            publisher: body.publisher,
            developer: body.developer,
            region: body.region,
            popularity: 0
          }),
          gameRequirements = new GameRequirementsModel({
            game_id: game._id,
            processor: body.processor,
            ram: body.ram,
            video_card: body.video_card,
            disk_space: body.disk_space
          });

    if(game.validateSync()) resp.status(409).json(game.validateSync());
    if(gameRequirements.validateSync()) resp.status(409).json(gameRequirements.validateSync());
    await game.save();
    await gameRequirements.save();

    resp.status(201).json({message: 'success'});
  }

  async add_product(req, resp){
    const body = req.body;
    let digiResp;
    if(!body.product_id){
      resp.status(400).send();
      return;
    }

    try{
      digiResp = await digi.get_product_by_id([body.product_id]);
    } catch (error) {
      resp.status(409).json(error);
    }

    const product = new ProductModel({
      product_id: body.product_id,
      game_id: body.game_id,
      product_name: body.product_name,
      preoder: body.preoder,
      main_product: body.main_product,
      distributor: body.distributor,
      release_date: body.release_date,
      check_date: new Date,
      in_stock: digiResp.data[0].in_stock,
      price_rub: digiResp.data[0].price_rub,
      price_uah: digiResp.data[0].price_uah,
      price_eur: digiResp.data[0].price_eur,
      price_usd: digiResp.data[0].price_usd
    })

    if(!product.validateSync){
      resp.status(400).send();
      return;
    }

    await product.save();
    resp.status(201).json({message: 'success'});
  }

  async update_game(req, resp){ //body.game, body.gameRequirements, body.game_id
    const body = req.body,
          game = await GameModel.findOneAndUpdate(
            {_id: body.game_id},
            {$set: {...body.game}},
            {useFindAndModify: false},
            (error, result) => {
              if(error) resp.status(404).json(error);
          }),
          gameRequirements = GameRequirementsModel.findOneAndUpdate(
            {game_id: body.game_id},
            {$set: {...body.gameRequirements}},
            {useFindAndModify: false},
            (error, result) => {
              if(error) resp.status(404).json(error);
            });

    resp.status(200).json({message: 'success'});
  }

  async delete_game(req, resp){
    const body = req.query,
          delete_game = await GameModel.findOneAndDelete({_id: body.game_id}, (error, result) => {
            resp.status(400).json({message: 'failed'});
          });
    resp.status(200).send();
  }

  async check_product(req, resp){
    const body = req.body,
          product = ProductModel.findOneAndUpdate(
            {product_id: body.product_id},
            {$set: {check_date: new Date}},
            {useFindAndModify: false},
            (error, result) => {
              if(error) resp.status(404).json(error);
            });

    resp.status(200).json({message: 'success'});
  }

  async overdue_product(req, resp){
    const body = req.body,
          product = ProductModel.findOneAndUpdate(
            {product_id: body.product_id},
            {$set: {in_stock: 0}},
            {useFindAndModify: false},
            (error, result) => {
              if(error) resp.status(404).json(error);
            }
          );
    resp.status(200).json({message: 'success'});
  }

  async update_product(req, resp){
    const body = req.body;

    if(body.product_id){
      try{
        digiResp = await digi.get_product_by_id([body.product_id]);
        const product = await ProductModel.findOneAndUpdate(
          {_id: body._id},
          {$set: {
            in_stock: digiResp.data[0].in_stock,
            price_rub: digiResp.data[0].price_rub,
            price_uah: digiResp.data[0].price_uah,
            price_eur: digiResp.data[0].price_eur,
            price_usd: digiResp.data[0].price_usd,
            ...body
          }},
          {useFindAndModify: false},
          (error, result) => {
            if(error) resp.status(404).json(error);
          }
        );
      } catch (error) {
        resp.status(409).json(error);
      }
    }

    const product = await ProductModel.findOneAndUpdate(
      {_id: body._id},
      {$set: {
        ...body
      }},
      {useFindAndModify: false},
      (error, result) => {
        if(error) resp.status(404).json(error);
      }
    )
    resp.status(200).json({message: 'success'});
  }

  async delete_product(req, resp){
    const body = req.query;
    const remove_product = await ProductModel.findOneAndDelete({_id: body._id}, (error, result) => {
      if(error) resp.status(404).json(error);
    });
    resp.status(200).json({message: 'success'});
  }

  async search_game_add_product(req, resp){
    const body = req.query,
          games = await GameModel.find({
            name: {
              $regex: body.name,
              $options: 'i'
            }}, (error, result) => {
              if(error) resp.status(404).json(error);
            });

    const exactgames = games.map( el => {
      return {
        _id: el._id,
        name: el.name,
        release_date: el.release_date
      };
    });

    resp.status(200).json(exactgames);
  }

  async get_overdue_products(req, resp){
    let date = new Date;
    const products = await ProductModel.find().or([{in_stock: 0}, {preoder: true, release_date: {$lte: date}}], (error, result) => {
       resp.status(404).json(error);
    });

    resp.status(200).json(products);
  }

  async get_weekly_check(req, resp){
    let date = new Date;
    date.setDate(date.getDate() - 7);

    const products = await ProductModel.find({check_date: {$lte: date}}, (error, result) => {
      if(error) resp.status(404).json(error);
    });

    resp.status(200).json(products);
  }

  async get_games_edit(req, resp){
    const body = req.query,
          games = await GameModel.find({
            name: {
              $regex: body.name,
              $options: 'i'
            }}, (error, result) => {
              if(error) resp.status(404).json(error);
            });

    const exactgames_treatment = games.map(async el => {
      const game_requirements = await GameRequirementsModel.findOne({game_id: el._id})
      el._doc.requirements = { //._doc AAAAAAAAAAAAAA
        processor: game_requirements.processor,
        ram: game_requirements.ram,
        video_card: game_requirements.video_card,
        disk_space: game_requirements.disk_space
      };
      return el;
    });
    const exactgames = await Promise.all(exactgames_treatment);

    resp.status(200).json(exactgames);
  }

  async add_key_name(req, resp){
    const body = req.body,
          key = new KeyModel({
            key_name: body.key_name,
            game_id: body.game_id
          })
    if(key.validateSync()) resp.status(409).json(key.validateSync());

    await key.save();
    resp.status(201).json({message: 'success'});
  }
}

module.exports = new AdminController();
