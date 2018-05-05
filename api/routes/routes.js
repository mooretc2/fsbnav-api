
module.exports = function(app) {
  var routeController = require('../controllers/routeController');

  app.post('/route', routeController.getRoute);

  app.get('/rooms', routeController.getRooms);
  
  app.get('/rooms/:roomID', routeController.getRoomsByID);

  //app.get('/test', routeController.testFunction);
};

