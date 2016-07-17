appContext.controller('MapController', function($scope, $state, $cordovaGeolocation,AddFactory,
                                                $rootScope, $ionicPlatform, ionicToast, $rootScope,ConnectionFactory,ionicToast,$ionicLoading,$window) {

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
            var geocoder = new google.maps.Geocoder();

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

                // get address location from latitude and longitude in Google Map
                geocoder.geocode({
                        latLng: latLng
                    },
                    function(responses) {
                        if (responses && responses.length > 0) {
                            $scope.incident.address = responses[0].formatted_address;
                            console.log($scope.incident.address);
                        } else {
                            ionicToast.show('Ne peut pas obtenir votre adresse.', 'top', false, 2500);
                        }
                    }
                );


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
                    var InfoWindowArray=[];


                    var infoWindow = new google.maps.InfoWindow({
                        content: $scope.incident.address
                    });

                    google.maps.event.addListener(marker, 'click', function () {
                        infoWindow.open($scope.map, marker);
                    });

                    google.maps.event.addListener(marker, 'dragend', function(evt){
                        $rootScope.incident.longitude = evt.latLng.lng();
                        $rootScope.incident.latitude = evt.latLng.lat();
                        console.log('Current Latitude:', evt.latLng.lat(), 'Current Longitude:', evt.latLng.lng());
                        latLng = new google.maps.LatLng(evt.latLng.lat(), evt.latLng.lng());


                        // get address location from latitude and longitude in Google Map
                        geocoder.geocode({latLng: latLng},function(responses) {
                                if (responses && responses.length > 0) {
                                    $scope.$apply(function() {
                                     $scope.incident.address = responses[0].formatted_address;
                                      });
                                    console.log($scope.incident.address);
                                     infoWindow.setContent($scope.incident.address)
                                    
                                    
                                } else {
                                    ionicToast.show('Ne peut pas obtenir votre adresse.', 'top', false, 2500);
                                }
                            }
                        );

                    })


                });
            }, function(error){
                ionicToast.show('impossible de localiser votre emplacement ', 'top', false, 2500);
            });



            //********************DATE************************
            var d = new Date().getTime();
            $rootScope.incident.date = d;

            //****************Report incident******************
            //*************************************************
            $scope.report = function() {
              $ionicLoading.show();
              ConnectionFactory.isConnected().then(function() {
                //resolve
                AddFactory.doReport($rootScope.incident).success(function(data, status, headers, config ) {

                            // Add incidebt in the local DB
                            AddFactory.addIncident(db, $rootScope.incident.newType, $rootScope.incident.newTitle, $rootScope.incident.newDescription,
                                    $rootScope.incident.date, $rootScope.incident.newPhoto, $rootScope.incident.longitude, $rootScope.incident.latitude).then(function(result){
                                      ionicToast.show('Incident envoyé au server', 'top', false, 2500);
                                      $ionicLoading.hide();
                                      $state.go('app.incident-list');
                            },function(reason){
                                $ionicLoading.hide();
                                ionicToast.show('Impossible d\'envoyer l\'incident', 'top', false, 2500);
                            });
                     }).error(function(data, status, headers, config) {
                        $ionicLoading.hide();
                       console.warn(JSON.stringify(data));
                     });
              }, function(){
                $ionicLoading.hide();
                ionicToast.show('Pas de connection', 'top', false, 2500);
              });
            };


            $scope.cancel= function(){
                $state.go("app.incident-type");
            }

});
