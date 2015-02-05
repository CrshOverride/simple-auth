export function initialize(container, application) {
  application.inject('route', 'csrf', 'service:csrf');
  application.inject('controller', 'csrf', 'service:csrf');
}

export default {
  name: 'csrf-service',
  initialize: initialize
};
