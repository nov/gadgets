var rest = rest || {};
var _location;

rest.activity = {
  list: function (idspec, location) {
    var url = "http://localhost:8080/social/rest/activities/" + idspec.user_id + "/" + idspec.group_id;
    var params = {};
    _location = location;
    gadgets.io.makeRequest(url, rest.activity.callback, params);
  },
  callback: function (response) {
    console.info(response);
    if (response.rc != 200) {
      alert(response.rc + "error");
    } else {
      var _data = eval("(" + response.data + ")");
      var activity_list = $('<div class="activities" />');
      if (_data.totalResults > 1) {
        for (i=0; i<_data.entry.length; i++) {
          var activity = _data.entry[i];
          $('<div class="activity" />')
          .append($('<div class="title">').append(activity.title))
          .appendTo(activity_list);
        }
      } else {
        var activity = _data.entry;
        $('<div class="activity" />')
        .append($('<div class="title">').append(activity.title))
        .appendTo(activity_list);
      }
      $(_location).after(activity_list);
      gadgets.window.adjustHeight();
    }
  }
};