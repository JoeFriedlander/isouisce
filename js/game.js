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
	let heightIncrease = .6;

	//Stone Grid =============================================================
    let stoneGrid = new Array(gridColumnNum);
	function initializeStoneGrid(){
		for(let i = 0; i < gridColumnNum; i++){
			stoneGrid[i] = new Array(gridRowNum);
			for(let j = 0; j < gridRowNum; j++){
				stoneGrid[i][j] = new GroundBlock(i, j, 1,
						"hsla(0, 0%, 73%, 1)",
						"hsla(0, 0%, 80%, 1)",
						"hsla(0, 0%, 60%, 1)",
						"hsla(0, 0%, 29%, 1)");
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
	function stoneGridUpdate() {
		for(let i = 0; i < stoneGrid.length; i++){
			for(let j = 0; j < stoneGrid[i].length; j++){
				stoneGrid[i][j].update();
			}
		}
	};

	//Ground Block  ===========================================================
	function GroundBlock(x, y, z, topColor, leftColor, rightColor,
			shadowColor){
		this.x = x;
		this.y = y;
		this.z = z;
		this.topColor = topColor;
		this.leftColor = leftColor;
		this.rightColor = rightColor;
		this.shadowColor = shadowColor;
		this.displayTop = topColor;
		this.displayLeft = leftColor;
		this.displayRight = rightColor;
	};

	GroundBlock.prototype.update = function(){
		this.manageColor();
	};

    GroundBlock.prototype.draw = function(){
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
        ctx.fillStyle = this.displayTop;
        ctx.fill();
		ctx.stroke();

        // draw left
        ctx.beginPath();
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
		let hasShadow = false;
		for(block in skyHolder){
			if(skyHolder[block].x == this.x &&
		       skyHolder[block].y == this.y){
					hasShadow = true;
			}
		}
		if(hasShadow){
			this.displayTop = this.shadowColor;
			if(this.y != gridColumnNum - 1){
				this.displayLeft = this.shadowColor;
			}
			if(this.x != gridRowNum - 1){
				this.displayRight = this.shadowColor;
			}
		}
		else{
			this.displayTop = this.topColor;
			this.displayLeft = this.leftColor;
			this.displayRight = this.rightColor;
		}
		//manages transparency if skyblock is behind groundblock
		for(block in skyHolder){
			if(skyHolder[block].z <= this.z && skyHolder[block].z > 1){
				this.displayTop = this.displayTop.substring(0, 17) + ".3)";
				this.displayLeft = this.displayLeft.substring(0, 17) + ".3)";
				this.displayRight = this.displayRight.substring(0, 17) + ".3)";
			}
		}

	};

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
					skyHolder[block].z-=1.4;
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
		for(block in skyHolder){
			stoneGrid[(skyHolder[block].x)][skyHolder[block].y].z +=
				heightIncrease;
		}
	}

	function skyBlockTouchedGround(){
		//If part of the the skyshape touches the ground, the rest of it is
		//moved down as well.
		addHeight();
		deleteSkyShape();
		createSkyShape();
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
		ctx.lineTo(0, 2*tileHeight - this.z * tileHeight);
		ctx.lineTo(-tileWidth / 2,
				   tileHeight / 2 - (this.z * tileHeight) + tileHeight);
		ctx.closePath();
		ctx.fillStyle = this.leftColor;
		ctx.fill();
		ctx.stroke();

		// draw right
		ctx.beginPath();
		ctx.moveTo(tileWidth / 2, tileHeight / 2 - this.z * tileHeight);
		ctx.lineTo(0, tileHeight - this.z * tileHeight);
		ctx.lineTo(0, 2*tileHeight - this.z * tileHeight);
		ctx.lineTo(tileWidth / 2,
			       tileHeight / 2 - (this.z * tileHeight) + tileHeight);
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
		ctx.translate(width / 2, height / 2.3);
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
