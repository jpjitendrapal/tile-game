/**
 * Created by jitendrapal on 9/2/16.
 */

var App = angular.module("App",[]);

App.controller("TileGameCtrl",["$scope","$interval", function($scope,$interval){
  $scope.changeLevel = function(newLevel){
    $scope.level = newLevel;
    $scope.chances = 3;
    createTiles();
    setWidth(newLevel);
  };

  $scope.resetGame = function(){
    $scope.changeLevel($scope.level);
  };
  $scope.startGame = function(){
    if($scope.chances == 3){
      createTiles();
    } else {
      updateTilesRemaining();
    }
    var howManyTilesToColor = $scope.levels[$scope.level].tilesToColor - $scope.tilesRemainig.length
      ,totalTiles = $scope.levels[$scope.level].numberOfTiles;

    $scope.tilesSelected = generateUniqueRands(howManyTilesToColor, totalTiles, $scope.tilesRemainig);
    $scope.tilesSelected.forEach(function(item){
      $scope.tiles[item-1].color = getRandomColor();
      $scope.tiles[item-1].colored = true;
      $scope.tiles[item-1].clicked = false;
    });
    $scope.tilesSelected = $scope.tilesSelected.concat($scope.tilesRemainig);
    $scope.playing = true;
    $scope.playerWin = undefined;
    $scope.playerLoose = undefined;
    startTimer();
  };
  $scope.stopGame = function (how) {
    stopTimer();
    $scope.playing = false;
    if(how == "loose"){
      $scope.chances = $scope.chances - 1;
      if($scope.chances == 0){
        //alert("Sorry you loose");
        $scope.playerLoose = true;
        $scope.resetGame();
      }
    } else if(how == "win"){
      $scope.playerWin = true;
      //alert("You win");
    }

  };

  $scope.tileClick = function(tile){
    if($scope.playing){
      tile.color = "#FFFFFF";
      tile.colored = false;
      tile.clicked = true;
    }
  };
  function startTimer(){
    $scope.timeRemaining = $scope.levels[$scope.level].timeDuration;
    $scope.timerId = $interval(function() {
      if ($scope.timeRemaining > 0) {
        updateTilesRemaining(); // updated remaining tiles
        $scope.timeRemaining = $scope.timeRemaining - 1000;
        if($scope.tilesRemainig.length == 0){
          $scope.stopGame("win");
        }
      } else {
        $scope.stopGame("loose");
      }
    }, 1000);
  }
  function stopTimer(){
    if (angular.isDefined($scope.timerId)) {
      $interval.cancel($scope.timerId);
      $scope.timerId = undefined;
    }
  }
  function updateTilesRemaining(){
    $scope.tilesRemainig = [];
    $scope.tilesSelected.forEach(function(tileNumber){
      if(!$scope.tiles[tileNumber-1].clicked && $scope.tiles[tileNumber-1].colored){
        $scope.tilesRemainig.push(tileNumber);
      }
    });
  }
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
          ,tilesToColor : (i+2)*(i+2) // how many tile we need for coloring
          ,timeDuration: (i+ Math.ceil(i/2) + 6)*1000
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
          ,colored: false
        }
      );
    }
  }
  // generate random numbers
  // param:n => how many numbers
  // param:r => within 1 to r range
  // param: exclude => exclude these numbers
  function generateUniqueRands(n,r, exclude){
    var arr = [], randomNumber, min = 0, max = r;
    if(n>r){
      return arr;
    }
    while(arr.length < n){
      randomNumber = Math.ceil( Math.random() * (max - min) + min);
      if(arr.indexOf(randomNumber) == -1 && exclude.indexOf(randomNumber) == -1) {
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
  // init method
  function inIt() {
    var LEVELS = 7;

    $scope.chances = 3;
    $scope.playing = false;
    $scope.playerWin = undefined;
    $scope.playerLoose = undefined;
    $scope.level = 0;
    $scope.levels = [];
    $scope.timerId = 0;
    $scope.timeRemaining = 0;
    $scope.tilesRemainig = [];
    $scope.tilesSelected = [];
    // create all the levels
    createLevels(LEVELS);
    createTiles();
    // set initial width of tiles for level 0
    setWidth($scope.level);
    $scope.selectedLevel = "0";
  }
  inIt();

}]);

