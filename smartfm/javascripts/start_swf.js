var app_window;
function startSWF(host, swfFile, query_string, w, h) {
  if (app_window)
    app_window.close();
  var WIDTH = 980;
  var HEIGHT = 720;
  if (w != undefined)
      WIDTH = w;
  if (h != undefined)
      HEIGHT = h;
  var url = host + '/flash?swf=' + swfFile + query_string;
  var left = (screen.availWidth - WIDTH) / 2;
  var top = (screen.availHeight - HEIGHT) / 2;
  left = left < 0 ? 0 : left;
  top = top < 0 ? 0 : top;
  app_window = window.open(url, 'iknow_session',
    "height=" + HEIGHT + ",width=" + WIDTH + ",left=" + left + ",top=" + top +
    ",toolbar=no,menubar=no" +
    ",resizable=yes,scrollbars=no,status=no,titlebar=no,top=0,left=0");
  app_window.focus();
  return false;
}

function startBrainSpeed(swfFile, query_string) {
  var WIDTH = screen.availWidth;
  var HEIGHT = screen.availHeight;
  app_window = window.open(swfFile, 'brainspeed_session',
    "height=" + HEIGHT + ",width=" + WIDTH +
    ",toolbar=no,menubar=yes" +
    ",resizable=yes,scrollbars=no,status=no,titlebar=no,top=0,left=0")
  app_window.focus();
  return false;
}

