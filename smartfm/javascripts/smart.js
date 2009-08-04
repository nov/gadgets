var smart = {
  owner: null,
  viewer: null,
  lang: "ja",
  base_url: "http://smart.fm",
  api_base_url: "http://api.smart.fm",
  username: $.pref("username"),
  per_page: $.pref("per_page") || 5,
  ranking_by: $.pref("ranking_by") || "iknow_studied",
  features: null,
  init: function (callback) {
    smart.features = smart.features || callback;
    $.getData('/people/@owner/@self', {}, function(people) {
      $.each(people, function (){
        smart.owner = this;
      });
    });
    $.getData('/people/@viewer/@self', {}, function(people) {
      $.each(people, function (){
        smart.viewer = this;
        if (smart.viewer.isOwner)
          smart.pref.enable();
      });
    });
    if (!gadgets.util.hasFeature("setprefs")) {
      $.getData("/appdata/@owner/@self", {fields: "username, per_page, ranking_by"}, function (data) {
        $.each(data, function (id, pref) {
          smart.username = pref.username;
          smart.per_page = pref.per_page || 5;
          smart.ranking_by = pref.ranking_by || 'iknow_studied';
          $("#username").val(smart.username);
          $("#per_page").val(smart.per_page);
          $('#ranking_by').val(smart.ranking_by);
        });
        if (!smart.username || smart.usename == "") {
          $('#sidebar').hide();
          smart.pref.open();
        } else {
          smart.features();
        }
      });
    } else {
      smart.features();
    }
  },
  pref: {
    set: function (pref) {
      if (!smart.viewer.isOwner)
        return;
      var callback = function () {
        $('#sidebar').show();
        $("#pref").hide();
        smart.init();
      };
      smart.username = pref.username.value;
      smart.per_page = pref.per_page.value;
      smart.ranking_by = pref.ranking_by.value;
      if (gadgets.util.hasFeature("setprefs")) {
        $.pref({
          username: smart.username,
          per_page: smart.per_page,
          ranking_by: smart.ranking_by
        });
        callback();
      } else {
        $.postData("/appdata/@viewer/@self", {
          username: smart.username,
          per_page: smart.per_page,
          ranking_by: smart.ranking_by
        }, callback);
      }
    },
    enable: function () {
      $('#header .menu').show('fast', function () {
        $(window).adjustHeight();
      });
    },
    open: function () {
      if (!smart.viewer.isOwner)
        return;
      $("#pref").show('fast', function () {
        $(window).adjustHeight();
      });
    },
    toggle: function () {
      if (!smart.viewer.isOwner)
        return;
      $("#pref").toggle('fast', function () {
        $(window).adjustHeight();
      });
    }
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
