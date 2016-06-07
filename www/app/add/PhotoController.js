appContext.controller('PhotoController', function($scope, $state, $cordovaCamera, $cordovaFile,
                                                  $ionicPlatform, ionicToast, $rootScope) {
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
                    }, function (err) {
                      console.log('camera ERROR :' + imageData);
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
              $state.go('app.incident-map') ;
           };

});
