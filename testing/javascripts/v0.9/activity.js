var os9 = os9 || {};

os9.activity = {
  list: function (idspec, location) {
    osapi.activities.get(idspec).execute(function (response){
      var activities = response.get('activities');
      console.info(response);
      if (activities.hadError()) {
        alert(activities.getErrorMessage());
      } else {
        var activity_list = $('<div class="activities" />');
        activities.getData().each(function (activity) {
          var title = activity.getField(opensocial.Activity.Field.TITLE);
          var media_items = activity.getField(opensocial.Activity.Field.MEDIA_ITEMS);
          if (media_items) {
            var media = $('<div class="media_items" />');
            media_items.each(function (media_item) {
              var src = media_item.getField(opensocial.MediaItem.Field.URL);
              media.append(
                $('<div class="media_item" />').append($('<img />').attr('src', src))
              );  
            });
          }
          $('<div class="activity" />').append($('<div class="title">').append(title)).append(media)
          .appendTo(activity_list);
        });
        $(location).after(activity_list);
        gadgets.window.adjustHeight();
      }
    });
  },
  create: function (title, body, url, location) {
    osapi.activities.create({
      userId: '@viewer',
      activity: {
        title: title,
        body: body,
        url: url
      }
    }).execute(function (status) {
      if (status.hadError()) {
        $(location).after(
          $('<div class="failure" />').append('failed')
        );
      } else {
        $(location).after(
          $('<div class="success" />').append('suceeded')
        );
      }  
      gadgets.window.adjustHeight();
    });
  }
};