appContext.controller('SignUpController', function($scope, $state,  $ionicPlatform, SignUpFactory, ionicToast, $ionicLoading){

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

    $scope.signUp = function(user) {
        console.warn(user);
        if (!user) {
            ionicToast.show('Veuillez remplir tout les champs', 'top', false, 2500);
        }else if(!user.firstName)  {
            ionicToast.show('Veuillez introduire un prenom ', 'top', false, 2500);
        }else if(!user.lastName)  {
            ionicToast.show('Veuillez introduire un nom ', 'top', false, 2500);
        }else if(!user.email || user.email =="undefined" || ! validateEmail(user.email) )  {
            ionicToast.show('Veuillez introduire un email valide ', 'top', false, 2500);
        } else if (!user.password || user.password =="undefined") {
            ionicToast.show('Veuillez introduire un mot de passe', 'top', false, 2500);
        }else if (user.password.length < 5) {
          ionicToast.show('Veuillez introduire un mot de passe valide', 'top', false, 2500);
        }else if (window.connection) {
          if(navigator.connection.type == Connection.NONE) {

            ionicToast.show('There is no internet connection', 'top', false, 2500);
          }
        }
        else{
            $ionicLoading.show();
            SignUpFactory.signUp(user).success(function(data, status, headers, config ){
                switch (data.response) {
                         case "already_exist":
                            $ionicLoading.hide();
                            ionicToast.show('Ce compte a déjà été utilisé', 'top', false, 2500);
                             break;
                         case "NOK":
                            $ionicLoading.hide();
                             ionicToast.show('email ou mot de passe non valide', 'top', false, 2500);
                             break;
                         default:
                             SignUpFactory.createIdentifiantTable(db).then(function(result){
                                 console.info('table created: sign up');
                                   SignUpFactory.setCredentials(db,user.firstName, user.lastName,user.email,user.password,data.userID,"img/user.png").then(function(result){
                                      $ionicLoading.hide();
                                       $state.go('login');
                                       console.info("success");
                                   },function(reason){
                                    $ionicLoading.hide();
                                       ionicToast.show('Une erreur est survenue', 'top', false, 2500);
                                       console.warn(reason);
                                   });

                             },function(reason){
                                $ionicLoading.hide();
                                 ionicToast.show('Une erreur est survenue', 'top', false, 2500);
                                  console.warn(reason);
                             });
                             break;
                     };

            }).error(function(data, status, headers, config ){
                $ionicLoading.hide();
                ionicToast.show('Une erreur est survenue', 'top', false, 2500);
            });
        };
    };

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

});
