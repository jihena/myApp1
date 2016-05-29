appContext.factory('AddIncidentFactory', function($q, $cordovaSQLite) {

    /**
     * create incident table
     */
    var createIncidentTable = function(db) {
        var deferred=$q.defer();
        var CreateQuery = 'CREATE TABLE IF NOT EXISTS incident (' +
            'id INTEGER PRIMARY KEY, ' +
            'type text, title text, description text, photo text, longitude text, latitude text)';
        $cordovaSQLite.execute(db, CreateQuery).then(
            function(result) {
              console.log(result);
                deferred.resolve();
            },
            function(reason) {
                deferred.reject();
            });
        return deferred.promise;
    }
    /**
     * save the incident credentials into the incident Table
     */
    var setCredentials = function(db, type, title, description, photo, longitude, latitude) {
        var deferred=$q.defer();
        $cordovaSQLite.execute(db, " INSERT INTO incident (id, type, title, description, photo, longitude, latitude) VALUES (?,?,?,?,?,?,?) ",
                                   [null, type, title, description, photo, longitude, latitude]).then(function(result) {
              console.log('------------'+result);
            deferred.resolve();

        }, function(reason) {
          console.log(reason);
           deferred.reject();
        });
        return deferred.promise;

    }
    /**
     * delete all records from incident table
     */
    var emptyIncidentTable = function(db, xxx) {
        var deferred=$q.defer();
        var query = "DELETE FROM incident where id = xxx";
        $cordovaSQLite.execute(db, query).then(function(result) {
            deferred.resolve(result);
        }, function(reason) {
            deferred.reject(reason);
        });
         return deferred.promise;
    };
    /**
     * GET the incident credentials into the incident Table
     */
    var selectCredentials = function(db) {
        var deferred=$q.defer();
        $cordovaSQLite.execute(db, "SELECT name FROM sqlite_master WHERE type='table' AND name='incident';").then(function(results) {
            if (results.rows.length > 0) {
                $cordovaSQLite.execute(db, "SELECT * FROM incident").then(function(res) {
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
        createIncidentTable : createIncidentTable,
        setCredentials : setCredentials,
        emptyIncidentTable : emptyIncidentTable,
        selectCredentials : selectCredentials
    }

});
