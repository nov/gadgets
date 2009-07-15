var smart = smart || {};

smart.study_results = {
  json: function (application) {
    return smart.api_base_url + "/users/" + smart.username + "/study_results/" + application + ".json?per_page=1";
  },
  load: function () {
    $('#scores').parents().children('.score').remove();
    $.getJSON(smart.study_results.json("iknow"), null, function (json) {
      smart.study_results.display.iknow(json.total_summary);
    });
    $.getJSON(smart.study_results.json("dictation"), null, function (json) {
      smart.study_results.display.dictation(json.total_summary);
    });
    $.getJSON(smart.study_results.json("brainspeed"), null, function (json) {
      smart.study_results.display.brainspeed(json.total_summary);
    });
  },
  display: {
    iknow: function (total) {
      $('<div id="iknow" class="score" />')
      .append($('<div class="studied" />').append(total.studied))
      .append($('<div class="completed" />"').append(total.completed))
      .appendTo('#scores');
    },
    dictation: function (total) {
      $('<div id="dictation" class="score" />')
      .append($('<div class="skill_level" />').append(total.skill_level))
      .append($('<div class="completed" />"').append(total.completed))
      .appendTo('#scores');
    },
    brainspeed: function (total) {
      $('<div id="brainspeed" class="score" />')
      .append($('<div class="best_speed" />').append(total.best_speed))
      .append($('<div class="best_score" />"').append(total.best_score))
      .appendTo('#scores');
    }
  }
}