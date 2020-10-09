'use strict';

module.exports = function (Memberauth) {

  Memberauth.signUp = function (username,name,email,password,role,cb) {

    var response = {};
    response.username = username;
    response.name = name;
    response.email = email;
    response.password = password;
    response.role = role;
    cb(null, response);
  };

  Memberauth.makeAdmin = function (username,cb) {

    var response = {};
    response.username = username;
    cb(null, response);
  };
  Memberauth.remoteMethod(
    'makeAdmin', {
    http: {
      path: '/makeAdmin',
      verb: 'post'
    },
    accepts: [{ arg: 'username', type: 'string', required: true }
    ],
    returns: {
      arg: 'result',
      type: 'string'
    }
  }
  );

  Memberauth.remoteMethod('signUp', {
    http: {
      path: '/signUp',
      verb: 'post'
    },
    accepts: [{ arg: 'username', type: 'string', required: true }, { arg: 'name', type: 'string', required: true }, { arg: 'email', type: 'string', required: true },
    { arg: 'password', type: 'string', required: true }, { arg: 'role', type: 'string', required: true }
    ],
    returns: { arg: 'result', type: 'string' }
  });

};
