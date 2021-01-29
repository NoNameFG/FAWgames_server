const jwt = require('jsonwebtoken');


class CheckAdminAuthMiddleware{
  checkAuth(req, resp, next){
    if(!req.headers['auth']){
      resp.status(401).json({ message: 'Dennied' });
      return;
    }
    jwt.verify(req.headers['auth'].split(' ')[1], 'FAWgames', async (error, data) => {
      if(error) resp.status(401).json(error);
      next();
    });
  }
}

module.exports = new CheckAdminAuthMiddleware();
