var smart = smart || {};

smart.activities = {
  check_last_studied_at: function () {
    var now = new Date().getTime();
    var acted_days_ago = 1000;
    if (smart.last_acted_at) acted_days_ago = parseInt((now - smart.last_acted_at)/86400/1000);
    if (acted_days_ago < 1) return;
    var studied_days_ago = parseInt((now - smart.last_studied_at)/86400/1000);
    if (studied_days_ago < 2) {
      $.postData('/activities/@viewer/@self', {
        title: smart.viewer.displayName + ' studied on smart.fm. Are you?'
      }, function () {
        $.postData('/appdata/@viewer/@self', {last_acted_at: now}, function () {
          smart.last_acted_at = now;
        });
      });
    } else if (studied_days_ago > 6) {  
      $.postData('/activities/@viewer/@self', {
        title: 'Recently, ' + smart.viewer.nickname + ' isn\'t studying on smart.fm... Poke ' + smart.viewer.nickname + '!!'
      }, function () {
        $.postData('/appdata/@viewer/@self', {last_acted_at: now}, function () {
          smart.last_acted_at = now;
        });
      });
    }
  }
}