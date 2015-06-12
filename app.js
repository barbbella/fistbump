/**
 * Created by kjefferson on 6/11/2015.
 */

var app = angular.module('FistBump', ['firebase'])
    .controller('GiveBumpController', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
        var auth = new Firebase("https://fistbump.firebaseio.com/");
        auth.authWithOAuthPopup('google', function(error, authData) {
            $scope.username = authData.google.displayName;
            if (error) {
                console.log('Login failed', error);
            } else {
                console.log('Authenticated successfully.');

            }
        });
        auth.onAuth(function(authData) {
            var newUser = true;
            if (authData && newUser) {
                auth.child("users").child(authData.uid).set({
                    provider: authData.provider,
                    name: authData.google.displayName
                });
            }
        });

        var ref = new Firebase("https://fistbump.firebaseio.com/players");
        $scope.teammates = $firebaseArray(ref);

        $scope.GiveBump = function(teammate, shoutout) {
            var url = "https://fistbump.firebaseio.com/players/" + teammate;
            var score = new Firebase(url + "/score");
            score.transaction(function(current_value) {
                return (current_value || 0) + 1;
            });
            if (shoutout) {
                var shoutouts = new Firebase(url + "/shoutouts");
                shoutouts.push(shoutout);
            }
            $scope.bumpee = '';
            $scope.shoutout = '';
        };

    }]);

