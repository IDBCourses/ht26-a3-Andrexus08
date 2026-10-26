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
const note = "C4"; // the note played when the pointer goes down
const columns = 4;
const rows = 3;

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const cellWidth = innerWidth / columns;
const cellHeight = innerHeight / rows;

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
];

// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.
let activeRow = -1;
let activeColumn = -1;
let shapes = [];

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // can play several notes at once

//plays the sounds in the cells (used in the pointerMove() function)
function playCellSound(index) {
  //index is equal to the indeces used in shapes[]
  const note = notes[index];

  synth.triggerAttackRelease(note, "8n");
}

// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
  setTimeout(update, 100); // call update() again in 100 milliseconds
}

// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.
function use() {
  setTimeout(use, 100); // call use() again in 100 milliseconds
}

// ---------- Controls (Event Handlers) ----------
// Runs every time the pointer goes down: a click, a tap or a pen touch.
function pointerDown(event) {
  Tone.start(); // browsers only allow sound after the player has pressed something

  console.log("Pointer down at", event.clientX, event.clientY);
  synth.triggerAttackRelease(note, "8n"); // play the note for an eighth note
}

function pointerMove(event) {
  //get position of the users pointer
  let pointerX = event.clientX;
  let pointerY = event.clientY;

  const cellWidth = window.innerWidth / columns;
  let column = Math.floor(pointerX / cellWidth); //break position down to which COLUMN it's positioned, rather than the exact pixel coordinate

  const cellHeight = window.innerHeight / rows;
  let row = Math.floor(pointerY / cellHeight); //break position down to which ROW it's, rather than the exact pixel coordinate

  //this if statement prevents that it repeats an input from the pointer if it stays in the same cell
  if (row !== activeRow || column !== activeColumn) {
    activeRow = row;
    activeColumn = column;

    let index = row * columns + column;
    playCellSound(index);

    console.log("Row: " + row + " Column: " + column);
  }
}

function buildGrid() {
  //creates a grid of cells, depending on the number of columns and rows defined in the Settings section
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      //x and y coordinates for the columns and rows section they are in
      let x = column / columns;
      let y = row / rows;

      const shape = createShape();
      shape.setPosition(x, y);
      shape.setSize(cellWidth, cellHeight);
      shape.setRoundedness(0);
      shape.setColour(200 + column * 20 + row * 20, 100, 50);

      //saves the current rectangle shape in an array, so we can easily edit certain shapes later on
      shapes.push(shape);
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

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  buildGrid();
  resizeGrid();
  update(); // start the update loop
  use(); // start the use loop

  // Example: a shape near the middle of the window. Replace it with your own.

  // Put your event listener code here
  window.addEventListener("pointerdown", pointerDown);
  window.addEventListener("resize", resizeGrid);
  window.addEventListener("pointermove", pointerMove);
}

setup(); // Always remember to call setup()!
