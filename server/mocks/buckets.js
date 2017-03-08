module.exports = function(app) {
  var express = require('express');
  var bucketsRouter = express.Router();

  bucketsRouter.get('/', function(req, res) {
    res.send({
      'buckets': []
    });
  });

  bucketsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  bucketsRouter.get('/:id', function(req, res) {
    res.send({
      'buckets': {
        id: req.params.id
      }
    });
  });

  bucketsRouter.put('/:id', function(req, res) {
    res.send({
      'buckets': {
        id: req.params.id
      }
    });
  });

  bucketsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/buckets', require('body-parser').json());
  app.use('/api/buckets', bucketsRouter);
};
