import Devise from 'simple-auth-devise/authenticators/devise';
import unchartedAjax from 'uncharted-ajax';

var Authenticator = Devise.extend({
  restore: function(/* properties */) {
    return unchartedAjax({
      url: '/session/me',
      cache: false
    });
  },

  invalidate: function() {
    return unchartedAjax({
      url: '/users/sign_out',
      cache: false
    });
  }
});

export default Authenticator;
