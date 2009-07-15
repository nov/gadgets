var os8 = os8 || {};

os8.people = {
  list: function (idspec, location) {
    $(location).parents().children(".people").remove();
    var req = opensocial.newDataRequest();
    req.add(req.newFetchPeopleRequest(idspec, opt_params), 'people');
    req.send(function (response){
      var people = response.get('people');
      if (people.hadError()) {
        alert(people.getErrorMessage());
      } else {
        var people_list = $('<div class="people" />');
        people.getData().each(function (person){
          console.info(person)
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