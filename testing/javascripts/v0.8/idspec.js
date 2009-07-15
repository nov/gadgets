var os8 = os8 || {};

os8.idspec = {
  owner: opensocial.newIdSpec({'userId':'OWNER', 'groupId':'SELF'}),
  owner_friends: opensocial.newIdSpec({'userId':'OWNER', 'groupId':'FRIEND'}),
  viewer: opensocial.newIdSpec({'userId':'VIEWER', 'groupId':'SELF'}),
  viewer_friends: opensocial.newIdSpec({'userId':'VIEWER', 'groupId':'FRIEND'})
};