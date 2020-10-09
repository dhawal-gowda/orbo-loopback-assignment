let modelConfig = require('../model-config.json');
var async = require('async');
module.exports = function (server) {
  var remotes = server.remotes();
  // modify all returned values
  var Members = server.models.MemberAuth;


  remotes.after('MemberAuth.makeAdmin', async function (ctx, next) {

    console.log("reached inside signn up +++ ", ctx.result)
    let responseFromMakeAdmin = ctx.result.result;
    console.log("responseFromSignup + ", responseFromMakeAdmin)



    var userFound = await createDefaultMember(responseFromMakeAdmin.username);

    if (userFound) {
      ctx.result = {};
      ctx.result.status = 200;
      ctx.result.message = `Admin Role Successfully Assigned To ${responseFromMakeAdmin.username} !!!`

    } else {
      ctx.result = {};
      ctx.result.status = 500;
      ctx.result.message = `No User Found !!!`
    }
    next()
  });

  function createDefaultMember(username) {

    return new Promise(resolve => {
      var Members = server.models.MemberAuth;
      var Role = server.models.Role;
      var RoleMapping = server.models.RoleMapping;

      Members.find(
        {
          username: username
        }
        ,
        function (err, users) {


          console.log("users ++++ ", users);
          //create the admin role
          const getUser = users.filter((data) => {
            if (data.username == username) {
              return data;
            }
          })

          console.log("getUser +++++ ", getUser);

          if (getUser.length > 0) {
            Role.create({
              name: 'admin'
            }, function (err, role) {


              //make bob an admin
              role.principals.create({
                principalType: RoleMapping.USER,
                principalId: users[0].id
              }, function (err, principal) {
                resolve(true)
                console.log("principal +++++ ", principal);


              });
            });


          } else {
            resolve(false)

          }

        }
      );
    })


  }

  remotes.after('MemberAuth.signUp', function (ctx, next) {

    console.log("reached inside signn up +++ ", ctx.result)
    let responseFromSignup = ctx.result.result;
    console.log("responseFromSignup + ", responseFromSignup)
    var mongoDataSource = server.dataSources.MemberAuth;

    async.parallel({
      members: async.apply(createDefaultMember)
    }, function (err, results) {
      // if (err) throw err;
      console.log("signed up successfully !!!!")
    });

    function createDefaultMember(cb) {


      var Members = server.models.MemberAuth;
      var Role = server.models.Role;
      var RoleMapping = server.models.RoleMapping;

      Members.create([
        {
          username: responseFromSignup.username, name: responseFromSignup.name, email: responseFromSignup.email,
          password: responseFromSignup.password, role: responseFromSignup.role
        }
      ],
        function (err, users) {
          if (err) return cb(err);

          console.log("users ++++ ", users);
          //create the admin role
          Role.create({
            name: 'member'
          }, function (err, role) {
            if (err) cb(err);

            //make bob an admin
            role.principals.create({
              principalType: RoleMapping.USER,
              principalId: users[0].id
            }, function (err, principal) {
              console.log("principal +++++ ", principal);
              if (err) {
                cb(err);
              } else {
                const responseToSend = {};
                responseToSend.status = 200;
                responseToSend.message = "User Created Successfully !!!"
                cb(responseToSend);
              }

            });
          });
        }
      );

      // const responseToSend = {};
      // responseToSend.status = 200;
      // responseToSend.message = "User Created Successfully !!!"
      // cb(responseToSend);

    }
    ctx.result = {};
    ctx.result.status = 200;
    ctx.result.message = "User Created Successfully !!!"
    next()
  });

  remotes.after('MemberAuth.login', async function (ctx, next) {

    ctx.result = {
      data: ctx.result
    };

    console.log("data id +++++++ ", ctx.result.data.userId);
    const data = await test(server, ctx.result.data.userId);
    console.log("data in parent ++++ ", data)
    const { id, created, userId } = ctx.result.data;
    const { name, username, email, role } = data;

    ctx.result = {};
    ctx.result.accessToken = id;
    ctx.result.createdAt = created;
    ctx.result.userId = userId;
    ctx.result.name = name;
    ctx.result.username = username;
    ctx.result.email = email;
    ctx.result.role = role;

    console.log("role +++", role)

    console.log("ctx +++ ", ctx);

  });
};

function test(server, userId) {
  var Members = server.models.MemberAuth;
  return new Promise((resolve, reject) => {
    Members.findById(userId, (err, data) => {
      console.log("data +++++++ ", data);
      // ctx.result = {};
      // ctx.result.username = data.username;
      // ctx.result.name = data.name;
      // ctx.result.email = data.email;
      // ctx.result.role = data.role;
      // ctx.result.accessToken =  ctx.result.id

      resolve(data);
    })
  })
}
