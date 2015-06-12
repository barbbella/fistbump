angular.module('FistBump')
    .controller('AuthController', ['$scope', function($scope) {
        var auth = new Firebase("https://fistbump.firebaseio.com/");
        var authData = auth.getAuth();
        console.log(authData);
        if (authData) {
            $scope.username = authData.google.displayName;
        } else {
            auth.authWithOAuthRedirect('google', function(error, authData) {
                $scope.username = authData.google.displayName;
                if (error) {
                    console.log('Login failed', error);
                } else {
                    console.log('Authenticated successfully.');

                }
            });
            auth.onAuth(function(authData) {
                if (authData) {
                    auth.child("users").child(authData.uid).set({
                        provider: authData.provider,
                        name: authData.google.displayName
                    });
                }
            });
        }

    }]);

angular.module('FistBump')
    .controller('GiveBumpController', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
        var ref = new Firebase("https://fistbump.firebaseio.com/players");
        $scope.teammates = $firebaseArray(ref);

        $scope.GiveBump = function(teammate, shoutout) {
            var url = "https://fistbump.firebaseio.com/players/" + teammate;
            var score = new Firebase(url + "/score");
            score.transaction(function(current_value) {
                return (current_value || 0) + 1;
            });
            if (shoutout) {
                var shoutouts = new Firebase("https://fistbump.firebaseio.com/shoutouts");
                shoutouts.push({name: teammate, shoutout: shoutout});
            }
            $scope.bumpee = '';
            $scope.shoutout = '';
        };

    }]);

angular.module('FistBump')
    .controller('ShoutController', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
        var ref = new Firebase("https://fistbump.firebaseio.com/shoutouts");
        var shoutouts = $firebaseArray(ref);
        $scope.shouts = [];
        for (var key in shoutouts) {
            $scope.shouts.push({
                name: shoutouts.name,
                shout: shoutouts.shoutout
            });
        }
        console.log($scope.shouts);
    }]);

angular.module('FistBump')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when("/",{
                templateUrl: "../index.html",
                controller: "GiveBumpController"
            })
            .when("/shoutouts", {
                templateUrl: "../shoutouts.html",
                controller: "ShoutController"
            })
    }]);