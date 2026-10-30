/*
 * IDB Programming: A3 — a musical instrument
 *
 * All of the code for your instrument goes in this file. It's split into sections:
 *   settings — the "fixed" parts of your program
 *   state    — the parts of your program that change over time
 *   sound    — the Tone.js instruments and effects
 *   update   — updates the state every 100ms, if necessary
 *   use      — uses the state to make sound and shapes every 100ms, if necessary
 *   controls — what happens when the player uses the pointer
 *   setup    — starts everything
 *
 * The pointer events change the state. update() and use() each run every
 * 100ms, in a loop:
 *   1. update: change the state, e.g. based on time or on the pointer's movement
 *   2. use:    make sound and move shapes, based on the state
 *
 * Shapes come from shape.js: createShape() makes one, and its methods
 * (setPosition, setSize, setColour ...) change it.
 *
 * Tone.js documentation: https://tonejs.github.io/docs/15.1.22/
 */

import { createShape } from "./shape.js";

// ---------- Settings ----------
// Settings variables should contain all of the "fixed" parts of your programs
// For example: which notes you can play, how fast things move, the tempo.
const columns = 7;
const rows = 3;

const normalSaturation = 100;
const normalLightness = 50;

const hoverSaturation = 40;
const hoverLightness = 40;

// in case we want to use boring normal key notes again, but not needed
const notes = [
  "C4",
  "D4",
  "E4",
  "G4",
  "A4",
  "C4",
  "D4",
  "E5",
  "G5",
  "A4",
  "A5",
  "C5",
  "D4",
  "E4",
  "G4",
  "A4",
  "C4",
  "D4",
  "E5",
  "G5",
  "A4",
  "A5",
  "C5",
];

// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.

let activeRow = -1;
let activeColumn = -1;
let activeCell = -1;

let shapes = [];
let cellHue = [];
let cellSaturation = [];
let cellLightness = [];

let targetSaturation = [];
let targetLightness = [];

let pointerX = 0;
let pointerY = 0;
let previousPointerX = 0;
let previousPointerY = 0;

let previousPointerTime = 0;

let pointerSpeed = 0;

let pointerLight;

let isHolding = false;

let index = [];

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const reverb = new Tone.Reverb({
  decay: 9,
  wet: 0,
}).toDestination();
const synth = new Tone.PolySynth(Tone.Synth).connect(reverb); // if you want to use key notes instead of cool audio files go on
const players = new Tone.Players({
  sound1: "sounds/sound1.mp3",
  sound2: "sounds/sound2.wav",
  sound3: "sounds/sound3.wav",
  sound4: "sounds/sound4.mp3",
  sound5: "sounds/sound5.wav",
  sound6: "sounds/sound6.wav",
  sound7: "sounds/sound7.wav",
  sound8: "sounds/sound8.wav",
  sound9: "sounds/sound9.wav",
  sound10: "sounds/sound10.wav",
  sound11: "sounds/sound11.wav",
  sound12: "sounds/sound12.wav",
  sound13: "sounds/sound13.mp3",
  sound14: "sounds/sound14.mp3",
  sound15: "sounds/sound15.mp3",
  sound16: "sounds/sound16.mp3",
  sound17: "sounds/sound17.mp3",
  sound18: "sounds/sound18.mp3",
  sound19: "sounds/sound19.mp3",
  sound20: "sounds/sound20.mp3",
  sound21: "sounds/sound21.mp3",
}).connect(reverb);
//plays the sounds in the cells (used in the pointerMove() function)
function playCellSound(index) {
  //index is equal to the indeces used in shapes[]
  const soundName = `sound${index + 1}`;

  players.player(soundName).start();
}

// ---------- Visuals ----------
function cellVisuals(index) {
  if (activeCell !== -1) {
    //after going from one cell to another, reset the shapes colour
    targetSaturation[activeCell] = normalSaturation;
    targetLightness[activeCell] = normalLightness;
  }
  //update the current cell in which the pointer is located
  activeCell = index;
  //change this cells colour for visual feedback
  targetSaturation[activeCell] = hoverSaturation;
  targetLightness[activeCell] = hoverLightness;
}

// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
  // go through every cell
  for (let i = 0; i < shapes.length; i++) {
    let saturationDifference = targetSaturation[i] - cellSaturation[i];
    let lightnessDifference = targetLightness[i] - cellLightness[i];

    /*let's say targetSaturation is 30, cellSaturation is 100 --> difference = -70
    in this equation down here, it would now slowly decrease the cellSaturation by adding -70*0.2
    (same with lightness) */
    cellSaturation[i] = cellSaturation[i] + saturationDifference * 0.3;
    cellLightness[i] = cellLightness[i] + lightnessDifference * 0.3;
  }

  pointerSpeed = pointerSpeed * 0.7;
  //math.min because the wet value needs to be in between 0 and 1
  let wetAmount = Math.min(pointerSpeed / 3500, 1);
  reverb.wet.value = wetAmount;

  //changes the size of the pointerLight depending on the pointerSpeed
  let lightSize = 40 * wetAmount;
  pointerLight.setSize(lightSize, lightSize);

  setTimeout(update, 20); // call update() again in 200 milliseconds
}

// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.
function use() {
  //go through every cell
  for (let i = 0; i < shapes.length; i++) {
    let shape = shapes[i];
    let hue = cellHue[i];

    //implement the changes that get updated in update() and therefore creating a colour transition
    shape.setColour(hue, cellSaturation[i], cellLightness[i]);
  }

  setTimeout(use, 20); // call use() again in 20 milliseconds
}

// ---------- Controls (Event Handlers) ----------
// Runs every time the pointer goes down: a click, a tap or a pen touch.
function pointerDown(event) {
  Tone.start(); // browsers only allow sound after the player has pressed something
  isHolding = true;
  playCellSound(index);
  console.log("Pointer down at", event.clientX, event.clientY);
}

function pointerUp(event) {
  isHolding = false;
}

function pointerMove(event) {
  //get position of the users pointer
  pointerX = event.clientX;
  pointerY = event.clientY;

  //calculate elapsed time between last event trigger and now
  let currentTime = event.timeStamp;
  let elapsedTime = currentTime - previousPointerTime;

  //calculate distance (positive value with square and square root) between current position and the position from last event trigger
  let distanceX = pointerX - previousPointerX;
  let distanceY = pointerY - previousPointerY;
  let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

  //calculate pointerspeed
  if (elapsedTime > 0 && previousPointerTime !== 0) {
    pointerSpeed = (distance / elapsedTime) * 1000;
  }

  //set new values for the next event trigger
  previousPointerX = pointerX;
  previousPointerY = pointerY;
  previousPointerTime = currentTime;

  const cellWidth = window.innerWidth / columns;
  let column = Math.floor(pointerX / cellWidth); //break position down to which COLUMN it's positioned, rather than the exact pixel coordinate

  const cellHeight = window.innerHeight / rows;
  let row = Math.floor(pointerY / cellHeight); //break position down to which ROW it's, rather than the exact pixel coordinate

  if (isHolding) {
    return;
  }

  //this if statement prevents that it repeats an input from the pointer if it stays in the same cell
  if (row !== activeRow || column !== activeColumn) {
    activeRow = row;
    activeColumn = column;

    index = row * columns + column;
    //I use this index for the following functions, since it says in which cell I'm located
    playCellSound(index);
    cellVisuals(index);
    console.log("Row: " + row + " Column: " + column);
  }

  //since the pointerLight shape is not centered on the pointer, we need to get the center of the shape by moving it back HALF its size
  let lightSize = pointerLight.width; // can't use lightSize from the update() function
  pointerLight.setPosition(
    (event.clientX - lightSize / 2) / window.innerWidth,
    (event.clientY - lightSize / 2) / window.innerHeight,
  );
}

function buildGrid() {
  //creates a grid of cells, depending on the number of columns and rows defined in the Settings section
  let cellWidth = window.innerWidth / columns;
  let cellHeight = window.innerHeight / rows;
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      //x and y coordinates for the columns and rows section they are in
      let x = column / columns;
      let y = row / rows;

      //defining the rectangles
      const shape = createShape();
      shape.setPosition(x, y);
      shape.setSize(cellWidth, cellHeight);
      shape.setRoundedness(0);
      shape.setColour(
        200 + column * 10 + row * 40,
        normalSaturation,
        normalLightness,
      );
      //saves the current rectangle shape in an array, so we can easily edit certain shapes later on
      shapes.push(shape);
      //saves the colour (hues) of each created cell
      cellHue.push(200 + column * 10 + row * 65);
      //saves the original saturation and lightness of each created cell
      cellSaturation.push(normalSaturation);
      cellLightness.push(normalLightness);
      //this is important for the colour transition for the visual feedback
      targetSaturation.push(normalSaturation);
      targetLightness.push(normalLightness);
    }
  }
}

function resizeGrid() {
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      //the in buildGrid() saved shapes can now be accessed with this wonderful equation:
      let index = row * columns + column;
      let shape = shapes[index];
      /*
      ------Quick mathematical explanation------
      Starts with row = 0 (columns is always 4) and column is at 0 --> index is 0 --> 1st shape in the first row and first column
      => next step: row = 0, columns = 4 and column = 1 --> index is 1 --> 2nd shape in the first row and second column
      ...
      ...
      => next row: row = 1, columns = 4 and column = 0 --> index 5 --> 6th shape is in second row and first column
      ...
      ...
      => next row: row = 2, columns = 4 and column = 0 --> index 8 --> 9th shape is in third row and first column
      ... and so on
      */

      //updating positions of cells for the new screen size
      let x = column / columns;
      let y = row / rows;

      //update cell sizes depending on the current window size
      let cellWidth = window.innerWidth / columns;
      let cellHeight = window.innerHeight / rows;

      //implementing change
      shape.setPosition(x, y);
      shape.setSize(cellWidth, cellHeight);
    }
  }
}

function resetActiveCell() {
  //if no cell has been touched yet, do nothing
  if (activeCell === -1) {
    return;
  }
  //else reset the colour of the last touched shape
  targetSaturation[activeCell] = normalSaturation;
  targetLightness[activeCell] = normalLightness;

  //reset all values
  activeCell = -1;
  activeRow = -1;
  activeColumn = -1;
}

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  buildGrid();
  resizeGrid();

  //visuals for the pointerSpeed directly on the pointer
  pointerLight = createShape();
  pointerLight.element.style.pointerEvents = "none"; // so it doesn't trigger a cell by making the program think, it touched the pointerLight and then automatically triggering a cell again
  pointerLight.setSize(5, 5);
  pointerLight.setRoundedness(1);
  pointerLight.setColour(70, 100, 50);
  pointerLight.setPosition(0.5, 0.5);

  update(); // start the update loop
  use(); // start the use loop

  // Example: a shape near the middle of the window. Replace it with your own.

  // Put your event listener code here
  window.addEventListener("pointerdown", pointerDown);
  window.addEventListener("resize", resizeGrid);
  window.addEventListener("pointermove", pointerMove);
  window.addEventListener("pointerup", pointerUp);
  window.addEventListener("blur", pointerUp); //if I go outside the window and then release the click
  document.addEventListener("dragstart", (event) => {
    event.preventDefault(); //I had an issue with the pressing and holding cells after each other, the second cell I pressed, had this drag (cancel) symbol as my pointer from the browser, so this prevents this
  });
  document.addEventListener("pointerout", resetActiveCell); //didn't work with window.addEventListener, so I used document.addEventListener | maybe it was the Opera Gx browser that had problems with it.
}

setup(); // Always remember to call setup()!
