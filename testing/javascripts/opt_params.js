var opt_params = opt_params || {};

var filter = opensocial.DataRequest.PeopleRequestFields.FILTER;
var sort_order = opensocial.DataRequest.PeopleRequestFields.SORT_ORDER;
var app_data = opensocial.DataRequest.PeopleRequestFields.APP_DATA;
var profile_details = opensocial.DataRequest.PeopleRequestFields.PROFILE_DETAILS;

var opt_params_generator = opt_params_generator || {};
opt_params_generator.filter = {
  all: function () {
    opt_params[filter] = null;
  },
  topFriends: function () {
    opt_params[filter] = opensocial.DataRequest.FilterType.TOP_FRIENDS;
  },
  hasApp: function () {
    opt_params[filter] = opensocial.DataRequest.FilterType.HAS_APP;
  },
  isFriendWidth: function () {
    opt_params[filter] = opensocial.DataRequest.FilterType.IS_FRIENDS_WITH;
  }
}

opt_params_generator.sort_order = {
  topFriends: function () {
    opt_params[sort_order] = opensocial.DataRequest.SortOrder.TOP_FRIENDS;
  },
  name: function () {
    opt_params[sort_order] = opensocial.DataRequest.SortOrder.NAME;
  }
}

opt_params_generator.app_data = function (keys) {
  opt_params[app_data] = [];
  keys = keys.split(",");
  for (i=0; i<keys.length; i++) {
    var key = keys[i].replace(/^\s+|\s+$/g, "");
    opt_params[app_data].push(key);
  }
  console.info(opt_params[app_data])
}

opt_params[profile_details] = [];
opt_params_generator.profile_details = {
  set_or_remove: function (field, checked) {
    if (checked) {
      opt_params[profile_details].push(field);
    } else {
      new_profile_details = [];
      for (i=0; i<opt_params[profile_details].length; i++) {
        if (opt_params[profile_details][i] != field)
          new_profile_details.push(opt_params[profile_details][i]);
      }
      opt_params[profile_details] = new_profile_details;
    }
    console.info(opt_params[profile_details])
  },
  aboutMe: function (checked) {
    opt_params_generator.profile_details.set_or_remove(opensocial.Person.Field.ABOUT_ME, checked);
  },
  age: function (checked) {
    opt_params_generator.profile_details.set_or_remove(opensocial.Person.Field.AGE, checked);
  },
  dateOfBirth: function (checked) {
    opt_params_generator.profile_details.set_or_remove(opensocial.Person.Field.DATE_OF_BIRTH, checked);
  },
  gender: function (checked) {
    opt_params_generator.profile_details.set_or_remove(opensocial.Person.Field.GENDER, checked);
  },
  jobs: function (checked) {
    opt_params_generator.profile_details.set_or_remove(opensocial.Person.Field.JOBS, checked);
  },
  languagesSpoken: function (checked) {
    opt_params_generator.profile_details.set_or_remove(opensocial.Person.Field.LANGUAGES_SPOKEN, checked);
  },
  networkPresence: function (checked) {
    opt_params_generator.profile_details.set_or_remove(opensocial.Person.Field.NETWORK_PRESENCE, checked);
  },
  nickname: function (checked) {
    opt_params_generator.profile_details.set_or_remove(opensocial.Person.Field.NICKNAME, checked);
  },
  profileUrl: function (checked) {
    opt_params_generator.profile_details.set_or_remove(opensocial.Person.Field.PROFILE_URL, checked);
  },
  status: function (checked) {
    opt_params_generator.profile_details.set_or_remove(opensocial.Person.Field.STATUS, checked);
  },
  timeZone: function (checked) {
    opt_params_generator.profile_details.set_or_remove(opensocial.Person.Field.TIME_ZONE, checked);
  },
  urls: function (checked) {
    opt_params_generator.profile_details.set_or_remove(opensocial.Person.Field.URLS, checked);
  }
}
