appContext.controller('AddController', function($ionicPlatform, $scope, $cordovaSQLite, AddIncidentFactory) {

    var db = null;//database instance.
    $ionicPlatform.ready(function() {
        /**
          * create/open DB
          */
        if (window.cordova) {// device
            db = window.sqlitePlugin.openDatabase({
                 name : "emergency" ,
                 androidDatabaseImplementation: 2,
                 location: 1});//tell he plugin to search for the database in files if it exists.
        } else {// browser
            db = window.openDatabase("emergency", '1', 'desc', 1024 * 1024 * 5);
        }
    });

    $scope.save = function(newDescription) {
        AddIncidentFactory.createIncidentTable(db).then(function(result){
            $cordovaSQLite.execute(db, " INSERT INTO incident (id, type, title, description, photo, longitude, latitude) VALUES (?,?,?,?,?,?,?) ",
                                       [null, 'xx', 'xx', newDescription, 'xx', 'xx', 'xx']).then(function(result) {
                  console.log('------------'+result);
                $scope.statusDescription = "incident saved    :)))))))))))))";

            }, function(reason) {

              console.log('errorrrrr 222222222'+result);
            });

        },function(){

          console.log('errorrrrr 11111111'+result);
        });

    }

});
