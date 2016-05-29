appContext.factory('CameraFactory', ['$q', '$cordovaFile', function($q, $cordovaFile) {

    //open the device camera to take picture
    // parameter: camera options
    //return:
    var  takePhoto=  function(options) {
        var q = $q.defer();

        navigator.camera.getPicture(function(result) {
          // Do any magic you need
          q.resolve(result);
        }, function(err) {
          q.reject(err);
        }, options);

        return q.promise;
    };



    return {
    takePhoto : takePhoto,
    }

}]);
