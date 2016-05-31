appContext.factory('LoginFactory', function($http, $q, $cordovaSQLite) {

    /**
     * the login server call
     */
    var doLogin = function(email, password) {
        // the request parameters
        var loginRequest = {
            method: 'POST',
            url: 'http://192.168.1.104/emergency/web/app.php/auth/login',
            //url: 'http://127.0.0.1/emergency/web/app_dev.php/auth/login',
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
                email: email,
                password: password
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
            'email text, password text,userId text)';
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
    var setCredentials = function(db, email, password,userId) {
        var deferred=$q.defer();
        $cordovaSQLite.execute(db, " INSERT INTO identifiant (id, email, password,userId) VALUES (?,?,?,?) ", [1, email, password,userId]).then(function(result) {
            deferred.resolve();
        }, function(reason) {
           deferred.reject();
        });
        return deferred.promise;
    }

    /**
     * delete all records from identifiant table
     */
    var emptyIdentifiantTable = function(db) {
        var deferred=$q.defer();
        var query = "DELETE FROM identifiant where id = 1";
        $cordovaSQLite.execute(db, query).then(function(result) {
            deferred.resolve(result);
        }, function(reason) {
            deferred.reject(reason);
        });
         return deferred.promise;
    };

    /**
     * GET the user credentials into the USER Table
     */
    var selectCredentials = function(db) {
        var deferred=$q.defer();
        $cordovaSQLite.execute(db, "SELECT name FROM sqlite_master WHERE type='table' AND name='identifiant';").then(function(results) {
            if (results.rows.length > 0) {
                $cordovaSQLite.execute(db, "SELECT * FROM identifiant").then(function(res) {
                    deferred.resolve(res);
                }, function(error) {
                    deferred.reject(error);
                });
            } else {
                console.log('table nexiste pas');
                deferred.resolve(0);
            }
        }, function(reason) {
            deferred.reject(reason);
        });
        return deferred.promise;
    };


    /**
     * the factory return
     */
    return {
        login: doLogin,
        createIdentifiantTable : createIdentifiantTable,
        setCredentials : setCredentials,
        emptyIdentifiantTable : emptyIdentifiantTable,
        selectCredentials : selectCredentials
    }
})
