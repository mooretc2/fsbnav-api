/**
 * Routes endpoints to their respective controllers
 * @param {Express} app Express app object.
 */
module.exports = function(app) {
  var routeController = require('../controllers/routeController');

  app.post('/route', routeController.getRoute);

  app.get('/rooms', routeController.getRooms);
  
  app.get('/rooms/:roomID', routeController.getRoomsByID);
};

