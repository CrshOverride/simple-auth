import Ember from 'ember';

var restore = function(session, current_user, store) {
  return new Ember.RSVP.Promise(function(resolve, reject) {
    var user_id;
    var _this = this;

    if (session.get('user_id') == null) {
      resolve();
      return;
    }

    user_id = session.get('user_id');

    store.find('user', user_id).then(function(user) {
      current_user.set('content', user);
      resolve(user);
    })["catch"](function(error) {
      resolve();
    });
  });
};

export default Ember.Mixin.create({
  beforeModel: function(transition) {
    this._super(transition);

    if (this.get('csrf') && this.get('csrf').fetchToken) {
      this.get('csrf').fetchToken(this.get('session.authenticity_token'));
    }

    return restore(this.get('session'), this.get('current_user'), this.store);
  },

  actions: {
    sessionInvalidationSucceeded: function() {
      this.get('current_user').set('content', null);
      this.transitionTo('user.login');

      this._super();
    },

    sessionInvalidationFailed: function(error) {
      Raven.captureException(error, {
        extra: context
      });

      this._super(error);
    },

    sessionAuthenticationSucceeded: function() {
      this._super();

      var _this = this;
      return restore(this.get('session'), this.get('current_user'), this.store).then(function() {
        _this.transitionTo('index');
      });
    }
  }
});
