import Ember from 'ember';
import unchartedAjax from 'uncharted-ajax';

// Local storage of token data
var data = {
  key: "authenticity_token",
  value: null
};

export default Ember.Object.extend({
  // Initialize and setup the event callbacks
  setup: function() {
    var object = this;
    Ember.$(document).on('ajaxComplete', function(event, xhr, settings) {
      var param = xhr.getResponseHeader("X-CSRF-Param");
      if (param) {
        console.log("Setting CSRF param: " + param);
        data.key = param;
      }

      var token = xhr.getResponseHeader("X-CSRF-Token");
      if (token) {
        console.log(settings.url + ": setting csrf token " + token);
        object.update(token);
      }
    });

    var filter = function(options, originalOptions, xhr) {
      var token = object.token();
      if (token) {
        console.log(options.url + ": sending csrf " + token);
        xhr.setRequestHeader("X-CSRF-Token", token);
      } else {
        console.log(options.url + ": skipping csrf");
      }
    };

    Ember.$.ajaxPrefilter(filter);
  }.on('init'),

  param: function() {
    return data.key;
  },

  token: function() {
    return data.value;
  },

  // Fetch a token from the server
  fetch: function() {
    var object = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      unchartedAjax({
        url: '/session/token'
      }).then(function(result) {
        object.update(result[object.param()]);
        resolve(result[object.param()]);
      }).catch(function(error) {
        reject(error);
      });
    });
  },

  // Look for a token in a meta tag an optionally fetch from a server
  // if it doesn't exist
  restore: function() {
    var object = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var token = Ember.$('meta[name="csrf-token"]').attr("content");
      if (token && !Ember.isEmpty(token)) {
        object.update(token);
        resolve(token);
      } else {
        object.fetch().then(function(token) {
          resolve(token);
        }).catch(function(error) {
          reject(error);
        });
      }
    })
  },

  // Update the active token
  update: function(token) {
    data.value = token;
  }
});
