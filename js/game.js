/*
isoUisce by Joe Friedlander
Inspired by Wetrix developed by Zed Two
*/

window.onload = function() {
	let canvas = document.getElementById("gameCanvas");
	let ctx = canvas.getContext("2d");
	let width = canvas.width;
	let height = canvas.height;
	let tileWidth = 60;
	let tileHeight = 30;
	let gridColumnNum = 10;
	let gridRowNum = 10;
	let heightIncrease = .6;

	//Ground Grid =============================================================
    let groundGrid = new Array(gridColumnNum);
	function initializeGroundGrid(){
		for(let i = 0; i < gridColumnNum; i++){
			groundGrid[i] = new Array(gridRowNum);
			for(let j = 0; j < gridRowNum; j++){
				groundGrid[i][j] = new GroundBlock(i,j,1);
			}
		}
	};
	function drawGroundGrid(){
		for(let i = 0; i < groundGrid.length; i++){
			for(let j = 0; j < groundGrid[i].length; j++){
				groundGrid[i][j].draw();
			}
		}
	};
	function groundGridUpdate() {
		for(let i = 0; i < groundGrid.length; i++){
			for(let j = 0; j < groundGrid[i].length; j++){
				groundGrid[i][j].update();
			}
		}
	};

	//Ground Block  ===========================================================
	function GroundBlock(x, y, z){
		this.x = x;
		this.y = y;
		this.z = z;
		this.topColor = "#bbbbbb";
		this.leftColor = "#cccccc";
		this.rightColor = "#999999";
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
        ctx.fillStyle = this.topColor;
		if(this.topColor == "4a4a4a"){
		}
        ctx.fill();
		ctx.stroke();

        // draw left
        ctx.beginPath();
        ctx.moveTo(-tileWidth / 2, tileHeight / 2 - this.z * tileHeight);
        ctx.lineTo(0, tileHeight - this.z * tileHeight);
        ctx.lineTo(0, tileHeight);
        ctx.lineTo(-tileWidth / 2, tileHeight / 2);
        ctx.closePath();
        ctx.fillStyle = this.leftColor;
        ctx.fill();
		ctx.stroke();

        // draw right
        ctx.beginPath();
        ctx.moveTo(tileWidth / 2, tileHeight / 2 - this.z * tileHeight);
        ctx.lineTo(0, tileHeight - this.z * tileHeight);
        ctx.lineTo(0, tileHeight);
        ctx.lineTo(tileWidth / 2, tileHeight / 2);
        ctx.closePath();
        ctx.fillStyle = this.rightColor;
        ctx.fill();
		ctx.stroke();

        ctx.restore();

    };

	GroundBlock.prototype.update = function(){
		this.beTouchedBySkyBlock();
		this.beAffectedByShadow();
	};

	GroundBlock.prototype.beAffectedByShadow = function(){
		let hasShadow = false;
		for(block in skyHolder){
			if(skyHolder[block].x == this.x &&
		       skyHolder[block].y == this.y){
					hasShadow = true;
			}
		}
		if(hasShadow){
			this.topColor = "#4a4a4a";
		}
		else{
			this.topColor = "#bbbbbb"
		}

	};

	GroundBlock.prototype.beTouchedBySkyBlock = function(){
		for(block in skyHolder){
			if(skyHolder[block].x == this.x &&
			   skyHolder[block].y == this.y &&
			   skyHolder[block].z - 1 <= this.z){
				   this.z+=heightIncrease;
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
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2) - 1,
			Math.floor(gridRowNum/2),skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2),
			Math.floor(gridRowNum/2),skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2) - 1,
			Math.floor(gridRowNum/2) + 1,skyBlockDefaultZ));
			skyHolder.push(new SkyBlock(Math.floor(gridColumnNum/2),
			Math.floor(gridRowNum/2) + 1,skyBlockDefaultZ));
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

	//Sky Block ===============================================================
	skyBlockDefaultZ = 8;
	function SkyBlock(x, y, z){
		this.x = x;
		this.y = y;
		this.z = z;
		//gives id so skyBlock can be deleted later
		this.id = Object.keys(skyHolder).length;
		this.topColor = "blue";
		this.leftColor = "#cccccc";
		this.rightColor = "#999999";
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
		if(this.z - 1 <= groundGrid[this.x][this.y].z){
			//Moves rest of skyblocks to ground. This is so if half the skyshape
			//touches a ground block then the whole thing is put to the ground.
			for(block in skyHolder){
				skyHolder[block].z  = groundGrid[this.x][this.y].z + 1;
			}
			//deletes other blocks
			deleteSkyShape();

			//creates new sky shape
			createSkyShape();
		}
	}

	//UPDATE =================================================================
	function update(){
		//Updates all blocks in ground grid
		groundGridUpdate();
		//Updates all blocks in sky grid
		skyHolderUpdate();
	};

	//RENDER ================================================================
	function render(){
		//refreshes screen
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		//sets origin closer to middle of screen
		ctx.save();
		ctx.translate(width / 2, height / 2.5);
		//draws ground blocks
		drawGroundGrid();
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
	initializeGroundGrid();
	createSkyShape();
	requestAnimationFrame(frame);

	//EVENT LISTENERS =======================================================
	window.addEventListener("keydown", skyHolderMove, false);
}
