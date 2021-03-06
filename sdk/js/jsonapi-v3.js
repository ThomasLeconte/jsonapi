// Generated by CoffeeScript 1.6.3
/*
opts = {
	hostname: 'localhost',
	port: 25565,
	username: 'admin',
	password: 'demo',
	onConnection: function(err, jsonapi){}
}
*/


(function() {
  var JSONAPI, j;

  JSONAPI = (function() {
    function JSONAPI(opts) {
      opts = opts || {};
      this.host = opts.hostname || 'localhost';
      this.port = opts.port || 20059;
      this.username = opts.username || 'admin';
      this.password = opts.password || 'changeme';
      this.queue = [];
      this.handlers = {};
    }

    JSONAPI.prototype.connect = function() {
      var _this = this;
      this.socket = new WebSocket("ws://" + this.host + ":" + this.port + "/api/2/websocket");
      this.socket.onopen = function() {
        var item, _i, _len, _ref;
        if (_this.queue.length > 0) {
          _ref = _this.queue;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            _this.send(item.line);
          }
          return _this.queue = [];
        }
      };
      this.socket.onerror = function(e) {
        throw e;
      };
      return this.socket.onmessage = function(data) {
        var json, line, _i, _len, _ref, _results;
        return console.log(data);
        data = data.data;
        _ref = data.toString().trim().split("\r\n");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          line = _ref[_i];
          json = JSON.parse(line);
          if (typeof json.tag !== "undefined" && _this.handlers[json.tag]) {
            _results.push(_this.handlers[json.tag](json));
          } else {
            throw "JSONAPI is out of date. JSONAPI 5.3.0+ is required.";
          }
        }
        return _results;
      };
    };

    JSONAPI.prototype.send = function(data) {
      if (this.socket.readyState === WebSocket.OPEN) {
        return this.socket.send(data);
      } else {
        return this.queue.push({
          line: data
        });
      }
    };

    return JSONAPI;

  })();

  j = new JSONAPI;

  j.connect();

  setInterval(function() {
    return j.send('test');
  }, 15000);

}).call(this);
