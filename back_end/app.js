const express = require('express'),
      body_parser = require('body-parser'),
      mongoose = require('mongoose');
      cookie_parser = require('cookie-parser'),
      cors = require('cors'),
      app_config = require('./config/config.json'),
      dailyCheck = require('./funtioncs/dailyCheck.js');
      route_init = require('./init/routeInit.js');

const app = express();

app.use(cors());
app.use(body_parser.urlencoded({limit: '60mb' ,extended: true }));
app.use(body_parser.json({limit: '60mb'}));
app.use(cookie_parser());

route_init(app, app_config.base_url);

mongoose.connect(`${app_config.db.protocol}${app_config.db.username}:${app_config.db.password}@${app_config.db.host}:${app_config.db.port}/${app_config.db.db_name}`, { useNewUrlParser: true, useUnifiedTopology: true })

app.listen(app_config.port, () => {
  console.log(`Server running ${app_config.port} port`);
});


//ADD DAILY CHECK PRODUCT STATUS
setInterval(dailyCheck, 1000*60*60*6);
