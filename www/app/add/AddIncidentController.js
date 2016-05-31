appContext.controller('AddIncidentController', function($scope, $state, $cordovaCamera, $cordovaFile,
                                                        $cordovaGeolocation,AddIncidentFactory,
                                                        $ionicPlatform, ionicToast, $rootScope) {

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


            //****************Map***************
            //**********************************
            var options = {timeout: 10000, enableHighAccuracy: true};

            $cordovaGeolocation.getCurrentPosition(options).then(function(position){

                var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

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
                        position: latLng
                    });

                    var infoWindow = new google.maps.InfoWindow({
                        content: "Here is the incident!"
                    });

                    google.maps.event.addListener(marker, 'click', function () {
                        infoWindow.open($scope.map, marker);
                    });

                });

            }, function(error){
              console.log("Could not get location");
            });



    });

    //*************Type*****************
    //**********************************
    $scope.saveType = function(newType) {

      $rootScope.newType = newType;
      $state.go('app.incident-photo') ;

    };
    //************Description***********
    //**********************************



    //*************Photo***********
    //**********************************

          /**
           * Prendre une photo et récupérer l'emplacement du fichier de l'image :
           */
          $scope.pictureUrl = 'http://placehold.it/250x250';
          $scope.getPhoto = function() {

              var options = {
                  quality: 75,
                  destinationType: Camera.DestinationType.DATA_URL,
                  sourceType: Camera.PictureSourceType.CAMERA,
                  encodingType: Camera.EncodingType.JPEG,
                  targetWidth: 300,
                  targetHeight: 300,
                  correctOrientation: true,
                  saveToPhotoAlbum: true,
                  popoverOptions: CameraPopoverOptions

              };
              $cordovaCamera.getPicture(options).then(function(imageData) {
                console.log('camera data :' + imageData);

                    $scope.pictureUrl = "data:image/jpeg;base64," + imageData;
                  }, function(err) {
                    // error
                    console.log('camera ERROR :' + imageData);
                  });

          };
          /**
           * Select photo from the device gallery
           */
          $scope.selectPhoto = function () {
                  var options = {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 300,
                    targetHeight: 300,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };

                    $cordovaCamera.getPicture(options).then(function (imageData) {
                      console.log('camera data :' + imageData);
                        $scope.pictureUrl = "data:image/jpeg;base64," + imageData;
                        var d = new Date();
                        n = d.getTime();
                        $rootScope.newDate = n;
                    }, function (err) {
                      console.log('camera ERROR :' + imageData);
                    });
                }
          /**
           * Prendre une photo et récupérer l'emplacement du fichier de l'image :
           */
           $scope.savePhoto = function(incident) {

               AddIncidentFactory.createIncidentTable(db).then(function(result){

                   console.log('table created');
                   AddIncidentFactory.setCredentials(db,$rootScope.newType,incident.title,incident.description,$rootScope.newDate,$scope.pictureUrl,null,null).then(function(result){
                       $state.go('app.incident-map') ;
                       console.log("success");
                   },function(reason){
                     console.log("TYPE : errorrrrr 222222222");
                   });
               },function(){
                 console.log('TYPE : errorrrrr 11111111'+result);

               });

           };




});
