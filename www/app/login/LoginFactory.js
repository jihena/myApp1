appContext.factory('LoginFactory', function($http, $q, $cordovaSQLite) {

    /**
     * the login server call
     */
    var doLogin = function(email, password) {
        // the request parameters
        var loginRequest = {
            method: 'POST',
            url: 'http://emergency.lavrel.com/auth/login',
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
    var setCredentials = function(db,firstName ,lastName ,email, password,userId,profilPhoto) {
      localStorage.setItem("userId", userId);
        var deferred=$q.defer();
        $cordovaSQLite.execute(db, " INSERT INTO identifiant (id, firstName, lastName, email, password,userId,profilPhoto) VALUES (?,?,?,?,?,?,?) ",
        [1, firstName, lastName, email, password, userId, profilPhoto]).then(function(result) {
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
        var query = "DELETE FROM identifiant";
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
                deferred.resolve(0);
                console.warn('table nexiste pas');
            }
        }, function(reason) {
            deferred.reject(reason);
            console.warn("selectCredentials error " + JSON.stringify(reason));
        });
        return deferred.promise;
    };

    var sendDeviceToken = function(token){
      // the request parameters
      var request = {
          method: 'POST',
          url: 'http://emergency.lavrel.com/auth/save_token',
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
              id: localStorage.getItem("userId"),
              token: token
          }
      };
      // the HTTP request
      return $http(request);
    }


    /**
     * the factory return
     */
    return {
        login: doLogin,
        createIdentifiantTable : createIdentifiantTable,
        setCredentials : setCredentials,
        emptyIdentifiantTable : emptyIdentifiantTable,
        selectCredentials : selectCredentials,
        sendDeviceToken : sendDeviceToken
    }
})
