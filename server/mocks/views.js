const views = require('../fixtures/views');

module.exports = function(app) {
  var express = require('express');
  var viewsRouter = express.Router();

  viewsRouter.get('/', function(req, res) {
    res.send({views});
  });

  viewsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  viewsRouter.get('/:id', function(req, res) {
    res.send({
      'views': views.filter(view => req.params.id == view.id)[0]
    });
  });

  viewsRouter.put('/:id', function(req, res) {
    res.send({
      'views': {
        id: req.params.id
      }
    });
  });

  viewsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/views', require('body-parser').json());
  app.use('/api/views', viewsRouter);
};
