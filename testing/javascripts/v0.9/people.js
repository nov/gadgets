var os9 = os9 || {};

os9.people = {
  list: function (idspec) {
    osapi.people.get(idspec).execute(function (people){
      if (people.hadError()) {
        alert(people.getErrorMessage());
      } else {
        var people_list = $('<div class="people" />');
        people.getData().each(function (person){
          var _person = {
            id: person.getId(),
            name: person.getDisplayName(),
            thumbnail: person.getField(opensocial.Person.Field.THUMBNAIL_URL)
          }
          $('<div class="person" />')
          .append($('<span class="id" />').append(_person.id).append(" :: "))
          .append($('<span class="name" />').append(_person.name))
          .append($('<span class="thumbnail" />').append($('<img />').attr('src', _person.thumbnail)))
          .appendTo(people_list);
        });
        $(location).after(people_list);
      }
      gadgets.window.adjustHeight();
    });
  }
}