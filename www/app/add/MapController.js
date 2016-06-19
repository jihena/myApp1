appContext.controller('MapController', function($scope, $state, $cordovaGeolocation,AddFactory,
                                                $rootScope, $ionicPlatform, ionicToast, $rootScope,ConnectionFactory,ionicToast,$ionicLoading) {

    $ionicLoading.show();
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

            //**************** Map ***************\\

            var options = {timeout: 10000, enableHighAccuracy: false};
            $cordovaGeolocation.getCurrentPosition(options).then(function(position){

                var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                $rootScope.incident.longitude = position.coords.longitude;
                $rootScope.incident.latitude = position.coords.latitude;


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
                    $ionicLoading.hide();
                    var infoWindow = new google.maps.InfoWindow({
                        content: "Here is the incident!"
                    });

                    google.maps.event.addListener(marker, 'click', function () {
                        infoWindow.open($scope.map, marker);
                    });

                    google.maps.event.addListener(marker, 'dragend', function(evt){
                        $rootScope.incident.longitude = evt.latLng.lng();
                        $rootScope.incident.latitude = evt.latLng.lat();

                    })
                });
            }, function(error){
                ionicToast.show('Could not get location', 'top', false, 2500);
            });
            //********************DATE************************
            var d = new Date().getTime();
            $rootScope.incident.date = d;

            //****************Report incident******************
            //*************************************************
            $scope.report = function() {
              ConnectionFactory.isConnected().then(function() {
                //resolve
                AddFactory.doReport($rootScope.incident).success(function(data, status, headers, config ) {

                            // Add incidebt in the local DB
                            AddFactory.addIncident(db, $rootScope.incident.newType, $rootScope.incident.newTitle, $rootScope.incident.newDescription,
                                    $rootScope.incident.date, $rootScope.incident.newPhoto, $rootScope.incident.longitude, $rootScope.incident.latitude).then(function(result){
                                      ionicToast.show('Incident sent to server', 'top', false, 2500);
                                      $state.go('app.incident-list');
                            },function(reason){
                                ionicToast.show('Could not save incident', 'top', false, 2500);
                            });
                     }).error(function(data, status, headers, config) {
                       console.warn(JSON.stringify(data));
                     });
              }, function(){
                ionicToast.show('Insufficent connection', 'top', false, 2500);
              });
            };

});
