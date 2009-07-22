var smart = smart || {};

smart.study_results = {
  json: function (application) {
    return smart.api_base_url + "/users/" + smart.username + "/study_results/" + application + ".json?per_page=1";
  },
  load: function () {
    $.getJSON(smart.study_results.json("iknow"), null, function (json) {
      smart.study_results.record.iknow(json.total_summary);
      smart.study_results.display.iknow(json.total_summary);
      $(window).adjustHeight();
    });
    $.getJSON(smart.study_results.json("dictation"), null, function (json) {
      smart.study_results.record.dictation(json.total_summary);
      smart.study_results.display.dictation(json.total_summary);
      $(window).adjustHeight();
    });
    $.getJSON(smart.study_results.json("brainspeed"), null, function (json) {
      smart.study_results.record.brainspeed(json.total_summary);
      smart.study_results.display.brainspeed(json.total_summary);
      $(window).adjustHeight();
    });
    smart.study_results.ranking("iknow_completed");
    $(window).adjustHeight();
  },
  display: {
    iknow: function (total) {
      $("#study_results .iknow .studied").append(total.studied);
      $("#study_results .iknow .completed").append(total.completed);
    },
    dictation: function (total) {
      $("#study_results .dictation .skill_level").append(total.skill_level);
      $("#study_results .dictation .completed").append(total.completed);
    },
    brainspeed: function (total) {
      $("#study_results .brainspeed .best_speed").append(total.best_speed);
      $("#study_results .brainspeed .best_score").append(total.best_score);
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
    }
  },
  ranking: function (field) {
    $.getData("/appdata/@viewer/@friends", {fields: field + ",username"}, function (friends_data) {
      $.getData("/appdata/@viewer/@self", {fields: field + ",username"}, function (viewer_data) {
        var data = [];
        $.each(friends_data, function (id, pref) {
          $.each(pref, function (key, value) {
            if (key != "username") {
              data.push({id: id, username: pref.username, value: value});
            }
          });
        });
        $.each(viewer_data, function (id, pref) {
          $.each(pref, function (key, value) {
            if (key != "username") {
              data.push({id: id, username: pref.username, value: value});
            }
          });
        });
        data.sort(function (a, b) {
          return(b.value - a.value);
        });
        for (i=0; i<data.length; i++) {
          $('<div class="rank' + i + '" />')
          .append((i+1) + "位 : " + data[i].username + " (" + data[i].value + ")")
          .appendTo("#ranking");
        }
        console.info(data);
      });
    });
  }
}