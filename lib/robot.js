class Robot {
  construction() {
    this.bearing = "east";
    this.previousBearing = "east";
    this.coordinates = [0, 0];
    this.previousCoordinates = [0, 0];
    this.prevTile = false;
    this.output = {};
    this.lost = false;

    this.renderBot();
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

  advance() {
    this.previousCoordinates = [...this.coordinates];
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

  evaluate() {
    const instructions = document.getElementById("instructions").value;
    let instructionsList = instructions.split("");

    this.previousBearing = this.bearing;
    instructionsList.forEach(
      function (instruction) {
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
      x: this.coordinates[0],
      y: this.coordinates[1]
    };
    scentsArray.push(scent);
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
        parseInt(scent.x) == parseInt(this.coordinates[0]) &&
        parseInt(scent.y) == parseInt(this.coordinates[1])
      ) {
        scented = true;
        newTile = this.prevTile;
        this.coordinates = [...this.previousCoordinates];
      }
    });

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

function createGrid() {
  const rows = [
    document.querySelector("#row1"),
    document.querySelector("#row2"),
    document.querySelector("#row3"),
    document.querySelector("#row4")
  ];

  rows.forEach((row, index) => {
    for (let j = 0; j < 6; j++) {
      row1.insertAdjacentHTML(
        "beforeend",
        `
        <div class="tile" data-x=${j} data-y=${3 - index}></div>
      `
      );
    }
  });
}

function executeInstructions() {
  if (activeRobot) {
    activeRobot.evaluate();
  } else {
    return alert("There are no active Robots on the board!");
  }
}

function newRobot() {
  activeRobot = new Robot();
  activeRobot.construction();
}

function recicleRobot() {
  newRobot();
  const newRobotBtn = document.getElementById("input-panel").lastElementChild;
  console.log(newRobotBtn);
  newRobotBtn.remove();
}

function init() {
  createGrid();
  newRobot();
}

let activeRobot,
  scentsArray = [];

init();
