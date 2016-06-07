appContext.controller('TypeController', function($scope, $state, $ionicPlatform, ionicToast, $rootScope) {


    //Before we start coding, it is very important to note that
    //database activity can only be done when the onDeviceReady() method has fired.

    //We want to have access to the database globally so I created
    //a variable outside of any method. To use the ngCordova functions we need to include $cordovaSQLite.
    //Finally, you can see that I’ve created a new database called emergency and a fresh table called incident.

    //SQLite database is file format

    // for opening db:
    var db = null;//database instance.
    $ionicPlatform.ready(function() {
        /**
          * create/open DB
          */
        if (window.cordova) {// device
            db = window.sqlitePlugin.openDatabase({
                 name : "emergency" ,
                 androidDatabaseImplementation: 2,
                 location: 1});
        } else {// browser
            db = window.openDatabase("emergency", '1', 'desc', 1024 * 1024 * 5);
        }
    });
    //*************Type*****************
    //**********************************
    $scope.saveType = function(newType) {
        $rootScope.incident = {};
        $rootScope.incident.newType = newType;
        $state.go('app.incident-photo') ;

    };


});
