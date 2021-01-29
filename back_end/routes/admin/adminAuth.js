const Router = require('express').Router,
      AdminController = require('./../../controllers/admin.js');

const router = Router();

router.route('/login')
  .get((req, resp) => {
    AdminController.login_admin(req, resp);
  });

module.exports = router;
