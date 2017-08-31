'use strict';

class Robot {
	construction() {
		this.bearing = 'north'
		this.coordinates = [0,0]
	}

	orient(direction) {
		let directions = ['north', 'south', 'east', 'west']
		if (directions.includes(direction)) {
		this.bearing = direction
		} else {
			throw new Error("Invalid Robot Bearing")
		}
	}

	turnRight () {
		switch (this.bearing) {
			case 'north':
				this.bearing = 'east';
				break;
			case 'east':
				this.bearing = 'south';
				break;
			case 'south':
				this.bearing = 'west';
				break;
			case 'west':
				this.bearing = 'north';
				break;
		}
	}

	turnLeft () {
		switch (this.bearing) {
			case 'north':
				this.bearing = 'west';
				break;
			case 'east':
				this.bearing = 'north';
				break;
			case 'south':
				this.bearing = 'east';
				break;
			case 'west':
				this.bearing = 'south';
				break;
		}
	}

	at (x,y) {
		this.coordinates = [x,y]
	}

	advance() {
		switch (this.bearing) {
			case 'north':
				this.coordinates[1]++;
				break;
			case 'east':
				this.coordinates[0]++
				break;
			case 'south':
				this.coordinates[1]--
				break;
			case 'west':
				this.coordinates[0]--
				break;
		}
	}

	instructions(instructions) {
		let instructionsList = instructions.split('');
		let finalList = [];
		instructionsList.forEach(function (instruction) {
			switch (instruction) {
				case "L":
					finalList.push("turnLeft")
					break;
				case "R":
					finalList.push("turnRight")
					break;
				case "A":
					finalList.push("advance")
					break;
			}
		})
		return finalList;
	}

	place(object) {
		this.coordinates = [object.x, object.y]
		this.bearing = object.direction
	}

	evaluate(instructions) {
		let instructionsList = instructions.split('');
		instructionsList.forEach(function (instruction) {
			switch (instruction) {
				case "L":
					this.turnLeft();
					break;
				case "R":
					this.turnRight();
					break;
				case "A":
					this.advance();
					break;
			}
		}.bind(this))
	}

//end of class
}
