var smart = smart || {};

smart.lists = {
  json: function () {
    return smart.api_base_url + "/users/" + smart.username + "/lists.json?per_page=" + smart.per_page;
  },
  load: function () {
    $('#lists').parents().children('.list').remove();
    $.getJSON(smart.lists.json(), null, function (lists) {
      $.each(lists, function () {
        smart.lists.display(this);
      });  
      $(window).adjustHeight();
    });
  },
  display: function (list) {
    var icon = $('<div class="icon" />').append(
      $('<a target="_blank" />').attr('href', smart.base_url +  'lists' + list.id).append(
        $('<img width="60" height="60" />')
        .attr('src', list.square_icon || 'http://smart.fm/images/icon_free_list.gif')
        .append('alt', list.title)
      )
    );
    var title = $('<div class="title" />').append(
      $('<a target="_blank" />')
      .attr('href', smart.base_url + '/lists/' + list.id)
      .append(list.title)
    );
    $('<div class="list clearfix" />').append(icon).append(title).append(smart.lists.launchers(list)).appendTo('#lists');
  },
  launchers: function (list) {
    var launchers = $('<div class="launchers clearfix" />');
    var iknow      = '<div class="iknow_launcher launch_button_disable"></div>';
    var dictation  = '<div class="dictation_launcher launch_button_disable"></div>';
    var brainspeed = '<div class="brainspeed_launcher launch_button_disable"></div>';
    if (list.iknow)
      iknow = smart.lists.launcher('iknow', list.id);
    if (list.dictation)  
      dictation = smart.lists.launcher('dictation', list.id);
    if (list.brainspeed)
      brainspeed = smart.lists.launcher('brainspeed', list.id);
    launchers.append(iknow).append(dictation).append(brainspeed);
    return launchers;
  },
  launcher: function (application, list_id) {
    var icon = '<div class="' + application + '_launcher launch_button"></div>';
    var width = 980;
    var height = 720;
    if (application == 'brainspeed')
      height = 600;
    var onclick = 'return startSWF(\'' + smart.base_url + '\', \'' + application + '\', \'&lang=' + smart.lang + '&course_id=' + list_id +'\', \'' + width + '\', \'' + height + '\');';
    var launcher = $('<a href="#" onclick ="' + onclick + '"/>').append(icon);
    return launcher;
  }
}