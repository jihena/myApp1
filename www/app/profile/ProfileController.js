appContext.controller('ProfileController', function($scope , ProfileFactory, LoginFactory,
                                                    $ionicPlatform, $stateParams, $rootScope){
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
                $scope.user = {
                    email: result.rows.item(0).email,
                    password: result.rows.item(0).password,
                    firstName: "",
                    lastName: ""
                }
                LoginFactory.login($scope.user.email, $scope.user.password).success(function(data, status, headers, config ){
                    $scope.user.firstName = data.userName,
                    $scope.user.lastName = data.userLastName;
                    $scope.user.id = data.userID;
                    $rootScope.id = data.userID;
                    console.log($scope.user.firstName);
                    console.log($scope.user.lastName);
                    console.log($rootScope.id);
                }).error(function(data, status, headers, config ){
                  //error
                });
            }
        }, function(){

        });
    });

});
