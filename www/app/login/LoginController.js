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
        }else{
            LoginFactory.login(user.email, user.password).success(function(data, status, headers, config ){
                if(data==0){
                    ionicToast.show('mot de passe ou email incorrecte', 'top', false, 2500);
                }else{
                    LoginFactory.createIdentifiantTable(db).then(function(result){
                        console.log('table created');
                        LoginFactory.selectCredentials(db).then(function() {
                            LoginFactory.setCredentials(db,user.email,user.password,data).then(function(result){
                                $state.go('app.incident-list') ;
                                console.log("success");
                            },function(reason){
                                ionicToast.show('Une erreur est survenue 1111111111', 'top', false, 2500);
                            });
                        });

                    },function(){
                        ionicToast.show('Une erreur est survenue 22222222222', 'top', false, 2500);
                    });
                    localStorage.setItem("isAuthenticated", true);
                }
            }).error(function(data, status, headers, config ){
                ionicToast.show('Une erreur est survenue 3333333333333333333', 'top', false, 2500);
            });
        };
    };

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

});
