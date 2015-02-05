import Ember from 'ember';
import ApplicationRouteMixin from 'uncharted-simple-auth/mixins/application-route';

module('ApplicationRouteMixin');

// Replace this with your real tests.
test('it works', function() {
  var ApplicationRouteObject = Ember.Object.extend(ApplicationRouteMixin);
  var subject = ApplicationRouteObject.create();
  ok(subject);
});
