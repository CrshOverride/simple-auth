import Devise from 'simple-auth-devise/authenticators/devise';
import UnchartedAjax from 'uncharted-ajax';

var Authenticator = Devise.extend({
  restore: function(/* properties */) {
    return UnchartedAjax({
      url: '/session/me'
    });
  },

  invalidate: function() {
    return UnchartedAjax({
      url: '/users/sign_out'
    });
  }
});

export default Authenticator;
