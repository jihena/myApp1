appContext.factory('LoginFactory', function($http, $q) {
    /**
     * the login server call
     */
    var logout = function() {
      return
          $http.get("http://buzcard.fr/identification.aspx?request=leave");
    };
      /**
       * the login server call
       */
    var doLogin = function(email, password) {

            // the request parameters
            var loginRequest = {
                method: 'POST',
                url: 'http://buzcard.fr/identification.aspx?request=identification',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                transformResponse: function(data) {
                    // var x2js = new X2JS();
                    // var json = x2js.xml_str2json(data);
                    // return json;
                },
                timeout: 4000,
                data: {
                    email: email,
                    hash: password
                }
            };
            // the HTTP request
            return $http(loginRequest);
        };
})
