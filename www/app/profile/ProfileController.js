appContext.controller('ProfileController', function($scope , ProfileFactory, LoginFactory,$ionicLoading,
                                                    $ionicPlatform, $stateParams, $cordovaCamera, $rootScope){
    // for opening db:
    var db = null;
    $ionicPlatform.ready(function() {
        /**
         * create/open DB
         */
        if (window.cordova) {// device
            db = window.sqlitePlugin.openDatabase({name : "emergency" , androidDatabaseImplementation: 2, location: 1});
        } else {// browser
            db = window.openDatabase("emergency", '1', 'desc', 1024 * 1024 * 5);
        }

        //-----------

        LoginFactory.selectCredentials(db).then(function (result) {
            console.warn(result)
            if (result.rows.length > 0) {
                console.log(result.rows)
                $scope.user = {
                    email: result.rows.item(0).email,
                    password: result.rows.item(0).password,
                    firstName: result.rows.item(0).firstName,
                    lastName: result.rows.item(0).lastName,
                    id:result.rows.item(0).userID,
                    profilPhoto: result.rows.item(0).profilPhoto
                }

                 $rootScope.id = $scope.user.id;

            }
        }, function(){

        });

     $scope.x={profilPhoto : ""}
    });

     /**
       * Select photo from the device gallery
       */
      $scope.selectPhoto = function () {
        $ionicLoading.show();
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
                    $scope.user.profilPhoto = "data:image/jpeg;base64," + imageData;
                    ProfileFactory.updateUserProfil(db,$scope.user).then(function (result) {
                       console.log("ok")
                       $ionicLoading.hide();

                    }, function(error){
                        console.log("updateUserProfil error");
                        console.log(error);
                        $ionicLoading.hide();
                    })
                    
                }, function (err) {
                  console.log('camera ERROR :');
                  console.log(err);
                  $ionicLoading.hide();
                });

            }

});
