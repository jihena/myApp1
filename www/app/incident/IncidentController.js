appContext.controller('IncidentController', function($scope, $ionicPlatform, $stateParams, IncidentFactory) {
    // for opening db:
    var db = null;
    $ionicPlatform.ready(function() {
        /**
         * create/open DB
         */
        if (window.cordova) {
            db = window.sqlitePlugin.openDatabase({
                name: "emergency",
                androidDatabaseImplementation: 2, location: 1
            }); // device
        } else {
            db = window.openDatabase("emergency", '1', 'desc', 1024 * 1024 * 5); // browser

        }


        IncidentFactory.getLocalIncidentById(db, $stateParams.id).then(function(result) {
            if (result.rows.length == 1) {
                $scope.incident = {
                    id: result.rows.item(0).id,
                    type: result.rows.item(0).type,
                    title: result.rows.item(0).title,
                    description: result.rows.item(0).description,
                    date: result.rows.item(0).date,
                    photo: result.rows.item(0).photo,
                    longitude: result.rows.item(0).longitude,
                    latitude: result.rows.item(0).latitude
                }

             
            }
        }, function(reason) {
        });


    });

});
