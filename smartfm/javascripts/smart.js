var smart = {
  lang: "ja",
  base_url: "http://smart.fm",
  api_base_url: "http://api.smart.fm",
  username: $.pref('username'),
  per_page: $.pref('per_page') || 5,
  features: null,
  init: function (callback) {
    smart.features = smart.features || callback;
    if (!gadgets.util.hasFeature('setprefs')) {
      $.getData('/appdata/@viewer/@self', {fields: 'username'}, function (data) {
        $.each(data, function (id, pref) {
          smart.username = pref.username;
          if (!smart.username || smart.usename == '') {
            $('#pref').show();
          } else {
            smart.features();
          }
        });
      });
    } else {
      smart.features();
    }
  },
  setpref: function (pref) {
    $('#pref').hide();
    smart.username = pref.username.value;
    if (gadgets.util.hasFeature('setprefs')) {
      $.pref('username', smart.username);
    } else {
      $.postData('/appdata/@viewer/@self', {username: smart.username});
    }
    smart.init();
  }
}