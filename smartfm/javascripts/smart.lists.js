var smart = smart || {};

smart.lists = {
  json: function () {
    return smart.api_base_url + "/users/" + smart.username + "/lists.json?per_page=" + smart.per_page;
  },
  load: function () {
    $.getJSON(smart.lists.json(), null, function (lists) {
      $('#lists').html('');
      if (lists) {
        $.each(lists, function () {
          smart.lists.display(this);
        });
      }
      $(window).adjustHeight();
    });
  },
  display: function (list) {
    list.square_icon = list.square_icon || 'http://smart.fm/images/icon_free_list.gif';
/*    var icon = $('<div class="icon" />').append(
      $('<a target="_blank" />').attr('href', list.href).append(
        $('<img width="60" height="60" />').attr('src', list.square_icon).append('alt', list.title)
      )
    );*/
    var icon = $('<div class="icon" />').append(
      $('<a target="_blank" />').attr('href', list.href).append($('<img width="60" height="60" />').attr('src', list.square_icon))
    );
    var title = $('<div class="title" />').append(
      $('<a target="_blank" />').attr('href', list.href).append(list.title)
    );
    $('<div class="list clearfix" />')
    .append(icon).append(title).append(smart.lists.launchers(list))
    .appendTo('#lists');
  },
  launchers: function (list) {
    var launchers = $('<div class="launchers clearfix" />');
    var iknow      = '<div class="iknow_launcher launch_button_disable"></div>';
    var dictation  = '<div class="dictation_launcher launch_button_disable"></div>';
    var brainspeed = '<div class="brainspeed_launcher launch_button_disable"></div>';
    var iknow_progress = '';
    var dictation_progress = '';
    if (list.iknow) {
      iknow = smart.lists.launcher('iknow', list.id);
      iknow_progress = $('<div class="progress" />').append($('<div class="completed" />').attr('style', 'width:' + list.iknow.progress/2 + 'px').append($('<div class="caption" />').append(list.iknow.progress + '%')));
    }
    if (list.dictation) {
      dictation = smart.lists.launcher('dictation', list.id);
      dictation_progress = $('<div class="progress" />').append($('<div class="completed" />').attr('style', 'width:' + list.dictation.progress/2 + 'px').append($('<div class="caption" />').append(list.dictation.progress + '%')));
    }
    if (list.brainspeed) {
      brainspeed = smart.lists.launcher('brainspeed', list.id);
    }
    launchers.append(iknow).append(iknow_progress).append(dictation).append(dictation_progress).append(brainspeed);
    return launchers;
  },
  launcher: function (application, list_id) {
    var icon = '<div class="' + application + '_launcher launch_button"></div>';
    var width = 980;
    var height = 720;
    if (application == 'brainspeed') height = 600;
    var onclick = 'return startSWF(\'' + smart.base_url + '\', \'' + application + '\', \'&lang=' + smart.lang + '&course_id=' + list_id +'\', \'' + width + '\', \'' + height + '\');';
    var launcher = $('<a href="#" onclick ="' + onclick + '"/>').append(icon);
    return launcher;
  }
}