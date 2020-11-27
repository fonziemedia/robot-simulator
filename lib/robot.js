class Robot {
  construction() {
    this.bearing = "north";
    this.coordinates = [0, 0];
    this.previousCoordinates = [0, 0];
    this.prevTile = false;
    this.output = {};
    this.lost = false;
  }

  orient(direction) {
    let directions = ["north", "south", "east", "west"];
    if (directions.includes(direction)) {
      this.bearing = direction;
    } else {
      throw new Error("Invalid Robot Bearing");
    }
  }

  turnRight() {
    switch (this.bearing) {
      case "north":
        this.bearing = "east";
        break;
      case "east":
        this.bearing = "south";
        break;
      case "south":
        this.bearing = "west";
        break;
      case "west":
        this.bearing = "north";
        break;
    }
  }

  turnLeft() {
    switch (this.bearing) {
      case "north":
        this.bearing = "west";
        break;
      case "east":
        this.bearing = "north";
        break;
      case "south":
        this.bearing = "east";
        break;
      case "west":
        this.bearing = "south";
        break;
    }
  }

  at(x, y) {
    this.coordinates = [x, y];
    this.previousCoordinates = [x, y];
    this.renderBot(this.coordinates);
  }

  advance() {
    this.previousCoordinates = this.coordinates;
    switch (this.bearing) {
      case "north":
        this.coordinates[1]++;
        break;
      case "east":
        this.coordinates[0]++;
        break;
      case "south":
        this.coordinates[1]--;
        break;
      case "west":
        this.coordinates[0]--;
        break;
    }
  }

  instructions(instructions) {
    let instructionsList = instructions.split("");
    let finalList = [];
    instructionsList.forEach(function (instruction) {
      switch (instruction) {
        case "L":
          finalList.push("turnLeft");
          break;
        case "R":
          finalList.push("turnRight");
          break;
        case "A":
          finalList.push("advance");
          break;
      }
    });
    return finalList;
  }

  place(object) {
    this.coordinates = [object.x, object.y];
    this.bearing = object.direction;
  }

  evaluate() {
    const instructions = document.getElementById("instructions").value;
    let instructionsList = instructions.split("");
    instructionsList.forEach(
      function (instruction) {
        console.log(this.lost);
        if (!this.lost) {
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

          this.renderBot(this.coordinates);
        }
      }.bind(this)
    );
    this.generateOutput();
  }

  generateOutput() {
    this.output = {
      x: this.coordinates[0],
      y: this.coordinates[1],
      o: this.bearing,
      status: this.lost ? "LOST " : ""
    };

    const moves = document.getElementById("moves");
    moves.insertAdjacentHTML(
      "beforeend",
      `     
        <li> ${this.output.x} ${this.output.y} ${this.output.o} ${this.output.status}</li>
      `
    );
  }

  leaveScent() {
    const scent = {
      x: this.previousCoordinates[0],
      y: this.previousCoordinates[1]
    };
    scentsArray.push(scent);
    console.log(scentsArray);
  }

  renderBot() {
    const tiles = document.querySelectorAll(".tile");
    const cp = document.getElementById("input-panel");

    let newTile;
    let scented = false;

    tiles.forEach(tile => {
      if (
        parseInt(tile.dataset.x) == parseInt(this.coordinates[0]) &&
        parseInt(tile.dataset.y) == parseInt(this.coordinates[1])
      ) {
        newTile = tile;
      }
    });

    scentsArray.forEach(scent => {
      if (
        parseInt(scent.x) == parseInt(this.previousCoordinates[0]) &&
        parseInt(scent.y) == parseInt(this.previousCoordinates[1])
      ) {
        scented = true;
        newTile = this.prevTile;
      }
    });

    if (scented) {
      console.log(this.coordinates);
      console.log(this.previousCoordinates);
      this.coordinates = this.previousCoordinates;
    }

    if (!newTile && !scented) {
      alert("Robot Lost..");
      this.lost = true;
      this.leaveScent();
      activeRobot = false;
      this.prevTile.id = "";

      cp.insertAdjacentHTML(
        "beforeend",
        `      <button
        onclick="recicleRobot()"
        id="move-button"
      >
        New Robot!
      </button>
      `
      );

      return false;
    } else {
      if (this.prevTile) {
        this.prevTile.id = "";
      }

      newTile.id = "robot";
      this.prevTile = newTile;

      return true;
    }
  }

  //end of class
}

let scentsArray = [];

function createGrid() {
  const row1 = document.querySelector("#row1");
  const row2 = document.querySelector("#row2");
  const row3 = document.querySelector("#row3");

  for (let j = 0; j < 6; j++) {
    row1.insertAdjacentHTML(
      "beforeend",
      `
        <div class="tile" data-x=${j} data-y=3></div>
      `
    );
  }

  for (let j = 0; j < 6; j++) {
    row2.insertAdjacentHTML(
      "beforeend",
      `
        <div class="tile" data-x=${j} data-y=2></div>
      `
    );
  }

  for (let j = 0; j < 6; j++) {
    row3.insertAdjacentHTML(
      "beforeend",
      `
        <div class="tile" data-x=${j} data-y=1></div>
      `
    );
  }

  for (let j = 0; j < 6; j++) {
    row4.insertAdjacentHTML(
      "beforeend",
      `
        <div class="tile" data-x=${j} data-y=0></div>
      `
    );
  }
}

let activeRobot;
createGrid();

function newRobot() {
  activeRobot = new Robot();
  activeRobot.at(0, 0);
  activeRobot.orient("east");
  activeRobot.lost = false;
}

function recicleRobot() {
  newRobot();
  const newRobotBtn = document.getElementById("input-panel").lastElementChild;
  console.log(newRobotBtn);
  newRobotBtn.remove();
}

newRobot();
