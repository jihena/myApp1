appContext.controller('StartupController', function($ionicPlatform, $ionicHistory, LoginFactory, $state, $ionicHistory) {

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

        LoginFactory.selectCredentials(db).then(function (rs) {

            $ionicHistory.nextViewOptions({
                    disableBack: true,
                    disableAnimate: true,
                    historyRoot: true
                });
            console.warn(rs)
            if (0 == rs) {
                $state.go("login")
            }else if(rs.rows.length > 0){

                $state.go("app.profile")
            }else if (rs.rows.length == 0) {
              $state.go("login")
            }
        }, function(){

        });
    });
//$ionicHistory.clearHistory();
})
