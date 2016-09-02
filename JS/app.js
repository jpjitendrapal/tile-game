/**
 * Created by jitendrapal on 9/2/16.
 */

var App = angular.module("App",[]);

App.controller("TileGameCtrl",["$scope", function($scope){
  $scope.level = 1;
  $scope.levelGridMap = {
    1: new Array(9),
    2: new Array(16)
  };
  $scope.changeLevel = function(newLevl){
    if(newLevl > 100){
      return;
    }
    if(!$scope.levelGridMap[newLevl]){
      $scope.levelGridMap[newLevl] = new Array((parseInt(newLevl) + 2)*(parseInt(newLevl) + 2));
    }
    $scope.level = newLevl;
    $scope.setWidth(newLevl);
  };
  $scope.renderTiles = function(){

  };
  $scope.setWidth = function(level){
    var gridSize = parseInt(level) + 2,
      widthPercent = 100/gridSize;
    $scope.tileStyle = {
      "width": widthPercent + "%"
    }
  };

  function inIt() {
    $scope.setWidth($scope.level);
  }
  inIt();

}]);

