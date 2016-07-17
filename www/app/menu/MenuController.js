appContext.controller('MenuController', function($scope, $state, $ionicPlatform,$rootScope, LoginFactory, IncidentFactory,LoginFactory) {

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




        LoginFactory.selectCredentials(db).then(function (result) {
            console.warn(result)
            if (result.rows.length > 0) {
                console.log(result.rows)
                $rootScope.userMenu = {
                    profilPhoto: result.rows.item(0).profilPhoto
                }
            }
        }, function(){

        });


    });


    $scope.signout = function() {
      LoginFactory.emptyIdentifiantTable(db).then(function(result){
        IncidentFactory.emptyIncidentTable(db).then(function(result){
            $state.go("startup");


        },function(reason){
          console.warn(reason);
        });

      },function(reason){
        console.warn(reason);
      });
        console.log('deconnexion');

    };
    //Add incident
    $scope.one = function() {
        $state.go("app.incident-type");
    };
    //iIncident's list
    $scope.two = function() {
        $state.go("app.incident-list");
    };
    //Profile
    $scope.three = function() {
        $state.go("app.profile");
    };

});
