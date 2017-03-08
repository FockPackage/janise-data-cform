import Ember from 'ember';
import config from 'choice-dashboard/config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('404', {path: '/*wildcard'});
  this.route('login');
  this.route('signup');
  this.route('recover-account');

  this.route('account', function() {
    this.route('general');
    this.route('plans');
    this.route('billing', function() {
      this.route('account-history');
      this.route('payment-history');
    });
    this.route('purchases');
    this.route('notifications');
    this.route('security');
    this.route('integrations');
  });

  this.route('form', { path: "/form/:id" }, function() {
    this.route('quota');
    this.route('collect');
    this.route('share', function() {
      this.route('url');
      this.route('popup');
      this.route('embed');
    });
    this.route('analyze', function() {
      this.route('metrics');
      this.route('summaries');
      this.route('results');
      this.route('responses');
    });
  });

  this.route('create');
  this.route('updates');

  this.route('reports', function() {
    this.route('new');
    this.route('report', {path: ':id'}, function() {
    });
  });

  this.route('updates-manage', function() {
    this.route('new');
    this.route('updates', {path: ':id'}, function() {
      this.route('editor');
    });
  });

  // 开发环境才用到的统一放在这里面
  if (config.environment == 'development') {
    this.route('temp');
  }
});

export default Router;
