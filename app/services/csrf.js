import Ember from 'ember';
import UnchartedAjax from 'uncharted-ajax';

export default Ember.Object.extend({
  onAjaxComplete: function() {
    var _this = this;
    Ember.$(document).on("ajaxComplete", function(event, xhr, settings) {
      var csrf_param, csrf_token;
      csrf_param = xhr.getResponseHeader("X-CSRF-Param");
      csrf_token = xhr.getResponseHeader("X-CSRF-Token");
      if (csrf_param && csrf_token) {
        _this.setData({
          csrf_param: csrf_token
        });
      }
    });
  }.on("init"),

  setPrefilter: function() {
    var preFilter, token;
    token = this.get("data").token;
    preFilter = function(options, originalOptions, jqXHR) {
      return jqXHR.setRequestHeader("X-CSRF-Token", token);
    };
    Ember.$.ajaxPrefilter(preFilter);
  },

  setData: function(data) {
    var param = Object.keys(data)[0];
    this.set("data", {
      param: param,
      token: data[param]
    });
    this.setPrefilter();
    return this.get("data");
  },

  fetchToken: function(authenticity_token) {
    var promise;
    var setData = this.setData.bind(this);
    var token;

    if (this.get("data")) {
      promise = Ember.RSVP.resolve(this.get("data"));
    } else {
      token = authenticity_token || Ember.$("meta[name=\"csrf-token\"]").attr("content");
      if (!Ember.isEmpty(token)) {
        promise = Ember.RSVP.resolve({
          authenticity_token: token
        });
      } else {
        promise = UnchartedAjax({
          url: '/session/token'
        });
      }
      promise = promise.then(setData);
    }
    return promise;
  }
});
