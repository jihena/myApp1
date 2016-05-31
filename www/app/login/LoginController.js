appContext.controller('LoginController', function($scope, $state,  $ionicPlatform, LoginFactory, ionicToast){

    // for opening db:
    var db = null;
    $ionicPlatform.ready(function() {
        /**
         * create/open DB
         */
        if (window.cordova) {// device
            db = window.sqlitePlugin.openDatabase({name : "emergency" , androidDatabaseImplementation: 2, location: 1});
        } else {// browser
            db = window.openDatabase("emergency", '1', 'desc', 1024 * 1024 * 5);
        }
    });

    $scope.signin = function(user) {
        console.warn(user);
        if (!user) {
            ionicToast.show('Veuillez remplir tout les champs', 'top', false, 2500);
        } else if(!user.email || user.email =="undefined" || ! validateEmail(user.email) )  {
            ionicToast.show('Veuillez introduire un email valide ', 'top', false, 2500);
        } else if (!user.password || user.password =="undefined") {
            ionicToast.show('Veuillez introduire un mot de passe', 'top', false, 2500);
        }else if (user.password.length < 3) {
          ionicToast.show('Veuillez introduire un mot de passe valide', 'top', false, 2500);
        }else{
            LoginFactory.login(user.email, user.password).success(function(data, status, headers, config ){
                    switch (data.response) {
                             case "not_exist":
                                ionicToast.show('cet email nexiste pas', 'top', false, 2500);
                                 break;
                             case "wrong_password":
                                ionicToast.show('password incorrecte', 'top', false, 2500);
                                 break;
                             case "NOT_ENABLED":
                                ionicToast.show('forbidden account', 'top', false, 2500);
                                 break;
                             case "NOK":
                                 ionicToast.show('email ou password non valide', 'top', false, 2500);
                                 break;
                             default:
                                  LoginFactory.createIdentifiantTable(db).then(function(result){
                                      console.log('table created');
                                          LoginFactory.setCredentials(db,user.email,user.password,data).then(function(result){
                                              $state.go('app.incident-list') ;
                                              console.log("success");
                                          },function(reason){
                                              ionicToast.show('Une erreur est survenue11111', 'top', false, 2500);
                                          });
                                  },function(){
                                      ionicToast.show('Une erreur est survenue22222', 'top', false, 2500);
                                  });
                    break;
                }
            }).error(function(data, status, headers, config ){
                ionicToast.show('Une erreur est survenue33333', 'top', false, 2500);
            });
        };
    };

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

});
