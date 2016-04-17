angular.module('chat', [])

  .factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  })

  .controller('mainController', function(socket){
    var scope = this;

    scope.messages = [];

    scope.sendMessage = function() {
      socket.emit('message', scope.messageInput);
      scope.messageInput = '';
    };

    socket.on('message', function(message){
      scope.messages.push({
        body: message
      });
    });
  });