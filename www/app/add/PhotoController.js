appContext.controller('PhotoController', function($scope, $state, $cordovaCamera, $cordovaFile, $cordovaGeolocation,ConnectionFactory,$cordovaDialogs,
                                                  $ionicPlatform, ionicToast, $rootScope, $ionicLoading) {
                                                    console.warn($rootScope.incident.newType);

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
    //*************Photo***********
    //**********************************

          /**
           * Prendre une photo et récupérer l'emplacement du fichier de l'image :
           */
          $scope.pictureUrl = 'img/camera.jpg';
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
                //console.log('camera data :' + imageData);

                    $scope.pictureUrl = "data:image/jpeg;base64," + imageData;
                }, function(err) {
                    // error
                    console.log('camera ERROR :' + err);
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
                    }, function (err) {
                      console.log('camera ERROR :' + err);
                    });
                }
          /**
           * Prendre une photo et récupérer l'emplacement du fichier de l'image :
           * Next
           */
           $scope.savePhoto = function(incident) {
              $rootScope.incident.newTitle = incident.title;
              $rootScope.incident.newDescription = incident.description;
              $rootScope.incident.newPhoto = $scope.pictureUrl;

              $ionicLoading.show();
              //checkout the network connection
              console.log("checkout the network connection")
              ConnectionFactory.isConnected().then(function() {
                console.log("is connected")
                var options = {
                    timeout: 5000,
                    enableHighAccuracy: true
                };
                $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
                   $ionicLoading.hide();

                   $state.go('app.incident-map') ;


                }, function(error) {
                    //if faut activer le gps
                    $ionicLoading.hide();
                    $cordovaDialogs.alert("Utilier le gps, ainsi que les réseau cellulaires et wi-fi pour déterminer la position",
                        "Activer le GPS","ok").then(function() {
                          // callback success
                          });
                    console.log(error)
                    console.log("Could not get location");
                });

          
              }, function() {
                $ionicLoading.hide();
                console.log("noooooooooooo connection")
                  $cordovaDialogs.alert('Utilier le gps, ainsi que les réseau cellulaires et wi-fi pour déterminer la position', 'Activer le wi-fi', 'Ok')
                  .then(function() {
                    // callback success
                  });
                  
              });
           };

});
