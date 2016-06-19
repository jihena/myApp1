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

            var geocoder = new google.maps.Geocoder();
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

                // get address location from latitude and longitude in Google Map
                geocoder.geocode({
                        latLng: latLng
                        },
                        function(responses)
                        {
                           if (responses && responses.length > 0)
                           {
                              $scope.incident.address = responses[0].formatted_address;
                               console.log($scope.incident.address);
                           }
                           else
                           {
                             ionicToast.show('Not getting Any address for given latitude and longitude.', 'top', false, 2500);
                           }
                        }
                );
                //loading the map
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
                    //address of the new position of the marker
                    google.maps.event.addListener(marker, 'dragend', function(evt){
                        $rootScope.incident.longitude = evt.latLng.lng();
                        $rootScope.incident.latitude = evt.latLng.lat();
                        console.log('Current Latitude:',evt.latLng.lat(),'Current Longitude:',evt.latLng.lng());
                        latLng = new google.maps.LatLng(evt.latLng.lat(), evt.latLng.lng());

                        // get address location from latitude and longitude in Google Map
                        geocoder.geocode({
                                latLng: latLng
                                },
                                function(responses)
                                {
                                   if (responses && responses.length > 0)
                                   {
                                      $scope.incident.address = responses[0].formatted_address;
                                       console.log($scope.incident.address);
                                   }
                                   else
                                   {
                                     ionicToast.show('Not getting Any address for given latitude and longitude.', 'top', false, 2500);
                                   }
                                }
                        );

                    })

                    //info window
                    var infoWindow = new google.maps.InfoWindow({
                      content: "Here is the incident!"
                    });
                    google.maps.event.addListener(marker, 'click', function () {
                      infoWindow.open($scope.map, marker);
                    });
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


            //****************show address*********************Report incident
            //*************************************************
            $scope.address = function() {
              ionicToast.show($scope.incident.address, 'top', false, 2500);

            };

            //****************Report incident******************
            //*************************************************

            $scope.report = function() {
                // Add incidebt in the local DB
                AddFactory.addIncident(db, $rootScope.incident.newType, $rootScope.incident.newTitle, $rootScope.incident.newDescription,
                                           $rootScope.incident.date, $rootScope.incident.newPhoto, $rootScope.incident.longitude,
                                           $rootScope.incident.latitude).then(function(result){
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
