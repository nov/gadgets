var os8 = os8 || {};

os8.activity = {
  list: function (idspec, location) {
    $(location).parents().children(".activities").remove();
    var req = opensocial.newDataRequest();
    req.add(req.newFetchActivitiesRequest(idspec, opt_params), 'activities');
    req.send(function (response){
      console.info(response);
      var activities = response.get('activities');
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
    })
  },
  create: function (title, body, url, location) {
    var params = {};
    params[opensocial.Activity.Field.TITLE] = title;
    params[opensocial.Activity.Field.BODY] = body;
    params[opensocial.Activity.Field.URL] = url;
    var activity = opensocial.newActivity(params);
    opensocial.requestCreateActivity(activity, opensocial.CreateActivityPriority.HIGH, function (status) {
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
    })
  }
};