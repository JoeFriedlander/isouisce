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

//Settings
let tileWidth = 70;
let tileHeight = 40;
let gridColumnNum = 10;
let gridRowNum = 8;
let startingHeight = 1.5;
let maxHeight = 3;
let heightIncrease = .6;
let sinkAmount = .0003;

//Manages the blocks on the ground
class Ground {

	//Ground Block
	constructor(z){
		this.z = z;
		this.topColor = "hsla(0, 0%, 73%, 1)";
		this.leftColor = "hsla(0, 0%, 80%, 1)";
		this.rightColor = "hsla(0, 0%, 60%, 1)";
		this.shadowColor = "hsla(0, 0%, 29%, 1)";
		this.waterZeroShadowColor = "hsla(360, 100%, 24%, 1)";
		this.waterTwoColor = "hsla(189, 26%, 73%, 1)";
		this.waterOneColor = "hsla(189, 26%, 42%, 1)";
		this.waterZeroColor = "hsla(191, 89%, 7%, 1)";
		this.displayTop = this.topColor;
		this.displayLeft = this.leftColor;
		this.displayRight = this.rightColor;
		this.lineColor = "hsla(0, 0%, 0%, 1)";
		this.displayLine = "hsla(0, 0%, 0%, 1)";
	};

	static rotateLeft() {
		let tempGroundHolder = new Array(gridRowNum);
		for(let i = 0; i < gridRowNum; i++){
			tempGroundHolder[i] = [];
			for(let j = 0; j < gridColumnNum; j++){
				tempGroundHolder[i][j] = new Ground(Ground.groundHolder[j][i].z);
			}
			tempGroundHolder[i].reverse();
		}
		Ground.groundHolder = tempGroundHolder;
		//rotates sky block
		Sky.rotate();
		//updates row and column number
		let tempGridRowNum = gridRowNum;
		gridRowNum = gridColumnNum;
		gridColumnNum = tempGridRowNum;
	}

	draw = function(x,y){
		ctx.save();
		ctx.translate((x - y) * tileWidth / 2,
					(x + y) * tileHeight / 2);
		ctx.shadowColor = 'black';
		ctx.shadowBlur = 1.3;

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

	update = function(x,y){
		this.manageColor(x,y);
		this.sink();
	};

	manageColor = function(x,y){
		//manages shadows
		let hasTopShadow = false;
		let hasLeftShadow = false;
		let hasRightShadow = false;
		for(let block in Sky.skyHolder){
			if(Sky.skyHolder[block].x == x &&
				Sky.skyHolder[block].y == y){
					hasTopShadow = true;
					if(y != gridRowNum-1){
						hasLeftShadow = true;
					}
					if(x != gridColumnNum-1){
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
		//Manages height dependant color. It's lighter the higher up it is, this helps prevent confusion of blocks next to one another
		else if(this.z >= .5){
			this.topColor = "hsla(0, 0%, " + (75 + (this.z * 10)) + "%, 1)"
			this.rightColor = "hsla(0, 0%, " + (20 + (this.z * 20)) + "%, 1)"
			this.leftColor = "hsla(0, 0%, " + (80 + (this.z * 5)) + "%, 1)"
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
						//((i == 0 || i == 9 || j == 0 || j == 9) ? startingHeight + 1 : (Math.random() * 1) ), //z
						startingHeight,
						//Math.random()),
				);
			}
		}
	};

	static update() {
		let submergedCount = 0;
		for(let x = 0; x < gridColumnNum; x++){
			for(let y = 0; y < gridRowNum; y++){
				Ground.groundHolder[x][y].update(x,y);
				if(Ground.groundHolder[x][y].z <= 0){
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
		for(let x = 0; x < gridColumnNum; x++){
			for(let y = 0; y < gridRowNum; y++){
				Ground.groundHolder[x][y].draw(x,y);
			}
		}
	};
	
	static reset(){
		for(let i = 0; i < gridColumnNum; i++){
			for(let j = 0; j < gridRowNum; j++){
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

	//Sky Block. The center block is what the shape rotates around
	static skyBlockDefaultZ = 8;
	constructor(x, y, z, centerBlock){
		this.x = x;
		this.y = y;
		this.z = z;
		this.centerBlock = centerBlock;
		//gives id so skyBlock can be deleted later
		this.id = Object.keys(Sky.skyHolder).length;
		this.topColor = "hsla(0, 10%, 73%, 1)";
		this.leftColor = "hsla(100, 15%, 80%, 1)";
		this.rightColor = "hsla(150, 10%, 60%, 1)";
	};

	draw = function(){
		ctx.save();
		ctx.translate((this.x - this.y) * tileWidth / 2,
					(this.x + this.y) * tileHeight / 2);
		ctx.shadowColor = 'black';
		ctx.shadowBlur = 1.5;

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

	static rotate(){
		//creates array with current grid dimensions
		let skyBlockLocationArray = new Array(gridColumnNum)
		for(let i = 0; i < gridColumnNum; i++){
			skyBlockLocationArray[i] = new Array(gridRowNum);
			for(let j = 0; j < gridRowNum; j++){
				skyBlockLocationArray[i][j] = false;
			}
		}
		//sets hasSkyBlock to True on each object where a skyblock exists
		for(let block of Sky.skyHolder){
			skyBlockLocationArray[block.x][block.y] = true;
		}
		//rotates array
		let tempArray = new Array(gridRowNum);
		for(let i = 0; i < gridRowNum; i++){
			tempArray[i] = [];
			for(let j = 0; j < gridColumnNum; j++){
				tempArray[i][j] = skyBlockLocationArray[j][i];
			}
			tempArray[i].reverse();
		}
		//deletes current skyShape
		Sky.deleteSkyShape();
		//creates new sky shape from rotated array information
		for (let i = 0; i < tempArray.length; i++) {
			for (let j = 0; j < tempArray[0].length; j++) {
				if (tempArray[i][j] == true){
					Sky.skyHolder.push(new Sky(i,j,Sky.skyBlockDefaultZ));
				}
			} 
		}
	}

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
				for(let block in Sky.skyHolder){
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

		//space or 5 key to place the piece
			case 101:
			case 32:
				for(let block in Sky.skyHolder){
					Sky.skyHolder[block].z-=8;
				}
			break;
			case 65:
			Ground.rotateLeft();
			break;
			case 68:
			Ground.rotateLeft();
			Ground.rotateLeft();
			Ground.rotateLeft();
			//reverses sun
			//Background.reverseSun();
			break;
		}
	};

	static createSkyShape(){
		let choice = Math.random()*100;
		if(choice >=0 && choice < 20){
			//squiggle
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2),Math.floor(gridRowNum/2) - 1,Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2) - 1,Math.floor(gridRowNum/2),Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2),Math.floor(gridRowNum/2),Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2) + 1,Math.floor(gridRowNum/2) - 1,Sky.skyBlockDefaultZ));
		}
		else if(choice >=20 && choice < 40){
			//line
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2) - 2,Math.floor(gridRowNum/2),Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2) - 1,Math.floor(gridRowNum/2),Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2),Math.floor(gridRowNum/2),Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2) + 1,Math.floor(gridRowNum/2),Sky.skyBlockDefaultZ));
		}
		//L shape
		else if(choice >=40 && choice < 60){
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2) - 1,Math.floor(gridRowNum/2) - 1,Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2),Math.floor(gridRowNum/2) - 1,Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2) + 1,Math.floor(gridRowNum/2) - 1,Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2) - 1,Math.floor(gridRowNum/2),Sky.skyBlockDefaultZ));
		}
		//closed square
		else if(choice >= 60 && choice < 80){
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2) - 1,Math.floor(gridRowNum/2)-1,Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2) - 1,Math.floor(gridRowNum/2),Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2),Math.floor(gridRowNum/2)-1,Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2),Math.floor(gridRowNum/2),Sky.skyBlockDefaultZ));
		}
		// T
		else if(choice >= 80 && choice < 100){
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2) - 2,Math.floor(gridRowNum/2) - 1,Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2) - 1,Math.floor(gridRowNum/2) - 1,Sky.skyBlockDefaultZ, true));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2),Math.floor(gridRowNum/2) - 1,Sky.skyBlockDefaultZ));
			Sky.skyHolder.push(new Sky(Math.floor(gridColumnNum/2) - 1,Math.floor(gridRowNum/2),Sky.skyBlockDefaultZ));
		}
	};

	static deleteSkyShape(){
		Sky.skyHolder = [];
	};

	static splashCheck(){
		for(let block in Sky.skyHolder){
			//if the skyblock touches a water square
			if(Ground.groundHolder[(Sky.skyHolder[block].x)][Sky.skyHolder[block].y].z <= 0){
				console.log("splash")
				//lowers block x+1 to zero
				if (Sky.skyHolder[block].x < gridColumnNum-1){
					Ground.groundHolder[(Sky.skyHolder[block].x+1)][Sky.skyHolder[block].y].z = 0;
				}
				//lowers block x-1 to zero
				if (Sky.skyHolder[block].x > 0){
					Ground.groundHolder[(Sky.skyHolder[block].x-1)][Sky.skyHolder[block].y].z = 0;
				}
				//lowers block y+1 to zero
				if (Sky.skyHolder[block].y < gridRowNum-1){
					Ground.groundHolder[(Sky.skyHolder[block].x)][Sky.skyHolder[block].y+1].z = 0;
				}
				//lowers block y-1 to zero
				if (Sky.skyHolder[block].y > 0){
					Ground.groundHolder[(Sky.skyHolder[block].x)][Sky.skyHolder[block].y-1].z = 0;
				}
			}
		}
	}

	static skyBlockTouchedGround(){
		//If part of the the skyshape touches the ground, the rest of it is
		//moved down as well.
		if (Sky.splashCheck()) {
			//get rid of if here just do everything in splashCheck?
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
	static highScore = 0;
	static timerRunning = false;
	static timerInterval;

	static draw(){
		//Draw score and other numbers
		ctx.font = "25pt Garamond3Medium";
		ctx.fillStyle = "white";
		ctx.fillText("High Score:  " + HUD.highScore, -520, 280);
		ctx.fillText("Score: ", -520, 310);
		ctx.fillText("Submerged:  " + Ground.numSubmerged, -520, 360);
		ctx.fillText("out of max:   " + Ground.maxSubmerged, -520, 390);
		ctx.fillStyle = "gold";
		ctx.fillText(HUD.score, -345, 310);

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
		if(HUD.score > HUD.highScore) {
			HUD.highScore = HUD.score;
		}
		HUD.score = 0;
		HUD.timerRunning = false;
		clearInterval(HUD.timerInterval);
	};

};

//Background
class Background {
	static sunX = 155
	static reverseSun() {
		Background.sunX = -Background.sunX
	}
	static draw() {
		//background color
		ctx.beginPath();
		ctx.fillStyle = "rgba(2, 29, 35, 1)";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.stroke();
		//sky color
		ctx.beginPath();
		ctx.fillStyle = "rgba(130, 103, 40, 1)";
		ctx.fillRect(5,5,canvas.width-10,150);
		ctx.stroke();
		//Sun
		ctx.save();
		ctx.shadowColor = "rgba(255, 255, 255, 1)";
		ctx.shadowBlur = 140;
		ctx.beginPath();
		ctx.fillStyle = "rgba(57, 8, 2, 1)";
		ctx.arc(canvas.width/2 + Background.sunX,155,90, 0, Math.PI, true)
		ctx.fill();
		ctx.stroke();
		ctx.restore();
		//Sun outline
		ctx.save();
		ctx.lineWidth = 3;
		ctx.shadowColor = "black";
		ctx.shadowBlur = 1.2;
		ctx.beginPath();
		ctx.arc(canvas.width/2 + Background.sunX,155,90, 0, Math.PI, true)
		ctx.stroke();
		ctx.restore();
		//horizon line
		ctx.beginPath();
		ctx.fillStyle = "black";
		ctx.fillRect(5,152,canvas.width-10,3);
		ctx.stroke();	
		//border lines
		ctx.beginPath();
		ctx.fillStyle = 'black';
		ctx.fillRect(0,0,canvas.width,5);
		ctx.fillRect(0,canvas.height-5,canvas.width,5);
		ctx.fillRect(0,0,canvas.width,5);
		ctx.fillRect(0,0,5,canvas.height);
		ctx.fillRect(canvas.width-5,0,5,canvas.height);
		ctx.stroke();	
	}
}

//MUSIC AND SOUNDS =======================================================
//var introSong = new Audio('data/sound/igor.wav');
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
	//Draws background
	Background.draw();
	//sets origin closer to middle of screen, easier to draw isometric parts
	ctx.save();
	ctx.translate(canvas.width / 2, canvas.height / 2.1);
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
//introSong.pause()
//setTimeout(function () {      
//	introSong.play();
// }, 150);
Ground.initializeGroundHolder();
Sky.createSkyShape();
requestAnimationFrame(frame);

//EVENT LISTENERS =======================================================
//Handles key presses
window.addEventListener("keydown", Sky.skyHolderMove, false);
//Loops song
//introSong.addEventListener("ended", resetIntroSong, false);
//Stops intervals if window is minimized - not working yet
document.addEventListener("visibilitychange", function() {
	HUD.TimerRunning = false;
  }, false);
}
