appContext.controller('MenuController', function($scope, $state, $ionicPlatform, LoginFactory) {

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


    $scope.signout = function() {
      LoginFactory.emptyIdentifiantTable(db).then(function(result){

        $state.go("startup");
      },function(reason){

      });
        console.log('deconnexion');

    };

});
