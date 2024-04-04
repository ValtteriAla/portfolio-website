
class Board {
  constructor(element) {
    this.element = element
    this.position = this.init_position()
  }
  

  init_position() {
    const rect = this.element.getBoundingClientRect()
    console.log(rect)
    const top_left = {x: rect.x, y: rect.y}
    const top_right = {x: top_left.x+rect.width, y: rect.y}
    const bottom_left = {x: rect.x, y: rect.height+rect.y}
    const bottom_right = {x: rect.x+rect.width, y: rect.height+rect.y}
    return { top_left: top_left, top_right: top_right, bottom_left: bottom_left, bottom_right: bottom_right, max_w: rect.width, max_h: rect.height }
  }
}

class Player {
  constructor(player, board) {
    this.player = player
    this.board = board

    this.local_pos_x = 0
    this.local_pos_y = 0
    this.global_pos_x = 0
    this.global_pos_y = 0

    this.collision_area = this.update_collision_area(5)

    document.onmousemove = this.update_position.bind(this)
  }

  update_collision_area(size) {
    return {x1: this.local_pos_x, x2: this.local_pos_x+size,
            y1: this.local_pos_y, y2: this.local_pos_y+size}}


  update_position(e) {
    const x = e.clientX
    const y = e.clientY

    const board_pos = this.board.position

    // x-axis
    if (x < board_pos.top_left.x) {
      this.local_pos_x = 0
      this.global_pos_x = board_pos.top_left.x
    } else if (x > board_pos.top_right.x - 10) {
      this.local_pos_x = board_pos.top_right.x
      this.global_pos_x = board_pos.top_right.x - 10
    } else {
      this.local_pos_x = x - board_pos.top_left.x
      this.global_pos_x = x
    }

    // y-axis
    if (y < board_pos.top_left.y) {
      this.local_pos_y = 0
      this.global_pos_y = board_pos.top_left.y
    } else if (y > board_pos.bottom_left.y - 15) {
      this.local_pos_y = board_pos.max_h
      this.global_pos_y = board_pos.bottom_left.y - 15
    } else {
      this.local_pos_y = y - board_pos.top_left.y
      this.global_pos_y = y
    }

    this.update_player_position()
  }

  update_player_position() {
    this.player.style.left = `${this.global_pos_x}px`
    this.player.style.top = `${this.global_pos_y}px`
  }

  get position() {
    return {x: this.local_pos_x, y: this.local_pos_y}
  }

}

class CollisionManager {
  constructor() {

  }

  
}

const game_board = new Board(document.getElementById("game-board"))
const player_el = document.getElementById("player")
const player = new Player(player_el, game_board)

console.log(player.collision_area)