appContext.controller('IncidentListController', function($scope, $ionicPlatform, IncidentFactory){

  $ionicPlatform.ready(function() {

        /*************  for opening db ********************/
        if (window.cordova) {
            db = window.sqlitePlugin.openDatabase({
                name: "emergency",
                androidDatabaseImplementation: 2,
                location: 1
            }); // device
        } else {
            db = window.openDatabase("emergency", '1', 'desc', 1024 * 1024 * 5); // browser
        }

        /************ get incident list from local db *******************/
        IncidentFactory.getLocalIncidentList(db).then(function(result) {
            var array = [];
            for (var i = 0; i < result.rows.length; i++) {
                array[i] = result.rows.item(i);
            };
            $scope.incidentArray = array;
        },function(){
            //error
        })
    //ionicPlatform.ready
	})
});
