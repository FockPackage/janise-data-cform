const buckets = require('../fixtures/buckets');
const presentations = require('../fixtures/presentations');

module.exports = function(app) {
  var express = require('express');
  var presentationsRouter = express.Router();

  presentationsRouter.get('/', function(req, res) {
    const { view, filter } = req.query;

    let results = presentations.filter(p => view == p.viewId);

    if (filter) {
      results = results.filter(p => filter == p.filterId);
    } else {
      results = results.filter(p => !p.filterId);
    }

    results = results.map(result => {
      result.bucket = buckets
        .filter(bucket => result._bucket === bucket.id)[0];
      return result;
    });

    res.send({ presentations: results });
  });

  presentationsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  presentationsRouter.get('/:id', function(req, res) {
    res.send({
      'presentations': {
        id: req.params.id
      }
    });
  });

  presentationsRouter.put('/:id', function(req, res) {
    res.send({
      'presentations': {
        id: req.params.id
      }
    });
  });

  presentationsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/presentations', require('body-parser').json());
  app.use('/api/presentations', presentationsRouter);
};
