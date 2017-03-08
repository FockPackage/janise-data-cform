const reports = require('../fixtures/reports');
const views = require('../fixtures/views');
const filters = require('../fixtures/filters');

module.exports = app => {
  const reportsRouter = require('express').Router();

  reportsRouter.get('/', function(req, res) {
    res.send({
      reports: reports.map(report => {
        report.views = views
          .filter(view => report._views.includes(view.id))
          .map(view => {
            view.filters = filters.filter(filter => view._filters.includes(filter.id));
            return view
          });
        return report;
      })
    });
  });

  reportsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  reportsRouter.get('/:id', function(req, res) {
    const report = reports.filter(report => req.params.id == report.id)[0];
    report.views = views.filter(view => report._views.includes(view.id))
      .map(view => {
        view.filters = filters.filter(filter => view._filters.includes(filter.id));
        return view;
      });

    res.send({ 'report': report });
  });

  reportsRouter.put('/:id', function(req, res) {
    res.send({
      'reports': {
        id: req.params.id
      }
    });
  });

  reportsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/reports', require('body-parser').json());
  app.use('/api/reports', reportsRouter);
};
