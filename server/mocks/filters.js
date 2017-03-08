const filters = require('../fixtures/filters');

module.exports = function(app) {
  var express = require('express');
  var filtersRouter = express.Router();

  filtersRouter.get('/', function(req, res) {
    res.send({filters});
  });

  filtersRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  filtersRouter.get('/:id', function(req, res) {
    res.send({
      'filters': filters.filter(filter => req.params.id == filter.id)[0]
    });
  });

  filtersRouter.put('/:id', function(req, res) {
    res.send({
      'filters': {
        id: req.params.id
      }
    });
  });

  filtersRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/filters', require('body-parser').json());
  app.use('/api/filters', filtersRouter);
};
