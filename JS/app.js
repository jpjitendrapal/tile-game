/**
 * Created by jitendrapal on 9/2/16.
 */

var App = angular.module("App",[]);

App.controller("TileGameCtrl",["$scope", function($scope){
  $scope.changeLevel = function(newLevel){
    $scope.level = newLevel;
    createTiles();
    setWidth(newLevel);
  };

  $scope.startGame = function(){
    $scope.tilesSelected = generateUniqueRands($scope.levels[$scope.level].tilesToClick,$scope.levels[$scope.level].numberOfTiles);
    $scope.tilesSelected.forEach(function(item,index,ar){
      console.log(item);
      console.trace();
      $scope.tiles[item].color = getRandomColor();
      $scope.tiles[item].selected = true;
    });
  };

  $scope.tileClick = function(tileId){

  };
  function setWidth(level){
    var gridSize = parseInt(level) + 3,
      widthPercent = 100/gridSize;
    $scope.tileStyle = {
      "width": widthPercent + "%"
    }
  }
  // generate number of levels
  function createLevels(numberOfLevels){
    for(var i= 0; i < numberOfLevels; i++){
      $scope.levels.push(
        {
          level: i
          ,numberOfTiles: (i + 3)*(i + 3)
          ,levelDisplay: (i+3) +"X" + (i+3)
          ,tilesToClick : (i+2)*(i+2)
        }
      );
    }
  }

  function createTiles(){
    var numberOfTiles = $scope.levels[$scope.level].numberOfTiles;
    $scope.tiles = [];
    for(var i = 0; i < numberOfTiles; i++){
      $scope.tiles.push(
        {
          tileNumber: i+1
          ,tileData: i+1
          ,clicked: false
          ,color: "#FFFFFF"
          ,selected: false
        }
      );
    }
  }
  // generate random numbers
  // param:n => how many numbers
  // param:r => within 1 to r range
  function generateUniqueRands(n,r){
    var arr = [], randomNumber, min = 1, max = r-1;
    if(n>r){
      return arr;
    }
    while(arr.length < n){
      randomNumber = Math.ceil( Math.random() * (max - min) + min);
      if(arr.indexOf(randomNumber) == -1) {
        arr.push(randomNumber);
      }
    }
    return arr;
  }

  function getRandomColor() {
    var color =  '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
    if(color == "#FFFFFF"){
      color = "#000000";
    }
    return color;
  }
  $scope.selectRandomTiles = function(){

  };
  // init method
  function inIt() {
    var LEVELS = 7;

    $scope.level = 0;
    $scope.levels = [];
    $scope.tilesSelected = [];
    createLevels(LEVELS);
    createTiles();
    // set initial width of tiles for level 0
    setWidth($scope.level);
    $scope.selectedLevel = "0";
  }
  inIt();

}]);

