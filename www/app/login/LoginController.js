appContext.controller('LoginController', function($scope, $state, $rootScope, $ionicPlatform, LoginFactory, AddFactory, ionicToast,$ionicLoading,$ionicPush,$ionicPopup){

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
            ionicToast.show('Veuillez remplir tout les champs', 'top', false, 3500);
        } else if(!user.email || user.email =="undefined" || ! validateEmail(user.email) )  {
            ionicToast.show('Veuillez introduire un email valide ', 'top', false, 3500);
        } else if (!user.password || user.password =="undefined") {
            ionicToast.show('Veuillez introduire un mot de passe', 'top', false, 3500);
        }else if (user.password.length < 3) {
          ionicToast.show('Veuillez introduire un mot de passe valide', 'top', false, 3500);
        }else{
            $ionicLoading.hide();
            LoginFactory.login(user.email, user.password).success(function(data, status, headers, config ){
                  $ionicLoading.show();
                    switch (data.response) {
                             case "not_exist":
                                $ionicLoading.hide();
                                ionicToast.show('cet email nexiste pas', 'top', false, 3500);
                                 break;
                             case "wrong_password":
                                $ionicLoading.hide();
                                ionicToast.show('password incorrecte', 'top', false, 3500);
                                 break;
                             case "NOT_ENABLED":
                                $ionicLoading.hide();
                                ionicToast.show('forbidden account', 'top', false, 3500);
                                 break;
                             case "NOK":
                                 $ionicLoading.hide();
                                 ionicToast.show('email ou password non valide', 'top', false, 3500);
                                 break;
                             case "OK":
                                  LoginFactory.createIdentifiantTable(db).then(function(result){
                                          LoginFactory.setCredentials(db,data.userName, data.userLastName, user.email,user.password,data.userID).then(function(result){
                                              AddFactory.createIncidentTable(db).then(function(result){
                                              // -----------------------------------------
                                              // -----------
                                              Ionic.io();
                                              $ionicPush.init({
                                                  "debug": false,
                                                  "onNotification": function(notification) {
                                                    console.warn(JSON.stringify(notification) );
                                                  },
                                                  "onRegister": function(data) {
                                                      localStorage.setItem('deviceToken', data.token);
                                                      console.log(JSON.stringify(data.token))

                                                      LoginFactory.sendDeviceToken(data.token).success(function(data){
                                                        if("OK" == data.response){
                                                          $ionicLoading.hide();
                                                          $state.go('app.profile');
                                                          console.warn("ok");
                                                        }else {
                                                          console.warn("nok");
                                                          $ionicLoading.hide();
                                                          ionicToast.show('Une erreur est servenue <br> Vous allez pas recevoir des notifications', 'top', false, 5000);
                                                          $ionicLoading.hide();
                                                          $state.go('app.profile') ;
                                                        }
                                                      }).error(function(data){
                                                        console.warn("error");
                                                        $ionicLoading.hide();
                                                        ionicToast.show('Une erreur est servenue <br> Vous allez pas recevoir des notifications', 'top', false, 5000);
                                                        $ionicLoading.hide();
                                                        $state.go('app.profile') ;

                                                      });

                                                  }
                                              });
                                              $ionicPush.register();
                                              // ---------
                                              // -----------------------------------------



                                              },function(){
                                                $ionicLoading.hide();
                                                ionicToast.show('Une erreur est survenue', 'top', false, 3500);
                                                console.warn("createIncidentTable error");
                                              });
                                          },function(reason){
                                             $ionicLoading.hide();
                                              ionicToast.show('Une erreur est survenue', 'top', false, 3500);
                                              console.warn("setCredentials error");
                                          });
                                  },function(){
                                      $ionicLoading.hide();
                                      ionicToast.show('Une erreur est survenue', 'top', false, 3500);
                                      console.warn("createIdentifiantTable error");
                                  });
                    break;

                  }
            }).error(function(data, status, headers, config ){
                ionicToast.show('Une erreur est survenue', 'top', false, 3500);
                console.warn("erreur serveur login http");
            });
        };
    };

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    $rootScope.ok = function(){
      popup.close();
    }

});
