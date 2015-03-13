import Ember from 'ember';
import SimpleAuthConfiguration from 'simple-auth/configuration';

var restore = function(session, current_user, store) {
  return new Ember.RSVP.Promise(function(resolve/*, reject*/) {
    var user_id;

    if (session.get('user_id') == null) {
      resolve();
      return;
    }

    user_id = session.get('user_id');

    store.find('user', user_id).then(function(user) {
      current_user.set('content', user);
      resolve(user);
    })["catch"](function(/* error */) {
      resolve();
    });
  });
};

export default Ember.Mixin.create({
  beforeModel: function(transition) {
    this._super(transition);

    if (this.get('csrf') && this.get('csrf').fetch) {
      this.get('csrf').fetch(this.get('session.authenticity_token'));
    }

    return restore(this.get('session'), this.get('current_user'), this.store);
  },

  actions: {
    sessionInvalidationSucceeded: function() {
      this.get('current_user').set('content', null);
      this.transitionTo(SimpleAuthConfiguration.authenticationRoute);
    },

    sessionInvalidationFailed: function(error) {
      this.trigger('reportError', error);
      this._super(error);
    },

    sessionAuthenticationSucceeded: function() {
      this._super();

      return restore(this.get('session'), this.get('current_user'), this.store).then(function() {
        if (!Ember.testing) {
          window.location.replace("/");
        }
      });
    }
  }
});
