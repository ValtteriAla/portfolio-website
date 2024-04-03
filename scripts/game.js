const game_board = document.getElementById("game-board");
const patterns = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
];
const user_pattern = [];
let current_index = 0;

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
      col_div.setAttribute("id", `row-${row_index}-col-${i}`);
      child.insertAdjacentElement("beforeend", col_div);
      col_div.insertAdjacentElement("beforeend", col_btn);
    }
    row_index++;
  }
}

function on_click_col_btn(e) {
  const parent = e.target.parentElement;

  let parsed_id = parent.id.split("row-")[1];
  parsed_id = parsed_id.split("-col-");

  if (
    parsed_id[0] == patterns[current_index][0] &&
    parsed_id[1] == patterns[current_index][1]
  ) {
    current_index += 1;
    flash_cell(parsed_id[0], parsed_id[1]);
  } else {
    flash_cell(parsed_id[0], parsed_id[1], "red");
  }

  if (current_index == patterns.length) {
    current_index = 0;
  }
}

async function flash_cell(row, column, color = "lime") {
  const cell = document.getElementById(`row-${row}-col-${column}`);

  if (!cell) return console.error("cell not found");

  const cell_button = cell.firstElementChild;

  console.log(cell_button)

  if (!cell_button) return console.error("cell button not found")


  const default_bg =
    getComputedStyle(cell_button).getPropertyValue("background");

  cell_button.style.background = color;
  cell_button.setAttribute("disabled", "true");

  return sleep(1).then(() => {
    cell_button.style.background = default_bg;

    return sleep(1).then(() => {
      cell_button.removeAttribute("disabled");
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

async function flashCells(patterns) {
  for (let [row, col] of patterns) {
    await flash_cell(row, col);
  }
}

init_board(game_board);
flashCells(patterns);
