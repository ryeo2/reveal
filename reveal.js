rob = new Meteor.Stream('robert2');


if (Meteor.isClient) {

    if (Meteor.isClient) {
        Router.map(function() {
            return this.route('home', {
                path: '/',
                template: 'reveal'
            });
        });
        Router.map(function() {
            return this.route('barebones', {
                path: '/examples',
                template: 'barebones'
            });
        });
        Template.reveal.rendered = function() {
            console.log('Reveal Rendered');
            Reveal.initialize({autoSlide:3000});
            return Reveal.slide();
        };
        Template.menu.rendered = function() {
            console.log('menu');
            $('.ui.dropdown').dropdown();
            return Router.onRun(function() {
                var theme, transition;
                if (theme = this.params.theme) {
                    Reveal.configure({
                        theme: theme
                    });
                }
                if (transition = this.params.transition) {
                    return Reveal.configure({
                        transition: transition
                    });
                }
            });
        };
        Template.transitionSelect.events({
            'click .item': function(event) {
                var transition;
                transition = $(event.currentTarget).data('value');
                return Reveal.configure({
                    transition: transition
                });
            }
        });
        Template.themeSelect.events({
            'click .item': function(event) {
                var theme;
                theme = $(event.currentTarget).data('value');
                return Reveal.configure({
                    theme: theme
                });
            }
        });
        Template.themeSelect.events({
            'click .item': function(event) {
                return console.log('dddd');
            }
        });
    }

    sendChat = function(message) {
        rob.emit('message', message);
        console.log('me: ' + message);
    };

    rob.on('message', function(message) {
        console.log('user: ' + message.action);
        if (message.action=="start") {
            if (Reveal.isPaused()) {
                Reveal.togglePause();
                //Reveal.next();
            }
        }
        else {

            if (Reveal.isPaused()) {

            } else{
                Reveal.togglePause();
            }
        }
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
      var pubnub = Meteor.require("pubnub").init({
          publish_key   : "demo",
          subscribe_key : "demo"
      });

      pubnub.subscribe({
          channel  : "rob111",
          windowing : 10,
          connect:function () {
              console.log("Connect");
          },
          callback : function(message) {
              //var obj = JSON.parse(message);
              console.log(' ');
              console.log( " > ", message );
              console.log(" > ", message.action);
              console.log('My UUID: ',pubnub.uuid());
              rob.emit('message', message);
              pubnub.here_now({
                  channel : 'my_channel11',
                  callback : function(m){console.log('Here Now: ',m)}
              });
          }
      });
  });
}
