var async = require('async');

module.exports = function (app) {

  var mongoDataSource = app.dataSources.MemberAuth;

  async.parallel({
    members: async.apply(createDefaultMember)
  }, function (err, results) {
    // if (err) throw err;
    console.log("super admin created successfully !!!!")
  });

  function createDefaultMember(cb) {
    mongoDataSource.automigrate('MemberAuth', function (err) {
      if (err) return cb(err);
      var Members = app.models.MemberAuth;
      var Role = app.models.Role;
      var RoleMapping = app.models.RoleMapping;

      Members.create([
        { username: 'dhawal', name: "Dhawal Gowda", email: 'dhawalgowda56@gmail.com', password: 'dhawal', role: "superAdmin" }
      ],
        function (err, users) {
          if (err) return cb(err);

          //create the admin role
          Role.create({
            name: 'superAdmin'
          }, function (err, role) {
            if (err) cb(err);

            //make bob an admin
            role.principals.create({
              principalType: RoleMapping.USER,
              principalId: users[0].id
            }, function (err, principal) {
              console.log("principal +++++ ", principal);
              cb(err);
            });
          });
        }
      );

    });
  }
}
