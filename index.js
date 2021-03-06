var request = require('request')
  , _ = require('underscore')
  , util = require('util');
  ;

var HipChatNotify = module.exports = function(id_or_name, auth_token){
  this.id_or_name = id_or_name;
  this.auth_token = auth_token;
};

HipChatNotify.prototype.notify = function(message, callback){
  this.__notify__.call(this, message, 'yellow', callback);
};

HipChatNotify.prototype.info = function(message, callback){
  this.__notify__.call(this, message, 'gray', callback);
};

HipChatNotify.prototype.warning = function(message, callback){
  this.__notify__.call(this, message, 'yellow', callback);
};

HipChatNotify.prototype.success= function(message, callback){
  this.__notify__.call(this, message, 'green', callback);
};

HipChatNotify.prototype.error = HipChatNotify.prototype.fail = function(message, callback){
  this.__notify__.call(this, message, 'red', callback);
};

HipChatNotify.prototype.__notify__ = function(data, color, callback){

  var msg = _.isString(data) ? { message:data } : data;

  var body = _.defaults(msg, {
    color: color,
    notify: true,
    message_format: /<[a-z][\s\S]*>/i.test(msg.message) ? 'html' : 'text'
  });

  var host = process.env.HIPCHAT_HOST || 'https://api.hipchat.com'

  
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  request({
    method: 'POST',
    uri: util.format(host + '/v2/room/%s/notification', this.id_or_name),
    body: body,
    json: true,
    headers: { 'content-type':'application/json' },
    rejectUnauthorized: false,
    auth: { bearer:this.auth_token }
  }, function (error, response, res) {
    if (callback) {
      callback(error, response.statusCode === 204 ? { status:'ok'} : res);
    }
  });

};
