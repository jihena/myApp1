appContext.controller('LoginController', function($scope, $state, $rootScope, $ionicPlatform, LoginFactory, AddFactory, ionicToast,$ionicLoading){

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
        if (!user) {
            ionicToast.show('Veuillez remplir tout les champs', 'top', false, 2500);
        } else if(!user.email || user.email =="undefined" || ! validateEmail(user.email) )  {
            ionicToast.show('Veuillez introduire un email valide ', 'top', false, 2500);
        } else if (!user.password || user.password =="undefined") {
            ionicToast.show('Veuillez introduire un mot de passe', 'top', false, 2500);
        }else if (user.password.length < 3) {
          ionicToast.show('Veuillez introduire un mot de passe valide', 'top', false, 2500);
        }else{
            $ionicLoading.hide();
            LoginFactory.login(user.email, user.password).success(function(data, status, headers, config ){
                  $ionicLoading.show();
                    switch (data.response) {
                             case "not_exist":
                                $ionicLoading.hide();
                                ionicToast.show('cet email nexiste pas', 'top', false, 2500);
                                 break;
                             case "wrong_password":
                                $ionicLoading.hide();
                                ionicToast.show('password incorrecte', 'top', false, 2500);
                                 break;
                             case "NOT_ENABLED":
                                $ionicLoading.hide();
                                ionicToast.show('forbidden account', 'top', false, 2500);
                                 break;
                             case "NOK":
                                 $ionicLoading.hide();
                                 ionicToast.show('email ou password non valide', 'top', false, 2500);
                                 break;
                             default:
                                  LoginFactory.createIdentifiantTable(db).then(function(result){
                                          LoginFactory.setCredentials(db,data.userName, data.userLastName, user.email,user.password,data.userID).then(function(result){
                                              AddFactory.createIncidentTable(db).then(function(result){
                                                  $ionicLoading.hide();
                                                  $state.go('app.profile') ;

                                              },function(){
                                                $ionicLoading.hide();
                                                ionicToast.show('Une erreur est survenue', 'top', false, 2500);
                                                console.warn("createIncidentTable error");
                                              });
                                          },function(reason){
                                             $ionicLoading.hide();
                                              ionicToast.show('Une erreur est survenue', 'top', false, 2500);
                                              console.warn("setCredentials error");
                                          });
                                  },function(){
                                      $ionicLoading.hide();
                                      ionicToast.show('Une erreur est survenue', 'top', false, 2500);
                                      console.warn("createIdentifiantTable error");
                                  });
                    break;
  
                  }
            }).error(function(data, status, headers, config ){
                ionicToast.show('Une erreur est survenue', 'top', false, 2500);
                console.warn("erreur serveur login http");
            });
        };
    };

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

});
