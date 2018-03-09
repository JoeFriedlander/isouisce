/*
isoUisce by Joe Friedlander
Inspired by Wetrix developed by Zed Two
*/

window.onload = function() {
	let canvas = document.getElementById("gameCanvas");
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

	//Stone Grid =============================================================
    let stoneGrid = new Array(gridColumnNum);
	function initializeStoneGrid(){
		for(let i = 0; i < gridColumnNum; i++){
			stoneGrid[i] = new Array(gridRowNum);
			for(let j = 0; j < gridRowNum; j++){
				stoneGrid[i][j] = new GroundBlock(
						i, //x
						j, //y
						startingHeight, //z
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
	function stoneGridUpdate() {
		let submergedNum = gridColumnNum*gridRowNum;
		let submergedCount = 0;
		for(let i = 0; i < stoneGrid.length; i++){
			for(let j = 0; j < stoneGrid[i].length; j++){
				stoneGrid[i][j].update();
				if(stoneGrid[i][j].z <= 0){
					submergedCount++;
				}
			}
			if(submergedCount == submergedNum){
				resetSkyHolder();
				resetStoneGrid();
			}
		}
	};
	function drawStoneGrid(){
		for(let i = 0; i < stoneGrid.length; i++){
			for(let j = 0; j < stoneGrid[i].length; j++){
				stoneGrid[i][j].draw();
			}
		}
	};
	function resetStoneGrid(){
		for(let i = 0; i < stoneGrid.length; i++){
			for(let j = 0; j < stoneGrid[i].length; j++){
				stoneGrid[i][j].z = startingHeight;
			}
		}
	}

	//Ground Block  ===========================================================
	function GroundBlock(x, y, z, topColor, leftColor, rightColor, lineColor,
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
	GroundBlock.prototype.update = function(){
		this.manageColor();
		this.sink();
	};
    GroundBlock.prototype.draw = function(){
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
	GroundBlock.prototype.manageColor = function(){
		//manages shadows
		let hasTopShadow = false;
		let hasLeftShadow = false;
		let hasRightShadow = false;

		for(block in skyHolder){
			if(skyHolder[block].x == this.x &&
		       skyHolder[block].y == this.y){
					hasTopShadow = true;
					if(this.y != gridColumnNum - 1){
						hasLeftShadow = true;
					}
					if(this.x != gridRowNum - 1){
						hasRightShadow = true;
					}
			}
		}
		//manages sinking color, if z is 0 or below then it is blue
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
		for(block in skyHolder){
			if(skyHolder[block].z <= this.z && skyHolder[block].z > 1){
				this.displayTop = this.displayTop.substring(0, 17) + ".3)";
				this.displayLeft = this.displayLeft.substring(0, 17) + ".3)";
				this.displayRight = this.displayRight.substring(0, 17) + ".3)";
			}
		}*/

	};
	GroundBlock.prototype.sink = function(){
		if(this.z>=0){
			this.z-=sinkAmount;
		}
	}

	//Sky Grid ===============================================================
	let skyHolder = [];

	function drawSkyHolder(){
		for(block in skyHolder){
			skyHolder[block].draw();
		}
	};
	function skyHolderUpdate(){
		for(block in skyHolder){
			skyHolder[block].update();
		}
	};
	function skyHolderMove(e){
		let canMove = true;
		switch(e.keyCode){
			//keypad up
			case 104:
				for(block in skyHolder){
					if(!(skyHolder[block].x > 0) ||
				   	   !(skyHolder[block].y > 0)){
						   canMove = false;
					}
			     }
			    if(canMove){
					for(block in skyHolder){
						skyHolder[block].x--;
						skyHolder[block].y--;
					}
			     }
			break;
			//down
			case 98:
				for(block in skyHolder){
					if(!(skyHolder[block].x < gridColumnNum - 1) ||
				   	   !(skyHolder[block].y < gridRowNum - 1)){
						   canMove = false;
					   }
				   }
				 if(canMove){
					 for(block in skyHolder){
						 skyHolder[block].x++;
						 skyHolder[block].y++;
					 }
				 }
			break;
			//right
			case 102:
				for(block in skyHolder){
					if(!(skyHolder[block].x < gridColumnNum - 1) ||
					   !(skyHolder[block].y > 0)){
						   canMove = false;
					   }
				   }
				 if(canMove){
					 for(block in skyHolder){
						 skyHolder[block].x++;
						 skyHolder[block].y--;
					 }
				 }
			break;
			//left
			case 100:
				for(block in skyHolder){
					if(!(skyHolder[block].x> 0) ||
					   !(skyHolder[block].y < gridRowNum - 1)){
						   canMove = false;
					   }
				   }
				 if(canMove){
					 for(block in skyHolder){
						 skyHolder[block].x--;
						 skyHolder[block].y++;
					 }
				 }
			break;
			//down right
			case 99:
				for(block in skyHolder){
					if(!(skyHolder[block].x < gridColumnNum - 1)){
						   canMove = false;
					   }
				   }
				 if(canMove){
					 for(block in skyHolder){
						 skyHolder[block].x++;
					 }
				 }
			break;
			//down left
			case 97:
				for(block in skyHolder){
					if(!(skyHolder[block].y < gridRowNum - 1)){
						   canMove = false;
					   }
				   }
				 if(canMove){
					 for(block in skyHolder){
						 skyHolder[block].y++;
					 }
				 }
			break;
			//up left
			case 103:
				for(block in skyHolder){
					if(!(skyHolder[block].x > 0)){
						   canMove = false;
					   }
				   }
				 if(canMove){
					 for(block in skyHolder){
						 skyHolder[block].x--;
					 }
				 }
			break;
			//up right
			case 105:
				for(block in skyHolder){
					if(!(skyHolder[block].y > 0)){
						   canMove = false;
					   }
				   }
				 if(canMove){
					 for(block in skyHolder){
						 skyHolder[block].y--;
					 }
				 }
			break;

		}
		switch(e.keyCode){
			case 101:
			case 32:
				for(block in skyHolder){
					skyHolder[block].z-=4;
				}
			break;
		}
	}
	function createSkyShape(){
		let choice = Math.random()*75;
		if(choice < 25){
			//square
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2) - 2,
			Math.floor(gridRowNum/2),skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2) - 1,
			Math.floor(gridRowNum/2),skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2),
			Math.floor(gridRowNum/2),skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2 + 1),
			Math.floor(gridRowNum/2),skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2 + 2),
			Math.floor(gridRowNum/2),skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2 + 2),
			Math.floor(gridRowNum/2) + 1,skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2 + 2),
			Math.floor(gridRowNum/2) + 2,skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2 + 2),
			Math.floor(gridRowNum/2) + 3,skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2) - 2,
			Math.floor(gridRowNum/2) + 1,skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2 - 2),
			Math.floor(gridRowNum/2) + 2,skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2 - 2),
			Math.floor(gridRowNum/2) + 3,skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2 - 2),
			Math.floor(gridRowNum/2) + 4,skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2 - 1),
			Math.floor(gridRowNum/2) + 4,skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2 - 0),
			Math.floor(gridRowNum/2) + 4,skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2 + 1),
			Math.floor(gridRowNum/2) + 4,skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2 + 2),
			Math.floor(gridRowNum/2) + 4,skyBlockDefaultZ));
		}
		else if(choice >=25 && choice < 50){
			//squiggle
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2) - 2,
			Math.floor(gridRowNum/2) + 1,skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2),
			Math.floor(gridRowNum/2),skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2) - 1,
			Math.floor(gridRowNum/2) + 1,skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2),
			Math.floor(gridRowNum/2) + 1,skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2) + 1,
			Math.floor(gridRowNum/2),skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2) + 2,
			Math.floor(gridRowNum/2),skyBlockDefaultZ));
		}
		else if(choice >=50 && choice <= 75){
			//line
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2) - 2,
			Math.floor(gridRowNum/2),skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2) - 1,
			Math.floor(gridRowNum/2),skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2),
			Math.floor(gridRowNum/2),skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2) + 1,
			Math.floor(gridRowNum/2),skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2) + 2,
			Math.floor(gridRowNum/2),skyBlockDefaultZ));

		}
	}
	function deleteSkyShape(){
		for(block in skyHolder){
			delete skyHolder[block];
		}
	}
	function addHeight(){
		for(b in skyHolder){
			//not underwater
			if(stoneGrid[(skyHolder[b].x)][skyHolder[b].y].z > 0){
				stoneGrid[(skyHolder[b].x)][skyHolder[b].y].z +=
					heightIncrease;
				//not above max height
				if(stoneGrid[(skyHolder[b].x)][skyHolder[b].y].z >= maxHeight){
					stoneGrid[(skyHolder[b].x)][skyHolder[b].y].z = maxHeight;
				}
			}
		}
	}
	/*function splash(){
		for(block in skyHolder){
			if(stoneGrid[(skyHolder[block].x)][skyHolder[block].y].z <= 0){
				stoneGrid[(skyHolder[block].x+1)][skyHolder[block].y].z = 0;
			}
		}
	}*/
	function skyBlockTouchedGround(){
		//If part of the the skyshape touches the ground, the rest of it is
		//moved down as well.
		addHeight();
		//splash();
		deleteSkyShape();
		createSkyShape();
	}
	function resetSkyHolder(){
		for(block in skyHolder){
			skyHolder[block].z = skyBlockDefaultZ;
		}
	}

	//Sky Block ===============================================================
	skyBlockDefaultZ = 8;
	function SkyBlock(x, y, z){
		this.x = x;
		this.y = y;
		this.z = z;
		//gives id so skyBlock can be deleted later
		this.id = Object.keys(skyHolder).length;
		this.topColor = "hsla(220, 61%, 60%, 1)";
		this.leftColor = "hsla(0, 0%, 80%, 1)";
		this.rightColor = "hsla(0, 0%, 60%, 1)";
	};
    SkyBlock.prototype.draw = function(){
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
	SkyBlock.prototype.update = function(){
		this.touchGround();
	};
	SkyBlock.prototype.touchGround = function(){
		if(this.z - 1 <= stoneGrid[this.x][this.y].z){
			skyBlockTouchedGround();
		}
	}

	//MUSIC AND SOUNDS =======================================================
	let introSong = new Audio('data/sound/introSong.wav');
	function resetIntroSong() {
		introSong.currentTime=0;
		introSong.play();
	}

	//UPDATE =================================================================
	function update(){
		//Updates all blocks in ground grid
		stoneGridUpdate();
		//Updates all blocks in sky grid
		skyHolderUpdate();
	};

	//RENDER ================================================================
	function render(){
		//refreshes screen
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		//sets origin closer to middle of screen
		ctx.save();
		ctx.translate(width / 2, height / 2.1);
		//draws ground blocks
		drawStoneGrid();
		//draws sky blocks
		drawSkyHolder();
		//restores canvas coordinates
		ctx.restore();
	};

	//MAIN LOOP ==============================================================
	function frame() {
		update();
		render();
		requestAnimationFrame(frame);
	}
	introSong.play();
	initializeStoneGrid();
	createSkyShape();
	requestAnimationFrame(frame);

	//EVENT LISTENERS =======================================================
	window.addEventListener("keydown", skyHolderMove, false);
	introSong.addEventListener("ended", resetIntroSong, false);
}
