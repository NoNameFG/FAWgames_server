const Router = require('express').Router,
      AdminController = require('./../../controllers/admin.js');

const router = Router();

router.route('/game')
  .get((req, resp) => {
    AdminController.get_games_edit(req, resp);
  })
  .post((req, resp) => {
    AdminController.add_game(req, resp);
  })
  .put((req, resp) => {
    AdminController.update_game(req, resp);
  })
  .delete((req, resp) => {
    AdminController.delete_game(req, resp);
  });

router.route('/product')
  .get((req, resp) => {
    AdminController.search_game_add_product(req, resp);
  })
  .post((req, resp) => {
    AdminController.add_product(req, resp);
  })
  .put((req, resp) => {
    AdminController.update_product(req, resp);
  })
  .delete((req, resp) => {
    AdminController.delete_product(req, resp);
  });

router.route('/product/weekly_check')
  .get((req, resp) => {
    AdminController.get_weekly_check(req, resp);
  })
  .post((req, resp) => {
    AdminController.check_product(req, resp);
  })

router.route('/product/overdue_products')
  .get((req, resp) => {
    AdminController.get_overdue_products(req, resp);
  })
  .post((req, resp) => {
    AdminController.overdue_product(req, resp);
  })

router.route('/key')
  .post((req, resp) => {
    AdminController.add_key_name(req, resp)
  })

module.exports = router;
