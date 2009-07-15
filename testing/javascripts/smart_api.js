var smart = smart || {};

smart.api = {
  base_url : "http://api.smart.fm/",
  oauth_params : function () {
    var params = {};
    params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
    params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.OAUTH;
    params[gadgets.io.RequestParameters.OAUTH_SERVICE_NAME] = "smart.fm";
    params[gadgets.io.RequestParameters.OAUTH_USE_TOKEN] = "always";
    params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
    return params;
  },
  sessions : function () {
    gadgets.io.makeRequest(smart.api.base_url + "sessions.json", function (response) { 
      if (response.oauthApprovalUrl) {
        var popup = shindig.oauth.popup({
          destination: response.oauthApprovalUrl,
          windowOptions: null,
          onOpen: function() {
            console.info('waiting');
          },
          onClose: function() {
            self();
          }
        });
        $('#sessions').onclick = popup.createOpenerOnClick();
        $('#approved').onclick = popup.createApprovedOnClick();
        $('#approve').show();
      } else if (response.data) {
        console.info("authorized !!");
        console.info(response);
      } else {
        var main = document.getElementById('main');
        var err = document.createTextNode('OAuth error: ' + response.oauthError + ': ' + response.oauthErrorText);
        main.appendChild(err);
        showOneSection('main');
      }
    }, smart.api.oauth_params);
  }
}
