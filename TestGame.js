"use strict";
function main(){
	//var name;
	//name = prompt("What is your name?");

	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	var x = canvas.width/2;
	var y = canvas.height/2;
	var dx = 2;
	var dy = -2;
	var rightPressed = false;
	var leftPressed = false;
	var upPressed = false;
	var downPressed = false;
	var enemyTimer = 0;
	var playerSpeed = 5;
	var lastPlayerMove = "";
	var seconds = 0;
	var powerUpTimer = 0;
	var gameOver = false;
	//define  enemy class
	class Entity {
		constructor(type, speed, color, height, width, x, y, orientation) {
			this.type = type;
			this.speed = speed;
			this.color = color;
			this.height = height;
			this.width = width;
			this.x = x;
			this.y = y;
			//in degrees
			this.orientation = orientation;
		}
	}
	class PowerUp{
		constructor(name, color, text, x, y){
			this.name = name;
			this.color = color;
			this.text = text;
			this.x = x;
			this.y = y;
		}
	}
	
	var listOfEntities = [new Entity("player", 4, "#0095DD", 20,20, 250,250,0)];
	var listOfPowerUps = [];
	var player = listOfEntities[0];
	//generate list of enemies

	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);

	function keyDownHandler(e) {
		if(e.keyCode === 68) {
			rightPressed = true;
		}
		else if(e.keyCode === 65) {
			leftPressed = true;
		}
		else if(e.keyCode === 83) {
			downPressed = true;
		}
		else if(e.keyCode === 87) {
			upPressed = true;
		}
	}
	function keyUpHandler(e) {
		if(e.keyCode === 68) {
			rightPressed = false;
		}
		else if(e.keyCode === 65) {
			leftPressed = false;
		}
		else if(e.keyCode === 83) {
			downPressed = false;
		}
		else if(e.keyCode === 87) {
			upPressed = false;
		}
	}

	function drawEntities() {
		for(var i = 0; i < listOfEntities.length; i++){
			ctx.beginPath();
			ctx.rect(listOfEntities[i].x, listOfEntities[i].y, listOfEntities[i].width, listOfEntities[i].height);
			ctx.fillStyle = listOfEntities[i].color;
			ctx.fill();
			ctx.closePath();
		}
		//draw health bar
		/*ctx.beginPath();
		ctx.rect(380, 300, 100, 20);
		ctx.fillStyle = "#FF0000";
		ctx.fill();
		ctx.closePath();*/
	}
	

	function spawnEnemies(){
		
		if (listOfEntities.length > 9)
			return;
		
		if (enemyTimer < 350) {
			enemyTimer++;
			return;
		}
		enemyTimer = 0;
		var speed2 =  Math.floor(Math.random() * (10 - 4) + 4);
		//generates a random color
		var color2 = '#'+Math.floor(Math.random()*16777215).toString(16);
		var length2 =  Math.random() * (30 -20) + 20;
		var width2 =  Math.random() * (30 - 20) + 20;
		var coordx, coordy;
		//create the x coordinate
		if(player.x < canvas.width/2 )
			coordx = Math.random() * ((canvas.width-width2) - canvas.width/2) + canvas.width/2;
		
		else
			coordx = Math.random() * ((canvas.width/2) - width2) + width2;
		

		//create the y coordinate
		if(player.y < canvas.height/2 ){
			//console.log("upperhalf");
			//if the player is on the upper half of the board
			coordy = Math.random() * ((canvas.height) - length2) + length2;
		}
		else{
			//console.log("lowerhalf");
			//if the player on the lower half of the board
			coordy = Math.random() * ( ((canvas.height/2-length2) - length2) + length2);
		}
		var e = new Entity("Enemy", speed2, color2, length2, width2, coordx, coordy,0);
		listOfEntities.push(e);
		//console.log(coordx + "," + coordy);
	}

	function collisionDetection(e1, e2){
		//checks collision of two objects
		var e1x2 = e1.x + e1.width;
		var e1y2 = e1.y + e1.height;
		var e2x2 = e2.x + e2.width;
		var e2y2 = e2.y + e2.height;
		//upper left
		if ( ( (e1.x  > e2.x ) && (e1.y  > e2.y) ) &&
			 ( (e1.x < e2x2 ) && (e1.y > e2.y) ) &&
			 ( (e1.x > e2.x) && (e1.y  < e2y2) ) &&
			 ( (e1.x  < e2x2 ) && (e1.y < e2y2) ) ){
				console.log("collision detected");
				reverseLastMove(e1);
		}
		//upper right
		else if ( ( (e1x2  > e2.x ) && (e1.y  > e2.y) ) &&
			 ( (e1x2 < e2x2 ) && (e1.y > e2.y) ) &&
			 ( (e1x2 > e2.x) && (e1.y  < e2y2) ) &&
			 ( (e1x2 < e2x2 ) && (e1.y < e2y2) ) ){
				console.log("collision detected");
				reverseLastMove(e1);
		}
		//lower right <
		else if ( ( (e1x2  > e2.x ) && (e1y2  > e2.y) ) &&
			 ( (e1x2 < e2x2 ) && (e1y2 > e2.y) ) &&
			 ( (e1x2 > e2.x) && (e1y2  < e2y2) ) &&
			 ( (e1x2 < e2x2 ) && (e1y2 < e2y2) ) ){
				console.log("collision detected");
				reverseLastMove(e1);
		}
		//lower left <
		else if ( ( (e1.x  > e2.x ) && (e1y2  > e2.y) ) &&
			 ( (e1.x < e2x2 ) && (e1y2 > e2.y) ) &&
			 ( (e1.x > e2.x) && (e1y2  < e2y2) ) &&
			 ( (e1.x  < e2x2 ) && (e1y2 < e2y2) ) ){
				console.log("collision detected");
				reverseLastMove(e1);
		}
		else {
			//no collision detected
		}
	}
	
	function reverseLastMove(e){
		//reverses the last move of an entitiy
		if (lastPlayerMove === "Left"){
			e.x-=e.speed;
		}
		else if (lastPlayerMove === "Down"){
			e.y-=e.speed;
		}
		else if (lastPlayerMove === "Up"){
			e.y+=e.speed;
		}
		else if (lastPlayerMove === "Right"){
			e.x+=e.speed;
		}
	}
	
	function moveTowardsPlayer(e){
		//This function taken in an entity e and moves that entity based on it's current x y position
		//and it's current orientation in degrees, which points towards a direction on the unit circle.
		var dx; 	
		var dy;
		player = listOfEntities[0];
		if(player.y < e.y){
			dy = -e.speed*.25;
		}
		if(player.y > e.y){
			dy = e.speed*.25;
		}
		if(player.x > e.x ){
			dx = e.speed*.25;
		}
		if(player.x < e.x){
			dx = -e.speed*.25;
		}
		e.x+=dx;
		e.y+=dy;
	}
	
	function checkGameOver(){
		if(player.y > canvas.height || 
		   player.y < 0 			||
		   player.x > canvas.width	||
		   player.x < 0){
			gameOver = true;
			ctx.font="50px Droid Sans Mono";
			ctx.fillText("Game Over!",(canvas.width/2)-140,canvas.height/2);
			ctx.font="40px Droid Sans Mono";
			ctx.fillText("You lasted: " + seconds,(canvas.width/2)-220,canvas.height/2+50);
		}
	}
	
	function spawnPowerUp(){
		//var pNum = Math.random() * (1 - 1) + 1;
		if(powerUpTimer === 1000){
			//spawn a power up every 10 seconds!
			/*
			switch(){
				case 1:
				break;
				default:
			}
			*/
			listOfPowerUps.push(new PowerUp("Shrink", "#FFFFFF", "s", x, y));
		}
	}
	function drawPowerUps(){
		for(var i = 0; i < listOfPowerUps.length; i++){
			
		}	
	}
	
	//main game loop
	//logic goes here
	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawEntities();
		spawnEnemies();
		spawnPowerUp();
		drawPowerUps();
		//checks for a gameOver
		checkGameOver();
		//check for collision between player and enemies
		for(var i = 1; i < listOfEntities.length;i++){
			collisionDetection(listOfEntities[0],listOfEntities[i]);
		}
		//move entities
		for(var i = 1; i < listOfEntities.length;i++){
			moveTowardsPlayer(listOfEntities[i]);
		}
		//movement
		if(rightPressed && player.x < canvas.width-player.width) {
			player.x += player.speed;
			lastPlayerMove = "Left";
		}
		else if(leftPressed && player.x > 5) {
			player.x -= player.speed;
			lastPlayerMove = "Right";
		}
		else if(upPressed && player.y > 5) {
			player.y -= player.speed;
			lastPlayerMove = "Up";
		}
		else if(downPressed && player.y < canvas.height-player.height) {
			player.y += player.speed;
			lastPlayerMove = "Down";
		}
		else{
			//no other options
		}
		powerUpTimer++;
		if(!gameOver)
			seconds += .01;
	}
	setInterval(draw, 10);

}
