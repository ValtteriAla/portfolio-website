/*
 TODO:
 - scoreboard
 - player can choose board dimensions, difficulty (speed), and the game ending length
 
*/

const game_board = document.getElementById("game-board");
const start_game_btn = document.getElementById("start-game-btn");
const hint_btn = document.getElementById("hint-btn");
const max_width_height = 10; // make dynamic, init when initing the board and get the dimensions
let buttons_disabled = true

const patterns = [
  [get_random_int(max_width_height), get_random_int(max_width_height)],
];
const user_pattern = [];
let current_index = 0;

start_game_btn.addEventListener("click", on_click_start_game_btn);
hint_btn.addEventListener("click", on_click_hint_btn);

function get_random_int(max) {
  return Math.floor(Math.random() * max);
}

function on_click_start_game_btn(e) {
  e.target.setAttribute("disabled", "true");
  console.log("Starting the game.", e);

  flashCells(patterns).then(() => {
    enable_buttons();
  });
}

function on_click_hint_btn(e) {
  //e.target.setAttribute("disabled", "true");

  flash_cell(patterns[current_index][0], patterns[current_index][1], "yellow")
}

function disable_buttons() {
  console.log("disabled buttons")
  buttons_disabled = true
}

function enable_buttons() {
  console.log("Enabled buttons")
  buttons_disabled = false
 /* Some cases did not work properly (still allows click to happen)
  const buttons = document.getElementsByClassName("col-btn");

  for (let button of buttons) {
    button.removeAttribute("disabled");
  }
  */
}

function init_board(board) {
  // Create rows
  console.log("init_board");

  for (let i = 0; i < 10; i++) {
    const row_div = document.createElement("div");
    row_div.setAttribute("class", `row row-${i}`);
    row_div.setAttribute("id", `row-${i}`);
    board.insertAdjacentElement("beforeend", row_div);
  }

  // Create columns

  let row_index = 0;
  for (const child of board.children) {
    for (let i = 0; i < 10; i++) {
      const col_div = document.createElement("div");
      const col_btn = document.createElement("button");
      col_btn.addEventListener("click", on_click_col_btn);
      col_div.setAttribute("class", `col`);
      col_btn.setAttribute("class", `col-btn`);
      col_div.setAttribute("id", `row-${row_index}-col-${i}`);
      child.insertAdjacentElement("beforeend", col_div);
      col_div.insertAdjacentElement("beforeend", col_btn);
    }
    row_index++;
  }
}

function on_click_col_btn(e) {

  if (buttons_disabled) return

  const parent = e.target.parentElement;

  let parsed_id = parent.id.split("row-")[1];
  parsed_id = parsed_id.split("-col-");

  if (
    parsed_id[0] == patterns[current_index][0] &&
    parsed_id[1] == patterns[current_index][1]
  ) {
    current_index += 1;
    if (current_index == patterns.length) {
      disable_buttons()
    }

    flash_cell(parsed_id[0], parsed_id[1]).then(() => {
      if (current_index == patterns.length) {
        sleep(1).then(() => {
          start_next_round();
        });
      }
    });
  } else {
    console.log("WRONG TILE")
    flash_cell(parsed_id[0], parsed_id[1], "red");
  }
}

function start_next_round() {
  console.log("STARTING NEXT ROUND");
  current_index = 0;
  random_spot = [
    get_random_int(max_width_height),
    get_random_int(max_width_height),
  ];
  patterns.push(random_spot);
  disable_buttons();
  flashCells().then(() => {

    enable_buttons();
  });
}

function get_cell_color(row, column) {
  if (row % 2 == 0 && column % 2 == 0 || row % 2 == 1 && column % 2 == 1) {
    return "#d3d3d3"
  }

  return "#fff"
  

}

async function flash_cell(row, column, color = "lime") {
  const cell = document.getElementById(`row-${row}-col-${column}`);

  if (!cell) return console.error("cell not found");

  const cell_button = cell.firstElementChild;

  if (!cell_button) return console.error("cell button not found");

  const default_bg = get_cell_color(row, column);
  cell_button.style.background = color;

  return sleep(1).then(() => {
    cell_button.style.background = default_bg;

    return sleep(1).then(() => {
    });
  });
}

function sleep(seconds) {
  sleep_time = seconds * 1000;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, sleep_time);
  });
}

async function flashCells() {
  for (let [row, col] of patterns) {
    await flash_cell(row, col);
  }
}

init_board(game_board);
