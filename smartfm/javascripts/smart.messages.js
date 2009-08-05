var smart = smart || {};

smart.messages = {
  enable: function () {
    $("#header .viewer_menu").show('fast', function () {
      $(window).adjustHeight();
    });
  },
  send: function (title, body, media_item) {
    if ($.container.mixi) {
      var params = {};
      params[opensocial.Activity.Field.TITLE] = title;
      params[mixi.ActivityField.RECIPIENTS] = [smart.owner.id];
      if (media_item) {
        var media_params = {};
        media_params[opensocial.MediaItem.Field.TYPE] = opensocial.MediaItem.Type.IMAGE;
        var mediaItem = opensocial.newMediaItem(media_item.mime_type, media_item.url, media_params);
        params[opensocial.Activity.Field.MEDIA_ITEMS] = [mediaItem];
      }
      var activity = opensocial.newActivity(params);
      opensocial.requestCreateActivity(activity, opensocial.CreateActivityPriority.HIGH, function () {
        $("#header .viewer_menu").hide('fast', function () {
          $(window).adjustHeight();
        });
      });
    } else {
      $.postData ('/messages/@viewer/@outbox', {
        recipients: '@owner',
        title: title,
        body: body
      }, function () {
        $("#header .viewer_menu").hide('fast', function () {
          $(window).adjustHeight();
        });
      });
    }
  },
  poke: function () {
    var title = 'Hey ' + smart.owner.nickname + ', study more on smart.fm!!';
    var body = 'Go smart.fm and push the button ;)';
    var media_item = {
      mime_type: 'image/gif',
      url: 'http://matake.jp/gadgets/smartfm/images/crying_owl.gif'
    };
    smart.messages.send(title, body, media_item);
  },
  high_five: function () {
    var title = 'Hey ' + smart.owner.nickname + ', High Five!!';
    var body = 'Your English is improving rapidly ;)';
    var media_item = {
      mime_type: 'image/gif',
      url: 'http://matake.jp/gadgets/smartfm/images/smiling_owl.gif'
    };
    smart.messages.send(title, body, media_item);
  },
  share: function (message) {
    opensocial.requestShareApp(
      "VIEWER_FRIENDS",
      opensocial.newMessage(message),
      function (status) {
        if (status.hadError()) {
          if (console) console.info(status.getErrorCode());
        } else {
          if (console) console.info("share app message was sent successfully");
        }
      }
    );
  },
  message: function () {
    opensocial.requestSendMessage(
      'VIEWER_FRIENDS',
      opensocial.newMessage(message),
      function (status) {
        if (status.hadError()) {
          if (console) console.info(status.getErrorCode());
        } else {
          if (console) console.info("message was sent successfully");
        }
      }
    );
  }
}

/*

smart.study_result.load
  - calculate last_studied_at

smart.activities.load
  - load friends activities

smart.activities.update
  - store last_studied_at

smart.activities.publish
  - smart.activities.poke
  - smart.activities.high_five

*/


