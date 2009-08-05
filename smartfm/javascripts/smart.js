var smart = {
  owner: null,
  viewer: null,
  lang: "ja",
  base_url: "http://smart.fm",
  api_base_url: "http://api.smart.fm",
  username: null,
  per_page: null,
  ranking_by: null,
  last_studied_at: null,
  last_acted_at: null,
  features: null,
  container: {
    canvas_url: function (id) {
      if ($.container.mixi) {
        // $.pref('aid') doesn't work on mixi, though $.pref('mid') works...
        return 'http://platform001.mixi.jp/run_appli.pl?id=4424&&owner_id=' + id;
      } else if ($.container.goohome) {
        return 'http://sandbox.home.goo.ne.jp/gadget/canvas/' + id + '/' + $.pref('aid');
      }
    }
  },
  init: function (callback) {
    smart.features = smart.features || callback;
    $.getData('/people/@owner/@self', {}, function(people) {
      $.each(people, function (){
        smart.owner = this;
        $.getData('/people/@viewer/@self', {}, function(people) {
          $.each(people, function (){
            smart.viewer = this;
            if (smart.viewer.isOwner) {
              smart.prefs.enable();
            } else {
              smart.messages.enable();
            }
            $.getData("/appdata/@owner/@self", {fields: "username,per_page,ranking_by,last_studied_at,last_acted_at"}, function (data) {
              $.each(data, function (id, prefs) {
                smart.username = prefs.username;
                smart.per_page = prefs.per_page || 5;
                smart.ranking_by = prefs.ranking_by || 'iknow_studied';
                smart.last_studied_at = prefs.last_studied_at || 1222786800000; /* birthday of smart.fm (iKnow!) */
                smart.last_acted_at = prefs.last_acted_at;
                $("#username").val(smart.username);
                $("#per_page").val(smart.per_page);
                $('#ranking_by').val(smart.ranking_by);
              });
              if (!smart.username) {
                $('#sidebar').hide();
                smart.prefs.open();
              } else {
                smart.features();
              }
            });
          });
        });
      });
    });
  }
}
