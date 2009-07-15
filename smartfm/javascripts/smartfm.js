var Smartfm = function() {
  this.username = $.pref('username');
  this.per_page = $.pref('per_page');
};

Smartfm.prototype = {
  lang: 'ja',
  username: null,
  per_page: null,
  base_url: 'http://smart.fm',
  api_base_url: 'http://api.smart.fm',
  loadProfile: function() {
    var loader = this;
    $.getJSON(this.myProfile(), null, function(json) {
      loader.displayProfile(json);
    });
  },
  loadLists: function(display_mode) {
    var loader = this;
    loader.display_mode = display_mode;
    $.getJSON(this.myLists(), null, function(json) {
      $.each(json, function() {
        loader.displayList(this);
      });
    });
  },
  displayProfile: function(user) {
    // setup user profile
    var icon_img_url = 'http://smart.fm/images/profile_medium.png';
    if (user.profile.icon_url) {
      icon_img_url = user.profile.icon_url;
    }
    var icon_img = $('<img width="60" />').attr('src', icon_img_url).append('alt', user.profile.name);
    icon_link = $('<a target="_blank" />').attr('href', 'http://smart.fm/users/' + user.username).append(icon_img);
    var icon = $('<div class="icon" />').append(icon_link);
    var name = $('<h2 class="name" />').append(user.profile.name);
    var description = $('<div class="description clearfix" />').append(user.profile.description);

    // display
    var clearfix = $('<div class="clearfix" />');
    $('<div class="user" />')
      .append(clearfix.append(icon).append(name))
      .append(description)
      .appendTo('#user');
    $(window).adjustHeight();
  },
  displayList: function(list) {
    // setup list information
    var icon_img_url = 'http://smart.fm/images/icon_free_list.gif'
    if (list.square_icon) {
      icon_img_url = list.square_icon;
    }
    var icon_img = $('<img width="60" height="60" />').attr('src', icon_img_url).append('alt', list.title);
    icon_link = $('<a target="_blank" />').attr('href', 'http://smart.fm/lists/' + list.id).append(icon_img);
    var icon = $('<div class="icon" />').append(icon_link);
    var title_link = $('<a target="_blank" />').attr('href', 'http://smart.fm/lists/' + list.id).append(list.title);
    if (this.display_mode=='detail') {
      var title = $('<h3 class="title" />').append(title_link);
      var description = $('<div class="description" />').append(list.description);
    } else {
      var title = $('<div class="title" />').append(title_link);
      var description = '';
    }

    // setup launchers
    var iknow      = '<div class="iknow_launcher launch_button_disable"></div>';
    var dictation  = '<div class="dictation_launcher launch_button_disable"></div>';
    var brainspeed = '<div class="brainspeed_launcher launch_button_disable"></div>';
    if (list.iknow) {
      iknow = this.launcher('iknow', list.id);
    }
    if (list.dictation) {
      dictation = this.launcher('dictation', list.id);
    }
    if (list.brainspeed) {
      brainspeed = this.launcher('brainspeed', list.id);
    }
    var launchers = $('<div class="launchers clearfix" />').append(iknow).append(dictation).append(brainspeed);

    // display
    var clearfix = $('<div class="clearfix" />');
    if (this.display_mode=='detail') {
      $('<div class="list clearfix" />')
        .append(title)
        .append(clearfix.append(icon).append(launchers))
        .append(description)
        .appendTo('#lists');
    } else {
      $('<div class="list clearfix" />')
        .append(clearfix.append(icon).append(title).append(launchers))
        .append(description)
        .appendTo('#lists');
    }
    $(window).adjustHeight();
  },
  myProfile: function() {
    return this.jsonUrl('/users/' + this.username);
  },
  myLists: function() {
    if (this.username) {
      return this.jsonUrl('/users/' + this.username + '/lists');
    } else {
      return this.jsonUrl('/lists');
    }
  },
  jsonUrl: function(path) {
    return this.api_base_url + path + '.json?per_page=' + this.per_page;
  },
  launcher: function(application, list_id) {
    var icon = '<div class="' + application + '_launcher launch_button"></div>';
    if (application=='brainspeed') {
      var onclick = 'return startSWF(\'' + this.base_url + '\', \'' + application + '\', \'&lang=' + this.lang + '&course_id=' + list_id +'\', \'980\', \'600\');';
    } else {
      var onclick = 'return startSWF(\'' + this.base_url + '\', \'' + application + '\', \'&lang=' + this.lang + '&course_id=' + list_id + '\', \'980\', \'720\');';
    }
    return $('<a href="#" onclick ="' + onclick + '"/>').append(icon);
  }
}