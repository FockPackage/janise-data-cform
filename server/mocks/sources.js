const sources = require('../fixtures/sources');

module.exports = app => {
  const sourcesRouter = require('express').Router();

  sourcesRouter.get('/', function(req, res) {
    res.send({sources});
  });

  sourcesRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  sourcesRouter.get('/:id', function(req, res) {
    res.send({
      'sources': sources.filter(source => req.params.id == source.id)[0]
    });
  });

  sourcesRouter.put('/:id', function(req, res) {
    res.send({
      'sources': {
        id: req.params.id
      }
    });
  });

  sourcesRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/sources', require('body-parser').json());
  app.use('/api/sources', sourcesRouter);
};
