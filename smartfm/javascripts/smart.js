var smart = {
  lang: "ja",
  base_url: "http://smart.fm",
  api_base_url: "http://api.smart.fm",
  username: $.pref("username"),
  per_page: $.pref("per_page") || 5,
  ranking_by: "iknow_studied",
  features: null,
  init: function (callback) {
    smart.features = smart.features || callback;
    if (!gadgets.util.hasFeature("setprefs")) {
      $.getData("/appdata/@viewer/@self", {fields: "username, per_page, ranking_by"}, function (data) {
        $.each(data, function (id, pref) {
          smart.username = pref.username;
          smart.per_page = pref.per_page || 5;
          smart.ranking_by = pref.ranking_by || 'iknow_studied';
        });
        if (!smart.username || smart.usename == "") {
          $('#sidebar').hide();
          smart.pref.open();
        } else {
          $("#username").val(smart.username);
          $("#per_page").val(smart.per_page);
          smart.features();
        }
      });
    } else {
      smart.features();
    }
  },
  pref: {
    set: function (pref) {
      var callback = function () {
        $('#sidebar').show();
        $("#pref").hide();
        smart.init();
      }
      smart.username = pref.username.value;
      smart.per_page = pref.per_page.value;
      smart.ranking_by = pref.ranking_by.value;
      if (gadgets.util.hasFeature("setprefs")) {
        $.pref("username", smart.username, function () {
          $.pref("per_page", smart.per_page, function () {
            $.pref("ranking_by", smart.ranking_by, callback);
          });
        });
      } else {
        $.postData("/appdata/@viewer/@self", {username: smart.username, per_page: smart.per_page, ranking_by: smart.ranking_by}, callback);
      }
    },
    open: function () {
      $("#pref").show('fast', function () {
        $(window).adjustHeight();
      });
    },
    toggle: function () {
      $("#pref").toggle('fast', function () {
        $(window).adjustHeight();
      });
    },
  },
  share: function (message) {
    opensocial.requestShareApp(
      "VIEWER_FRIENDS",
      opensocial.newMessage(message),
      function (status) {
        if (status.hadError()) {
          console.info(status.getErrorCode());
        } else {
          console.info("share app message was sent successfully");
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
          console.info(status.getErrorCode());
        } else {
          console.info("message was sent successfully");
        }
      }
    );
  }
}
