var smart = smart || {};

smart.study_results = {
  json: function (application) {
    return smart.api_base_url + "/users/" + smart.username + "/study_results/" + application + ".json?per_page=1";
  },
  load: function () {
    $.getJSON(smart.study_results.json("iknow"), null, function (json) {
      if (smart.owner.isViewer) {
        smart.study_results.record.iknow(json.total_summary);
        smart.study_results.record.last_studied_at(json.study_results[0]);
        smart.study_results.display.iknow(json.total_summary);
      }
      smart.study_results.display.iknow(json.total_summary);
      $.getJSON(smart.study_results.json("dictation"), null, function (json) {
        if (smart.owner.isViewer) {
          smart.study_results.record.dictation(json.total_summary);
          smart.study_results.record.last_studied_at(json.study_results[0]);
          smart.study_results.display.dictation(json.total_summary);
        }
        smart.study_results.display.dictation(json.total_summary);
        smart.activities.check_last_studied_at();
        if (gadgets.util.getUrlParameters().view != 'canvas') $(window).adjustHeight(); /* somehow, this is necessary only for IEs */
      });
    });
    if (gadgets.util.getUrlParameters().view == 'canvas') {
      $.getJSON(smart.study_results.json("brainspeed"), null, function (json) {
        if (smart.owner.isViewer) smart.study_results.record.brainspeed(json.total_summary);
        smart.study_results.display.brainspeed(json.total_summary);
      });
      smart.study_results.ranking();
    }
  },
  display: {
    iknow: function (total) {
      $('#study_results .iknow .studied .score').html('');
      $("#study_results .iknow .completed .score").html('');
      $("#study_results .iknow .studied .score").append(total.studied + '');
      $("#study_results .iknow .completed .score").append(total.completed + '');
    },
    dictation: function (total) {
      $('#study_results .dictation .skill_level .score').html('');
      $("#study_results .dictation .completed .score").html('');
      $("#study_results .dictation .skill_level .score").append(total.skill_level + '');
      $("#study_results .dictation .completed .score").append(total.completed + '');
    },
    brainspeed: function (total) {
      $('#study_results .brainspeed .best_speed .score').html('');
      $("#study_results .brainspeed .best_score .score").html('');
      $("#study_results .brainspeed .best_speed .score").append(total.best_speed + '');
      $("#study_results .brainspeed .best_score .score").append(total.best_score + '');
    }
  },
  record: {
    iknow: function (total) {
      $.postData("/appdata/@viewer/@self", {iknow_studied: total.studied});
      $.postData("/appdata/@viewer/@self", {iknow_completed: total.completed});
    },
    dictation: function (total) {
      $.postData("/appdata/@viewer/@self", {dictation_skill_level: total.skill_level});
      $.postData("/appdata/@viewer/@self", {dictation_completed: total.completed});
    },
    brainspeed: function (total) {
      $.postData("/appdata/@viewer/@self", {brainspeed_best_speed: total.best_speed});
      $.postData("/appdata/@viewer/@self", {brainspeed_best_score: total.best_score});
    },
    last_studied_at: function (result, callback) {
      if (!result) return;
      var last_studied_at = Date.parse(result.date.replace(/-/g, '/'));
      if (!smart.last_studied_at || smart.last_studied_at < last_studied_at) {
        smart.last_studied_at = last_studied_at;
        $.postData("/appdata/@viewer/@self", {last_studied_at: last_studied_at});
      }
    }
  },
  ranking: function () {
    var field = smart.ranking_by;
    $.getData("/appdata/@owner/@friends", {fields: field + ",username"}, function (friends_data) {
      $.getData("/appdata/@owner/@self", {fields: field + ",username"}, function (owner_data) {
        var data = [];
        $.each(friends_data, function (id, friend) {
          $.each(friend, function (key, value) {
            if (key != "username") {
              data.push({id: id, username: friend.username, value: value});
            }
          });
        });
        $.each(owner_data, function (id, owner) {
          $.each(owner, function (key, value) {
            if (key != "username") {
              data.push({id: id, username: owner.username, value: value, isViewer: smart.owner.isViewer});
            }
          });
        });
        data.sort(function (a, b) {
          return(b.value - a.value);
        });
        var field_name = '';
        switch(field) {
          case 'iknow_studied':
            field_name = " 学習アイテム数";
            break;
          case 'iknow_completed':
            field_name = " 学習完了アイテム数";
            break;
          case 'dictation_skill_level':
            field_name = "スキルレベル";
            break;
          case 'dictation_completed':
            field_name = "完了例文数";
            break;
        }
        $('#ranking').html('');
        $('<dt />').append(field_name + "ランキング").appendTo("#ranking");
        for (i=0; i<data.length; i++) {
          var rank = i + 1;
          var klass = 'rank' + rank;
          if (rank % 2 == 0) {
            klass += " even";
          } else {
            klass += " odd";
          }
          var link = $('<a target="_top" />').attr('href', smart.container.canvas_url(data[i].id));
          if (data[i].id == smart.viewer.id) {
            if (data[i].isViewer) {
              link = $('<span class="me" />');
            } else {
              link = $('<a target="_top" class="me" />').attr('href', smart.container.canvas_url(data[i].id));
            }
          }
          $('<dd class="' + klass + '" />')
          .append(link.append(data[i].username + " (" + data[i].value + ")"))
          .appendTo("#ranking");
          if (i>=9) break;
        }
        $(window).adjustHeight();
      });
    });
  }
}