/**
 * state constants
 */
define(function (){

	var model = {};

	var State = {
		READY: 0,
		DONE: 1,
		DOUBT: 2, //is a tagged as a doubt
		MARKED: 3 //marked as mine!!!
	};
	model.State = State;

	var SoundType = {
		CLICK: 0,
		EXPLOSION: 1
	};
	model.SoundType = SoundType;

	var GameDifficulty = {
		KIDS_PLAY:'kids-play',
		MEDIUM:'medium',
		INSANE:'insane'
	};
	model.GameDifficulty = GameDifficulty;
	/**
 	* content constants
 	*/
	var Content = {
		MINE: -1,
		NOTHING: 0,
		NEAR_1 : 1,
		NEAR_2 : 2,
		NEAR_3 : 3,
		NEAR_4 : 4,
		NEAR_5 : 5,
		NEAR_6 : 6,
		NEAR_7 : 7,
		NEAR_8 : 8
	}
	model.Content = Content;
	/**
	 * Square class
	 */
	function Square(x, y){
		this.x = x || 0;
		this.y = y || 0;
		this.content = Content.NOTHING;
		this.state = State.READY
	};
	Square.prototype.constructor = Square;
	Square.prototype.isStateReady = function (){return this.state === State.READY;};
	Square.prototype.isStateDone = function (){return this.state === State.DONE;};
	Square.prototype.isStateMarked = function (){return this.state === State.MARKED;};
	Square.prototype.isStateDoubt = function (){return this.state === State.DOUBT;};
	Square.prototype.isContentMine = function (){return this.content === Content.MINE;};
	model.Square = Square;

	GameSettings = function GameSettings(width, height, minesTotal){
		this.width = width || 0;
		this.height = height || 0;
		this.minesTotal = minesTotal || 0;
	};
	GameSettings.prototype.constructor = GameSettings;
	model.GameSettings = GameSettings;

	function Result(){
    this.state = null;
    this.squaresRevealed = 0;
    this.squaresRevealedPercent = 0;
    this.minesLeft = 0;
    this.formattedTime = null;
    this.clicks = 0;
	};
	Result.prototype.constructor = Result;
	model.Result = Result;

	var ResultState = {
		WIN: 0,
		LOSE: 1
	};
	model.ResultState = ResultState;

	return model;
});