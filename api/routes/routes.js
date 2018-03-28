
module.exports = function(app) {
  var routeController = require('../controllers/routeController');

  app.route('/route')
    .post(routeController.getRoute);

  app.route('/rooms')
    .get(routeController.getRooms);
};

