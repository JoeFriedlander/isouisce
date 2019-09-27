/*
isoUisce by Joe Friedlander
Inspired by Wetrix developed by Zed Two
*/

window.onload = function() {
let canvas = document.getElementById("gameCanvas");
//disables right click causing menu to popup.
canvas.oncontextmenu = function() {
	return false;
};
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;
let tileWidth = 70;
let tileHeight = 40;
let gridColumnNum = 10;
let gridRowNum = 10;
let startingHeight = 2;
let maxHeight = 3;
let heightIncrease = .5;
let sinkAmount = .0009;

//Manages the blocks on the ground
class Ground {

	//Ground Block
	constructor(x, y, z, topColor, leftColor, rightColor, lineColor,
			shadowColor, waterZeroShadowColor, waterTwoColor, waterOneColor,
			waterZeroColor){
		this.x = x;
		this.y = y;
		this.z = z;
		this.topColor = topColor;
		this.leftColor = leftColor;
		this.rightColor = rightColor;
		this.shadowColor = shadowColor;
		this.waterZeroShadowColor = waterZeroShadowColor;
		this.waterTwoColor = waterTwoColor;
		this.waterOneColor = waterOneColor;
		this.waterZeroColor = waterZeroColor;
		this.displayTop = topColor;
		this.displayLeft = leftColor;
		this.displayRight = rightColor;
		this.lineColor = lineColor;
		this.displayLine = lineColor;

	};

	draw = function(){
		ctx.save();
		ctx.translate((this.x - this.y) * tileWidth / 2,
					(this.x + this.y) * tileHeight / 2);

		//draw top
		ctx.beginPath();
		ctx.strokeStyle = this.displayLine;
		ctx.moveTo(0, -this.z * tileHeight);
		ctx.lineTo(tileWidth / 2, tileHeight / 2 -this.z * tileHeight);
		ctx.lineTo(0, tileHeight - this.z * tileHeight);
		ctx.lineTo(-tileWidth / 2, tileHeight / 2 -this.z * tileHeight);
		ctx.closePath();
		ctx.fillStyle = this.displayTop;
		ctx.fill();
		ctx.stroke();

		// draw left
		ctx.beginPath();
		ctx.strokeStyle = this.displayLine;
		ctx.moveTo(-tileWidth / 2, tileHeight / 2 - this.z * tileHeight);
		ctx.lineTo(0, tileHeight - this.z * tileHeight);
		ctx.lineTo(0, tileHeight);
		ctx.lineTo(-tileWidth / 2, tileHeight / 2);
		ctx.closePath();
		ctx.fillStyle = this.displayLeft;
		ctx.fill();
		ctx.stroke();

		// draw right
		ctx.beginPath();
		ctx.strokeStyle = this.displayLine;
		ctx.moveTo(tileWidth / 2, tileHeight / 2 - this.z * tileHeight);
		ctx.lineTo(0, tileHeight - this.z * tileHeight);
		ctx.lineTo(0, tileHeight);
		ctx.lineTo(tileWidth / 2, tileHeight / 2);
		ctx.closePath();
		ctx.fillStyle = this.displayRight;
		ctx.fill();
		ctx.stroke();

		ctx.restore();

	};

	update = function(){
		this.manageColor();
		this.sink();
	};

	manageColor = function(){
		
		//manages shadows
		let hasTopShadow = false;
		let hasLeftShadow = false;
		let hasRightShadow = false;
		for(let block in Sky.skyHolder){
			if(Sky.skyHolder[block].x == this.x &&
				Sky.skyHolder[block].y == this.y){
					hasTopShadow = true;
					if(this.y != gridColumnNum - 1){
						hasLeftShadow = true;
					}
					if(this.x != gridRowNum - 1){
						hasRightShadow = true;
					}
			}
		}
		
		//manages sinking color, becomes more blue as ground z is smaller, if z is 0 or below then it is same as background
		if(this.z <= 0){
			this.displayTop = hasTopShadow? this.waterZeroShadowColor :
											this.waterZeroColor;
			this.displayLeft = hasLeftShadow? this.waterZeroShadowColor :
											this.waterZeroColor;
			this.displayRight = hasRightShadow? this.waterZeroShadowColor :
												this.waterZeroColor;
			this.displayLine = this.waterZeroColor;
			this.displayLine = this.waterZeroColor;
			this.displayLine = this.waterZeroColor;
		}
		else if(this.z < .3){
			this.displayTop = hasTopShadow? this.shadowColor :
											this.waterOneColor;
			this.displayLeft = hasLeftShadow? this.shadowColor :
											this.waterOneColor;
			this.displayRight = hasRightShadow? this.shadowColor :
												this.waterOneColor;
		}
		else if(this.z < .5){
			this.displayTop = hasTopShadow? this.shadowColor :
											this.waterTwoColor;
			this.displayLeft = hasLeftShadow? this.shadowColor :
											this.waterTwoColor;
			this.displayRight = hasRightShadow? this.shadowColor :
												this.waterTwoColor;
		}
		else if(this.z >= .5){
			this.displayTop = hasTopShadow? this.shadowColor :
											this.topColor;
			this.displayLeft = hasLeftShadow? this.shadowColor :
											this.leftColor;
			this.displayRight = hasRightShadow? this.shadowColor :
												this.rightColor;
		}
		/*
		//manages transparency if skyblock is behind groundblock
		//Need transparency for blocks behidn blocks. Need to
		//prevent flickering sometimes if skyshape added to blocks of max
		//height
		for(block in Sky.skyHolder){
			if(Sky.skyHolder[block].z <= this.z && skyHolder[block].z > 1){
				this.displayTop = this.displayTop.substring(0, 17) + ".3)";
				this.displayLeft = this.displayLeft.substring(0, 17) + ".3)";
				this.displayRight = this.displayRight.substring(0, 17) + ".3)";
			}
		}*/

	};

	sink = function(){
		if(this.z>=0){
			this.z-=sinkAmount;
		}
	};

	//Ground Holder
	static groundHolder = new Array(gridColumnNum);
	static numSubmerged = 0;
	static maxSubmerged = ((gridColumnNum*gridRowNum) / 2);
	static initializeGroundHolder(){
		for(let i = 0; i < gridColumnNum; i++){
			Ground.groundHolder[i] = new Array(gridRowNum);
			for(let j = 0; j < gridRowNum; j++){
				Ground.groundHolder[i][j] = new Ground(
						i, //x
						j, //y
						//((i == 0 || i == 9 || j == 0 || j == 9) ? startingHeight + 1 : (Math.random() * 1) ), //z
						startingHeight,
						//Math.random()),
						"hsla(0, 0%, 73%, 1)", //topColor
						"hsla(0, 0%, 80%, 1)", //leftColor
						"hsla(0, 0%, 60%, 1)", //rightColor
						"hsla(0, 0%, 0%, 1)", //lineColor
						"hsla(0, 0%, 29%, 1)", //shadowColor
						"hsla(211, 72%, 9%, 1)", //waterZeroShadowColor
						"hsla(189, 26%, 73%, 1)", //waterTwoColor
						"hsla(189, 26%, 42%, 1)", //waterOneColor
						"hsla(191, 89%, 7%, 1)" //waterZeroColor
				);
			}
		}
	};

	static update() {
		let submergedCount = 0;
		for(let i = 0; i < Ground.groundHolder.length; i++){
			for(let j = 0; j < Ground.groundHolder[i].length; j++){
				Ground.groundHolder[i][j].update();
				if(Ground.groundHolder[i][j].z <= 0){
					submergedCount++;
				}
			}
			Ground.numSubmerged = submergedCount
			if(Ground.numSubmerged >= Ground.maxSubmerged){
				Sky.reset();
				Ground.reset();
				HUD.reset();
			}
		}
	};

	static draw(){
		for(let i = 0; i < Ground.groundHolder.length; i++){
			for(let j = 0; j < Ground.groundHolder[i].length; j++){
				Ground.groundHolder[i][j].draw();
			}
		}
	};
	
	static reset(){
		for(let i = 0; i < Ground.groundHolder.length; i++){
			for(let j = 0; j < Ground.groundHolder[i].length; j++){
				Ground.groundHolder[i][j].z = startingHeight;
			}
		}
	};

	static addHeight(){
		for(let block in Sky.skyHolder){
			//not underwater
			if(Ground.groundHolder[(Sky.skyHolder[block].x)][Sky.skyHolder[block].y].z > 0){
				Ground.groundHolder[(Sky.skyHolder[block].x)][Sky.skyHolder[block].y].z +=
					heightIncrease;
				//not above max height
				if(Ground.groundHolder[(Sky.skyHolder[block].x)][Sky.skyHolder[block].y].z >= maxHeight){
					Ground.groundHolder[(Sky.skyHolder[block].x)][Sky.skyHolder[block].y].z = maxHeight;
				}
			}
		}
	};
};

//Manages the shape that the user controls in the sky
class Sky {

	//Sky Block
	static skyBlockDefaultZ = 8;
	constructor(x, y, z){
		this.x = x;
		this.y = y;
		this.z = z;
		//gives id so skyBlock can be deleted later
		this.id = Object.keys(Sky.skyHolder).length;
		this.topColor = "hsla(220, 61%, 60%, 1)";
		this.leftColor = "hsla(0, 0%, 80%, 1)";
		this.rightColor = "hsla(0, 0%, 60%, 1)";
	};

	draw = function(){
		ctx.save();
		ctx.translate((this.x - this.y) * tileWidth / 2,
					(this.x + this.y) * tileHeight / 2);

		//draw top
		ctx.beginPath();
		ctx.moveTo(0, -this.z * tileHeight);
		ctx.lineTo(tileWidth / 2, tileHeight / 2 -this.z * tileHeight);
		ctx.lineTo(0, tileHeight - this.z * tileHeight);
		ctx.lineTo(-tileWidth / 2, tileHeight / 2 -this.z * tileHeight);
		ctx.closePath();
		ctx.fillStyle = this.topColor;
		ctx.fill();
		ctx.stroke();

		// draw left
		ctx.beginPath();
		ctx.moveTo(-tileWidth / 2, tileHeight / 2 - this.z * tileHeight);
		ctx.lineTo(0, tileHeight - this.z * tileHeight);
		ctx.lineTo(0, 1.5*tileHeight - this.z * tileHeight);
		ctx.lineTo(-tileWidth / 2,
				tileHeight / 2 - (this.z * tileHeight) + .5*tileHeight);
		ctx.closePath();
		ctx.fillStyle = this.leftColor;
		ctx.fill();
		ctx.stroke();

		// draw right
		ctx.beginPath();
		ctx.moveTo(tileWidth / 2, tileHeight / 2 - this.z * tileHeight);
		ctx.lineTo(0, tileHeight - this.z * tileHeight);
		ctx.lineTo(0, 1.5*tileHeight - this.z * tileHeight);
		ctx.lineTo(tileWidth / 2,
				tileHeight / 2 - (this.z * tileHeight) + .5*tileHeight);
		ctx.closePath();
		ctx.fillStyle = this.rightColor;
		ctx.fill();
		ctx.stroke();

		ctx.restore();
	};

	update = function(){
		this.touchGroundCheck();
	};

	touchGroundCheck = function(){
		if(this.z - 1 <= Ground.groundHolder[this.x][this.y].z){
			Sky.skyBlockTouchedGround();
		}
	};

	//Sky Holder
	static skyHolder = [];

	static draw(){
		for(let block in Sky.skyHolder){
			Sky.skyHolder[block].draw();
		}
	};

	static update(){
		for(let block in Sky.skyHolder){
			Sky.skyHolder[block].update();
		}
	};

	static skyHolderMove(e){
		let canMove = true;
		switch(e.keyCode){
			//keypad up
			case 104:
				for(let block in Sky.skyHolder){
					if(!(Sky.skyHolder[block].x > 0) ||
					!(Sky.skyHolder[block].y > 0)){
						canMove = false;
					}
				}
				if(canMove){
					for(let block in Sky.skyHolder){
						Sky.skyHolder[block].x--;
						Sky.skyHolder[block].y--;
					}
				}
			break;
			//down
			case 98:
				for(let block in Sky.skyHolder){
					if(!(Sky.skyHolder[block].x < gridColumnNum - 1) ||
					!(Sky.skyHolder[block].y < gridRowNum - 1)){
						canMove = false;
					}
				}
				if(canMove){
					for(let block in Sky.skyHolder){
						Sky.skyHolder[block].x++;
						Sky.skyHolder[block].y++;
					}
				}
			break;
			//right
			case 102:
				for(let block in Sky.skyHolder){
					if(!(Sky.skyHolder[block].x < gridColumnNum - 1) ||
					!(Sky.skyHolder[block].y > 0)){
						canMove = false;
					}
				}
				if(canMove){
					for(let block in Sky.skyHolder){
						Sky.skyHolder[block].x++;
						Sky.skyHolder[block].y--;
					}
				}
			break;
			//left
			case 100:
				for(let block in Sky.kyHolder){
					if(!(Sky.skyHolder[block].x> 0) ||
					!(Sky.skyHolder[block].y < gridRowNum - 1)){
						canMove = false;
					}
				}
				if(canMove){
					for(let block in Sky.skyHolder){
						Sky.skyHolder[block].x--;
						Sky.skyHolder[block].y++;
					}
				}
			break;
			//down right
			case 99:
				for(let block in Sky.skyHolder){
					if(!(Sky.skyHolder[block].x < gridColumnNum - 1)){
						canMove = false;
					}
				}
				if(canMove){
					for(let block in Sky.skyHolder){
						Sky.skyHolder[block].x++;
					}
				}
			break;
			//down left
			case 97:
				for(let block in Sky.skyHolder){
					if(!(Sky.skyHolder[block].y < gridRowNum - 1)){
						canMove = false;
					}
				}
				if(canMove){
					for(let block in Sky.skyHolder){
						Sky.skyHolder[block].y++;
					}
				}
			break;
			//up left
			case 103:
				for(let block in Sky.skyHolder){
					if(!(Sky.skyHolder[block].x > 0)){
						canMove = false;
					}
				}
				if(canMove){
					for(let block in Sky.skyHolder){
						Sky.skyHolder[block].x--;
					}
				}
			break;
			//up right
			case 105:
				for(let block in Sky.skyHolder){
					if(!(Sky.skyHolder[block].y > 0)){
						canMove = false;
					}
				}
				if(canMove){
					for(let block in Sky.skyHolder){
						Sky.skyHolder[block].y--;
					}
				}
			break;

		}
		//space or 5 key to place the piece
		switch(e.keyCode){
			case 101:
			case 32:
				for(let block in Sky.skyHolder){
					Sky.skyHolder[block].z-=4;
				}
			break;
		}
		//Occasionally x or y will be -1 or 10 (out of range), need to troubleshoot that, for now put it back to 0 or 9.
		for(let block in Sky.skyHolder){
			if(Sky.skyHolder[block].x < 0) {
				Sky.skyHolder[block].x = 0;
			}
			if(Sky.skyHolder[block].y < 0) {
				Sky.skyHolder[block].y = 0;
			}
			if(Sky.skyHolder[block].x > gridColumnNum -1 ) {
				Sky.skyHolder[block].x = gridColumnNum - 1;
			}
			if(Sky.skyHolder[block].y > gridRowNum - 1) {
				Sky.skyHolder[block].y = gridRowNum - 1;
			}
		}
	};

	static createSkyShape(){
		let choice = Math.random()*75;
		if(choice < 25){
			//square
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2) - 2,
			Math.floor(gridRowNum/2),Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2) - 1,
			Math.floor(gridRowNum/2),Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2),
			Math.floor(gridRowNum/2),Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2 + 1),
			Math.floor(gridRowNum/2),Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2 + 2),
			Math.floor(gridRowNum/2),Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2 + 2),
			Math.floor(gridRowNum/2) + 1,Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2 + 2),
			Math.floor(gridRowNum/2) + 2,Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2 + 2),
			Math.floor(gridRowNum/2) + 3,Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2) - 2,
			Math.floor(gridRowNum/2) + 1,Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2 - 2),
			Math.floor(gridRowNum/2) + 2,Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2 - 2),
			Math.floor(gridRowNum/2) + 3,Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2 - 2),
			Math.floor(gridRowNum/2) + 4,Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2 - 1),
			Math.floor(gridRowNum/2) + 4,Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2 - 0),
			Math.floor(gridRowNum/2) + 4,Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2 + 1),
			Math.floor(gridRowNum/2) + 4,Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2 + 2),
			Math.floor(gridRowNum/2) + 4,Sky.skyBlockDefaultZ));
		}
		else if(choice >=25 && choice < 50){
			//squiggle
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2) - 2,
			Math.floor(gridRowNum/2) + 1,Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2),
			Math.floor(gridRowNum/2),Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2) - 1,
			Math.floor(gridRowNum/2) + 1,Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2),
			Math.floor(gridRowNum/2) + 1,Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2) + 1,
			Math.floor(gridRowNum/2),Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2) + 2,
			Math.floor(gridRowNum/2),Sky.skyBlockDefaultZ));
		}
		else if(choice >=50 && choice <= 75){
			//line
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2) - 2,
			Math.floor(gridRowNum/2),Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2) - 1,
			Math.floor(gridRowNum/2),Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2),
			Math.floor(gridRowNum/2),Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2) + 1,
			Math.floor(gridRowNum/2),Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2) + 2,
			Math.floor(gridRowNum/2),Sky.skyBlockDefaultZ));

		}
	};

	static deleteSkyShape(){
		for(let block in Sky.skyHolder){
			delete Sky.skyHolder[block];
		}
	};

	static splashCheck(){
		for(let block in Sky.skyHolder){
			if(Ground.groundHolder[(Sky.skyHolder[block].x)][Sky.skyHolder[block].y].z <= 0){
				if (Sky.skyHolder[block].x < gridColumnNum){
					Ground.groundHolder[(Sky.skyHolder[block].x+1)][Sky.skyHolder[block].y].z = 0;
				}
				console.log("splash")
			}
		}
	}

	static skyBlockTouchedGround(){
		//If part of the the skyshape touches the ground, the rest of it is
		//moved down as well.
		if (Sky.splashCheck()) {

		}
		Ground.addHeight();
		Sky.deleteSkyShape();
		Sky.createSkyShape();
	};

	static reset(){
		for(let block in Sky.skyHolder){
			Sky.skyHolder[block].z = Sky.skyBlockDefaultZ;
		}
	};
};

//Manages animals. will be similar to sky
class Animal {

};

//Manages the heads up display. Score and top down view
class HUD {

	static score = 0;
	static timerRunning = false;
	static timerInterval;

	static draw(){
		//Draw score and other numbers
		ctx.font = "25pt Garamond3Medium";
		ctx.fillStyle = "gold";
		ctx.fillText(HUD.score, -325, -180);
		ctx.fillStyle = "white";
		ctx.fillText("Score: ", -500, -180);
		ctx.fillText("Submerged:  " + Ground.numSubmerged, -500, -150);
		ctx.fillText("out of max:   " + Ground.maxSubmerged, -500, -120);

		//draw minimap

	};

	static update(){
		if (!HUD.timerRunning){
			HUD.timerInterval = setInterval(function(){
												HUD.increaseScore()
											}, 1000);
			HUD.timerRunning = true;
		}
	};

	static increaseScore(){
		HUD.score+=10;
	};

	static reset(){
		HUD.score = 0;
		HUD.timerRunning = false;
		clearInterval(HUD.timerInterval);
	};

};

//MUSIC AND SOUNDS =======================================================
var introSong = new Audio('data/sound/igor.wav');
function resetIntroSong() {
	introSong.currentTime=0;
	introSong.play();
};

//UPDATE =================================================================
function update(){
	//Updates ground
	Ground.update();
	//Updates sky
	Sky.update();
	//Updates HUD
	HUD.update();
};

//RENDER ================================================================
function render(){
	//refreshes screen
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//sets origin closer to middle of screen
	ctx.save();
	ctx.translate(width / 2, height / 2.1);
	//draws ground blocks
	Ground.draw();
	//draws surroundings
	
	//draws sky blocks
	Sky.draw();
	//draws HUD
	HUD.draw();
	//restores canvas coordinates
	ctx.restore();
};

//MAIN LOOP ==============================================================
function frame() {
	update();
	render();
	requestAnimationFrame(frame);
};
introSong.pause()
setTimeout(function () {      
	introSong.play();
 }, 150);
Ground.initializeGroundHolder();
Sky.createSkyShape();
requestAnimationFrame(frame);

//EVENT LISTENERS =======================================================
//Handles key presses
window.addEventListener("keydown", Sky.skyHolderMove, false);
//Loops song
introSong.addEventListener("ended", resetIntroSong, false);
//Stops intervals if window is minimized - not working yet
document.addEventListener("visibilitychange", function() {
	HUD.TimerRunning = false;
  }, false);
}
