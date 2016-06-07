appContext.controller('IncidentListController', function($scope, $ionicLoading, $timeout, $ionicPlatform, IncidentFactory){


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

        //$window.location.reload(true);
        /************ get incident list from local db *******************/
        IncidentFactory.getLocalIncidentList(db).then(function(result) {
            // Setup the loader
           $ionicLoading.show({
             content: 'Loading',
             animation: 'fade-in'
           });
           var array = [];
           for (var i = 0; i < result.rows.length; i++) {
             array[i] = result.rows.item(i);
           };

              $ionicLoading.hide();

              $scope.incidentArray = array;


        },function(){
            //error
        })
    //ionicPlatform.ready
	})
});
