angular.module('communication', [])
.factory('connection', ['$http', '$q',
function ConnectionFactory($http, $q) {

    function doConnect(verb, uri, data) {
        
        var defer = $q.defer();
        verb = verb.toLowerCase();
 
        $http({ url: uri, 
                method: verb, 
                data: data, 
                headers: {"Content-Type": "application/json;charset=utf-8"}
        }).then(
            function (response) {
                var data = response.data;
                if (data.error) {
                    switch (data.status) {
                    case 401:
                        console.error("Server error: " + data.message);
                        // @todo Rework this in future, redirect will shock user.
                        $state.go('login');
                        break;
                    default:
                        console.error("Server error: " + data.message);
                        break;
                    }
                    defer.reject(data);
                } else {
                    defer.resolve(data);
                }
            },
            function (response) {
                console.error('HTTP Error: ' + response.statusText);
                defer.reject('HTTP Error: ' + response.statusText);
            }
        );
        
        return defer.promise;
    }
    var oConn = {
        get: function (uri) {
            return doConnect('GET', uri);
        },
        post: function (uri, data) {
            return doConnect('POST', uri, data);
        },
        put: function (uri, data) {
            return doConnect('PUT', uri, data);
        },
        httpDelete: function (uri, data) {
           return doConnect('DELETE', uri, data);
        }
    };
    return oConn;
}]);


