export function initialize(container, application) {
  Ember.A(['controller', 'view', 'route']).forEach(function(component) {
    container.injection(component, 'current_user', 'service:current-user');
  })
}

export default {
  name: 'current-user-service',
  initialize: initialize
};
