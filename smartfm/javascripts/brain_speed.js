var BrainSpeed = function() {
  this.username = $.pref('username');
  this.updateScore();
};

BrainSpeed.prototype = {
  lang: 'ja',
  username: null,
  best_score: null,
  best_speed: null,
  base_url: 'http://smart.fm',
  api_base_url: 'http://api.smart.fm',
  display: function() {
    this.displayBestScore();
    this.displayLaunthers();
  },
  displayBestScore: function() {
    var owner = this;
    $.getData('/appdata/@owner/@self', {}, function(result) {
      $.each(result, function(user_id, data) {
        owner.best_score = data.best_score || '0';
        owner.best_speed = data.best_speed || '0';
      });
      owner.displayBadge('#owner', owner, owner);
    });
    $.getData('/appdata/@owner/@friends', {}, function(result) {
      $.each(result, function(user_id, data) {
        var competitor = {
          username  : user_id,
          best_score: data.best_score || '0',
          best_speed: data.best_speed || '0'
        };
        var win_or_lose = 
        $('<h4 />').append(win_or_lose).appendTo('#competitor');
        owner.displayBadge('#competitors', competitor, owner);
      });
    });
  },
  displayBadge: function(location, score_board, owner) {
    var badge = $('<dl class="badge clearfix" />');
    var user  = $('<dt class="user" />');
    if (score_board != owner) {
      if (score_board.best_score > owner.best_score) {
        user.append($('<span />').attr('class', 'result lose')
            .append('You lose ').append(score_board.username).append('..'));
      } else if (score_board.best_score < owner.best_score) {
        user.append($('<span />').attr('class', 'result win')
            .append('You won ').append(score_board.username).append('!!'));
      } else {
        user.append($('<span />').attr('class', 'result draw')
            .append('You and ').append(score_board.username).append(' are tie.'));
      }
    } else {
      user.append('Your record!');
    }
    badge.append(user)
      .append($('<dd class="brainspeed" />')
        .append($('<dl class="metric" />')
          .append($('<dd class="score" />').append(score_board.best_score))
          .append($('<dt class="caption" />').append('Best Score')))
        .append($('<dl class="metric" />')
          .append($('<dd class="score />"').append(score_board.best_speed))
          .append($('<dt class="caption" />').append('Best Speed')))).appendTo(location);
    $(window).adjustHeight();
  },
  displayLaunthers: function(display_mode) {
    var loader = this;
    loader.display_mode = display_mode;
    $.getJSON(this.myListsUrl(), null, function(json) {
      $.each(json, function() {
        loader.displayLaunther(this);
      });
      $(window).adjustHeight();
    });
  },
  displayLaunther: function(list) {
    // setup list information
    var icon_img_url = 'http://smart.fm/images/icon_free_list.gif'
    if (list.square_icon) {
      icon_img_url = list.square_icon;
    }
    var icon_img = $('<img width="60" height="60" />').attr('src', icon_img_url).append('alt', list.title);
    icon_link = $('<a target="_blank" />').attr('href', 'http://smart.fm/lists/' + list.id).attr('alt', list.title).attr('title', list.title).append(icon_img);
    var icon = $('<div class="icon" />').append(icon_link);
    var onclick = 'return startSWF(\'' + this.base_url + '\', \'brainspeed\', \'&lang=' + this.lang + '&course_id=' + list.id +'\', \'980\', \'600\');';
    var launcher = $('<a href="#" onclick ="' + onclick + '"/>').append(icon);

    // display
    $('<div class="launcher" />').append(launcher).appendTo('#lists');
  },
  updateScore: function() {
    var uploader = this;
    $.getData('/appdata/@viewer/@self', {}, function(result) {
      $.each(result, function(user_id, data) {
        uploader.best_score = data.best_score;
      });
      $.getJSON(uploader.studyResultUrl('brainspeed'), null, function(json) {
        var _best_score = json.total_summary.best_score;
        var _best_speed = json.total_summary.best_speed;
        if (uploader.best_score < _best_score || uploader.best_speed < _best_speed) {
          $.postData('/appdata/@viewer/@self', {best_score: _best_score, best_speed: _best_speed}, function() {
             uploader.best_score = _best_score;
             $.postData('/activities/@viewer/@self', {title: 'broke his record! Challenge him!!'}, function() {});
          });
        }
      });
    });
  },
  studyResultUrl: function(application) {
    return this.jsonUrl('/users/' + this.username + '/study_results/' + application)
  },
  myListsUrl: function() {
    return this.jsonUrl('/users/' + this.username + '/lists');
  },
  jsonUrl: function(path) {
    return this.api_base_url + path + '.json';
  }
};