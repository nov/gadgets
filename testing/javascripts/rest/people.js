var rest = rest || {};
var _location;

rest.people = {
  location: null,
  list: function (idspec, location) {
    var url = "http://localhost:8080/social/rest/people/" + idspec.user_id + "/" + idspec.group_id;
    var params = {};
    _location = location;
    gadgets.io.makeRequest(url, rest.people.callback, params);
  },
  callback: function (response) {
    console.info(response);
    if (response.rc != 200) {
      alert(response.rc + "error");
    } else {
      var _data = eval("(" + response.data + ")");
      var people_list = $('<div class="people" />');
      if (_data.totalResults > 1) {
        for (i=0; i<_data.entry.length; i++) {
          var person = _data.entry[i];
          $('<div class="person" />')
          .append($('<span class="id" />').append(person.id).append(" :: "))
          .append($('<span class="name" />').append(person.name.formatted))
          .append($('<span class="thumbnail" />').append($('<img />').attr('src', person.thumbnail)))
          .appendTo(people_list);
        }
      } else {
        var person = _data.entry;
        $('<div class="person" />')
        .append($('<span class="id" />').append(person.id).append(" :: "))
        .append($('<span class="name" />').append(person.name.formatted))
        .append($('<span class="thumbnail" />').append($('<img />').attr('src', person.thumbnail)))
        .appendTo(people_list);
      }
      $(_location).after(people_list);
      gadgets.window.adjustHeight();
    }
  }
};