const Router = require('express').Router,
      SiteController = require('./../../controllers/site.js');

const router = Router();

router.route('/game/search_field')
  .get((req, resp) => {
    SiteController.game_search_by_name(req, resp);
  });

router.route('/game/slider')
  .get((req, resp) => {
    SiteController.get_slider_games(req, resp);
  })

router.route('/game/template/page_count')
  .get((req, resp) => {
    SiteController.get_page_count(req, resp);
  })

router.route('/game/template')
  .get((req, resp) => {
    SiteController.get_template_games(req, resp);
  })

router.route('/game')
  .get((req, resp) => {
    SiteController.get_game_page(req, resp);
  })

router.route('/game/search/page_count')
  .get((req, resp) => {
    SiteController.game_search_page_count_by_params(req, resp);
  })
  
router.route('/game/search')
  .get((req, resp) => {
    SiteController.game_search_by_params(req, resp);
  })

module.exports = router;
