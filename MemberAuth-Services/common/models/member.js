'use strict';

module.exports = function(Member) {
  Member.on('dataSourceAttached', function (obj) {
    var find = Member.find;
    var cache = {};

    Member.findOne = function (filter, options, cb) {
      var key = '';
      if (filter) {
        key = JSON.stringify(filter);
      }
      var cachedResults = cache[key];
      const response = {};
      response.status = 1;
      response.message = "Dhawal is a machine"
      if (cachedResults) {
        console.log('serving from cache');
        process.nextTick(function () {
          cb(null, response);
        });
      } else {
        console.log('serving from db');
        find.call(Member, function (err, results) {
          if (!err) {
            cache[key] = results;
          }

          // after login check the role and then decide wehther to show the make admin api or not
          // Note.disableRemoteMethodByName('create');
          const response = {};
          response.status = 1;
          response.message = "Dhawal is a machine"
          cb(err, response);
        });
      }
    };
  });
};
