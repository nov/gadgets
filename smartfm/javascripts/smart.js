var smart = {
  lang: "ja",
  base_url: "http://smart.fm",
  api_base_url: "http://api.smart.fm",
  username: $.pref("username"),
  per_page: $.pref("per_page") || 5,
  features: null,
  init: function (callback) {
    smart.features = smart.features || callback;
    if (!gadgets.util.hasFeature("setprefs")) {
      $.getData("/appdata/@viewer/@self", {fields: "username"}, function (data) {
        $.each(data, function (id, pref) {
          smart.username = pref.username;
        });
        if (!smart.username || smart.usename == "") {
          $("#pref").show();
        } else {
          smart.features();
        }
      });
    } else {
      smart.features();
    }
  },
  setpref: function (pref) {
    smart.username = pref.username.value;
    if (gadgets.util.hasFeature("setprefs")) {
      $.pref("username", smart.username);
    } else {
      $.postData("/appdata/@viewer/@self", {username: smart.username});
    }
    $("#pref").hide();
    smart.init();
  },
  share: function (message) {
    opensocial.requestShareApp(
      "VIEWER_FRIENDS",
      opensocial.newMessage(message),
      function(status) {
        if (status.hadError()) {
          console.info(status.getErrorCode());
        } else {
          console.info("share app message was sent successfully");
        }
      }
    );
    
  }
}
