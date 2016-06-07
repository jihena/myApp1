appContext.controller('MapController', function($scope, $state, $cordovaGeolocation,AddFactory,
                                                $rootScope, $ionicPlatform, ionicToast, $rootScope,ConnectionFactory) {

    var db = null;
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

            //****************Map***************
            //**********************************
            var options = {timeout: 10000, enableHighAccuracy: true};
            $cordovaGeolocation.getCurrentPosition(options).then(function(position){
                var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                $rootScope.incident.longitude = position.coords.longitude;
                $rootScope.incident.latitude = position.coords.latitude;
                console.log(position.coords.latitude);
                console.log(position.coords.longitude);

                var mapOptions = {
                  center: latLng,
                  zoom: 15,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
                //Wait until the map is loaded
                //add marker and infoWindow
                google.maps.event.addListenerOnce($scope.map, 'idle', function(){
                    var marker = new google.maps.Marker({
                        map: $scope.map,
                        animation: google.maps.Animation.DROP,
                        position: latLng,
                        draggable : true
                    });
                    var infoWindow = new google.maps.InfoWindow({
                        content: "Here is the incident!"
                    });
                    google.maps.event.addListener(marker, 'click', function () {
                        infoWindow.open($scope.map, marker);
                    });
                    google.maps.event.addListener(marker, 'dragend', function(evt){
                        $rootScope.incident.longitude = evt.latLng.lng();
                        $rootScope.incident.latitude = evt.latLng.lat();
                        console.log('Current Latitude:',evt.latLng.lat(),'Current Longitude:',evt.latLng.lng());
                    })
                });
            }, function(error){
                //if faut activer le gps
                //$ionicLoading.hide();
                //PopupFactory.myPopup('Activez le gps pour determiner la recherche');
                console.log("Could not get location");
            });
            //********************DATE************************
            var d = new Date().getTime();
             $rootScope.incident.date = d;
            console.warn(d);
            //****************Report incident******************
            //*************************************************
            $scope.report = function() {
                // Add incidebt in the local DB
                AddFactory.addIncident(db, $rootScope.incident.newType, $rootScope.incident.newTitle, $rootScope.incident.newDescription,
                        $rootScope.incident.date, $rootScope.incident.newPhoto, $rootScope.incident.longitude, $rootScope.incident.latitude).then(function(result){
                    $state.go('app.incident-list') ;
                    console.warn(d);
                    console.log("success");
                },function(reason){
                    console.log(reason);
                });
            };
            //*****************Send incident to the server************************
            $scope.send = function() {
              ConnectionFactory.isConnected().then(function () {
                //resolve
                AddFactory.doReport($rootScope.incident).success(function(data, status, headers, config ) {
                          $scope.report();
                          $state.go('app.incident-list') ;
                     }).error(function(data, status, headers, config) {

                     });
              }, function(){
                $scope.report();
                $state.go('app.incident-list') ;
                //reject
              });



            };
});
