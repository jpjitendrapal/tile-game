/**
 * Created by jitendrapal on 9/2/16.
 */

var App = angular.module("App",[]);

// tile game controller
App.controller("TileGameCtrl",["$scope","$interval","$timeout", function($scope,$interval,$timeout){
  // ******* START : private functions *********
  /**
   * Start the timer (it update time in every second)
   */
  function startTimer(){
    $scope.timeRemaining = $scope.levels.timeDuration;
    $scope.timerId = $interval(function() {
      if ($scope.timeRemaining > 0) {
        updateTilesRemaining(); // update remaining tiles
        $scope.timeRemaining = $scope.timeRemaining - 1000;
        if($scope.tilesRemaining.length == 0){
          $scope.stopGame("win");
        }
      } else {
        $scope.stopGame("loose");
      }
    }, 1000);
  }

  /**
   * Stop the timer (it stop the timer and clear interval which is called in startTimer function)
   */
  function stopTimer(){
    if (angular.isDefined($scope.timerId)) {
      $interval.cancel($scope.timerId);
      $scope.timerId = undefined;
    }
    if (angular.isDefined($scope.timerIdGameStop)) {
      $timeout.cancel($scope.timerIdGameStop);
      $scope.timerIdGameStop = undefined;
    }
  }

  /**
   * Update scope variable tilesRemaining array
   */
  function updateTilesRemaining(){
    $scope.tilesRemaining = [];
    $scope.tilesSelected.forEach(function(tileNumber){
      if(!$scope.tiles[tileNumber-1].clicked && $scope.tiles[tileNumber-1].colored){
        $scope.tilesRemaining.push(tileNumber);
      }
    });
  }
  /**
   * Set width of all the tiles
   * @param {number} current level
   */
  function setWidth(size){
    var gridSize = parseInt(size),
      widthPercent = 100/gridSize;
    $scope.tileStyle = {
      "width": widthPercent + "%"
    }
  }
  /**
   * Create all the levels with its configuration
   * @param {number} total number of level to add in the game
   */
  function createLevels(gridSize){
    $scope.levels = {};
    var i = parseInt(gridSize);
    $scope.levels =
      {
        level: i
        ,numberOfTiles: (i)*(i)
        ,levelDisplay: (i) +"X" + (i)
        ,tilesToColor : $scope.TILESTOCOLORED || (i-1)*(i-1) // how many tile we need for coloring
        ,timeDuration: (i+ Math.ceil(i/2))*1000
      };
  }
  /**
   * Create all the tiles with its initial configuration
   */
  function createTiles(){
    var numberOfTiles = $scope.levels.numberOfTiles;
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

  /**
   * Generate random number for the given range
   * @param {number} required random numbers
   * @param {number} max range for random numbers
   * @param {Array}  these numbers should not be present in random numbers generated
   * @return {Array} return random numbers array
   */
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

  /**
   * Get random color
   * @return {String} return color in string format
   */
  function getRandomColor() {
    var color =  '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
    if(color == "#FFFFFF"){
      color = "#000000";
    }
    return color;
  }
  // **** END : private functions ********

  /**
   * Change level of game
   * @param {number} new level to be select
   */
  $scope.changeLevel = function(newLevel){
    $scope.level = newLevel - 1;
    $scope.chances = $scope.TOTALCHANCES;
    createLevels(newLevel);
    createTiles();
    setWidth(newLevel);
  };

  /**
   * Reset the game settings
   */
  $scope.resetGame = function(){
    $scope.playing = false;
    $scope.playerWin = undefined;
    $scope.playerLoose = undefined;
    $scope.timerId = 0;
    $scope.timeRemaining = 0;
    $scope.tilesRemaining = [];
    $scope.tilesSelected = [];
    $scope.changeLevel($scope.GRIDSIZE);
  };

  /**
   * Start the Game
   */
  $scope.startGame = function(){
    if($scope.GRIDSIZE > 1 && $scope.TOTALCHANCES > 0 && parseInt($scope.GRIDSIZE)*parseInt($scope.GRIDSIZE) > $scope.TILESTOCOLORED){
      stopTimer();
      if($scope.chances == $scope.TOTALCHANCES || $scope.chances == 0){
        $scope.resetGame();
      } else {
        updateTilesRemaining();
      }
      var howManyTilesToColor = $scope.levels.tilesToColor - $scope.tilesRemaining.length
        ,totalTiles = $scope.levels.numberOfTiles;

      $scope.tilesSelected = generateUniqueRands(howManyTilesToColor, totalTiles, $scope.tilesRemaining);
      $scope.tilesSelected.forEach(function(item){
        $scope.tiles[item-1].color = getRandomColor();
        $scope.tiles[item-1].colored = true;
        $scope.tiles[item-1].clicked = false;
      });
      $scope.tilesSelected = $scope.tilesSelected.concat($scope.tilesRemaining);
      $scope.playing = true;
      $scope.playerWin = undefined;
      $scope.playerLoose = undefined;
      startTimer();
    }
  };

  /**
   * Stop the game
   * @param {String} how game stopped (win or loose)
   */
  $scope.stopGame = function (how) {
    stopTimer();
    $scope.playing = false;
    if(how == "loose"){
      $scope.chances = $scope.chances - 1;
      if($scope.chances == 0){
        $scope.playerLoose = true;
        $scope.timerIdGameStop = $timeout(function(){
          $scope.resetGame();
        }, 2000);
      } else if($scope.chances > 0) {
        $scope.startGame();
      }
    } else if(how == "win"){
      $scope.playerWin = true;
      $scope.timerIdGameStop = $timeout(function(){
        $scope.resetGame();
      }, 2000);
    }
  };

  /**
   * Triggered when any tile is clicked during game playing
   * @param {Object} tile object
   */
  $scope.tileClick = function(tile){
    if($scope.playing){
      tile.color = "#FFFFFF";
      tile.colored = false;
      tile.clicked = true;
    }
  };

  /**
   * Initializer method
   */
  function inIt() {
    $scope.GRIDSIZE = 6; // total number of levels to be add in the game
    $scope.TOTALCHANCES = 3; // total number of chances to give to users
    $scope.chances = $scope.TOTALCHANCES; // total chances remaining
    $scope.TILESTOCOLORED = 12;
    $scope.playing = false;
    $scope.playerWin = undefined;
    $scope.playerLoose = undefined;
    $scope.level = 0;
    $scope.levels = {};
    $scope.timerId = undefined;
    $scope.timerIdGameStop = undefined;
    $scope.timeRemaining = 0;
    $scope.tilesRemaining = [];
    $scope.tilesSelected = [];
    // create all the levels
    createLevels($scope.GRIDSIZE);
    // create required tiles
    createTiles();
    // set initial width of tiles for corresponding level
    setWidth($scope.GRIDSIZE);
    $scope.selectedLevel = "0";
  }

  inIt();
}]);

