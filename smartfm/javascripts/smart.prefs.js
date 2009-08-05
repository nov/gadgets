var smart = smart || {};

smart.prefs = {
  set: function (prefs) {
    if (!smart.viewer.isOwner)
      return;
    var callback = function () {
      $('#sidebar').show();
      $("#pref").hide();
      smart.init();
    };
    smart.username = prefs.username.value;
    smart.per_page = prefs.per_page.value;
    smart.ranking_by = prefs.ranking_by.value;
    $.postData("/appdata/@viewer/@self", {
      username: smart.username,
      per_page: smart.per_page,
      ranking_by: smart.ranking_by
    }, callback);
  },
  enable: function () {
    $('#header .owner_menu').show('fast', function () {
      $(window).adjustHeight();
    });
  },
  open: function () {
    if (!smart.viewer.isOwner) return;
    $("#pref").show('fast', function () {
      $(window).adjustHeight();
    });
  },
  toggle: function () {
    if (!smart.viewer.isOwner) return;
    $("#pref").toggle('fast', function () {
      $(window).adjustHeight();
    });
  }
}