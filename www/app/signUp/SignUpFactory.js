appContext.factory('SignUpFactory', function($http, $q, $cordovaSQLite) {

    /**
     * the login server call
     */
    var signUp = function(user) {
        // the request parameters
        var loginRequest = {
            method: 'POST',
            url: 'http://emergency.lavrel.com/auth/create',

            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function(obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            timeout: 4000,
            data: {
                email: user.email,
                password: user.password,
                firstName: user.firstName,
                lastName:user.lastName
            }
        };
        // the HTTP request
        return $http(loginRequest);
    };

    /**
     * create identifiant table
     */
    var createIdentifiantTable = function(db) {
        var deferred=$q.defer();
        var CreateQuery = 'CREATE TABLE IF NOT EXISTS identifiant (' +
            'id INTEGER PRIMARY KEY, ' +
            'firstName text, lastName text, email text, password text,userId integer, profilPhoto text)';
        $cordovaSQLite.execute(db, CreateQuery).then(
            function(result) {
                deferred.resolve();
            },
            function(reason) {
                deferred.reject();
            });
        return deferred.promise;
    }

    /**
     * save the user credentials into the identifiant Table
     */
    var setCredentials = function(db, firstName, lastName, email, password,userId,profilPhoto ) {
        localStorage.setItem("userId", userId);
        var deferred=$q.defer();
        $cordovaSQLite.execute(db, " INSERT INTO identifiant (id, firstName, lastName, email, password,userId,profilPhoto ) VALUES (?,?,?,?,?,?,?) ", 
            [1, firstName, lastName, email, password, userId,profilPhoto ]).then(function(result) {
              console.log(result);
            deferred.resolve();

        }, function(reason) {
          console.log(reason);
           deferred.reject();
        });
        return deferred.promise;

    }


    /**
     * the factory return
     */
    return {
        signUp : signUp,
        createIdentifiantTable : createIdentifiantTable,
        setCredentials : setCredentials,
    }
})
