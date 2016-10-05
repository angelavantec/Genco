/**
 * Created by Sandeep on 01/06/14.
 */
angular.module('env.controllers',[])
.controller('MovieListController',function($scope,$state, $http,popupService,$stateParams, $window,Movie){

    //Django
    $scope.movies=Movie.query();

    console.log('get data');
        $scope.deleteMovie=function(movie){
            if(popupService.showPopup('Really delete this?')){
                movie.$delete(function(){
                    $window.location.href='';
                });
            }
        }



}).controller('MovieViewController',function($scope,$stateParams,Movie){
    console.log('get a');
    $scope.movie=Movie.get({id:$stateParams.id});

}).controller('MovieCreateController',function($scope,$state,$stateParams,Movie){

    $scope.movie=new Movie();

    $scope.addMovie=function(){
        $scope.movie.$save(function(){
            $state.go('movies');
        });
    }

}).controller('MovieEditController',function($scope,$state,$stateParams,Movie){


    $scope.updateMovie=function(){
        console.log('update');
        console.log($scope.movie);
        $scope.movie.$update(function(){
            $state.go('movies');
        });
    };

    $scope.loadMovie=function(){
        $scope.movie=Movie.get({id:$stateParams.id});
    };

    $scope.loadMovie();
});