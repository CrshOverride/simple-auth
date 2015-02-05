import Base from 'simple-auth/stores/base';

var Store = Base.extend({
  restore: function() {
    return { authenticator: 'uncharted-simple-auth@authenticator:rails' };
  }
});

export default Store;
