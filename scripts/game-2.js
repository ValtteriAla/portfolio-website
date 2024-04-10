function get_random_int(min=0, max) {
  return Math.random() * (max - min) + min;
}


class Board {
  constructor(element) {
    this.id = "board";
    this.element = element;
    this.position = this.init_position();
  }

  init_position() {
    const rect = this.get_bounding_client_rect();
    console.log(rect);
    const top_left = { x: rect.x, y: rect.y };
    const top_right = { x: top_left.x + rect.width, y: rect.y };
    const bottom_left = { x: rect.x, y: rect.height + rect.y };
    const bottom_right = { x: rect.x + rect.width, y: rect.height + rect.y };
    return {
      top_left: top_left,
      top_right: top_right,
      bottom_left: bottom_left,
      bottom_right: bottom_right,
      max_w: rect.width,
      max_h: rect.height,
    };
  }

  insert_element(position="beforeend", element) {
    this.element.insertAdjacentElement(position, element)
  }

  get_bounding_client_rect() {
    return this.element.getBoundingClientRect()
  }
}

class Player {
  constructor(player, board, collision_manager, size=20) {
    this.id = "player";
    this.player = player;
    this.board = board;
    this.collision_manager = collision_manager;
    this.collision_manager.add_object(this);

    this.local_pos_x = 0;
    this.local_pos_y = 0;
    this.global_pos_x = 0;
    this.global_pos_y = 0;
    this.collision_size = size

    this.collision_area = this.update_collision_area(size);

    document.onmousemove = this.update_position.bind(this);
  }


  update_collision_area() {

    return {
      x1: this.local_pos_x,
      x2: this.local_pos_x + this.collision_size,
      y1: this.local_pos_y,
      y2: this.local_pos_y + this.collision_size,
    };
  }

  update_position(e) {
    const x = e.clientX;
    const y = e.clientY;

    const board_pos = this.board.position;

    // x-axis
    if (x < board_pos.top_left.x) {
      this.local_pos_x = 0;
      this.global_pos_x = board_pos.top_left.x;
    } else if (x > board_pos.top_right.x - 10) {
      this.local_pos_x = board_pos.top_right.x+5;
      this.global_pos_x = board_pos.top_right.x - 10;
    } else {
      this.local_pos_x = x - board_pos.top_left.x+5;
      this.global_pos_x = x;
    }

    // y-axis
    if (y < board_pos.top_left.y) {
      this.local_pos_y = 0;
      this.global_pos_y = board_pos.top_left.y;
    } else if (y > board_pos.bottom_left.y - 15) {
      this.local_pos_y = board_pos.max_h;
      this.global_pos_y = board_pos.bottom_left.y - 15;
    } else {
      this.local_pos_y = y - board_pos.top_left.y;
      this.global_pos_y = y;
    }

    this.collision_area = this.update_collision_area()
    this.update_player_position();
    
  }

  update_player_position() {
    this.player.style.left = `${this.global_pos_x}px`;
    this.player.style.top = `${this.global_pos_y}px`;
    this.collision_manager.check_collision("player");
  }

  get position() {
    return { x: this.local_pos_x, y: this.local_pos_y };
  }
}

class CollisionManager {
  constructor() {
    this.classes_list = [];

  }

  check_collision(id) {
    const target_obj = this.classes_list.find((obj) => obj.id === id);
    
    const target_collision_area = target_obj.obj.collision_area

    for (let class_obj of this.classes_list) {
      if (class_obj.id == id) continue;
      let class_obj_collision_area = class_obj.obj.collision_area

      if (this.rectangles_overlap(target_collision_area, class_obj_collision_area)) {
        console.log("COLLISION")
        class_obj.obj.start_transition(class_obj.obj.get_colliding_border_position())
      }

      else if (this.rectangles_overlap(class_obj_collision_area, target_collision_area)) {
        class_obj.obj.start_transition(class_obj.obj.get_colliding_border_position())
    }
  }
}


  rectangles_overlap(rect1, rect2) {

    console.log(rect1, rect2)

    if (rect1.x1 > rect2.x2 || rect1.x2 < rect2.x2) return false

    if (rect1.y1 > rect2.y2 || rect1.y2 < rect2.y2) return false

    return true

  }

  init_objects(objects) {
    for (class_obj of objects) {
      const id = class_obj.id;
      this.classes_list.push({ id: id, obj: class_obj });
    }
  }

  add_object(class_obj) {
    const id = class_obj.id;
    this.classes_list.push({ id: id, obj: class_obj });
  }

  remove_object(id) {
    // Array prototype filter
  }
}

class Enemy {
  constructor(board, collision_manager, size=20) {
    this.id = "Enemy"
    this.board = board
    this.size = size
    this.collision_manager = collision_manager;
    this.collision_manager.add_object(this);
    this.element = null
    this.init()
    this.collision_area = this.init_collision_area(200, 200);
 
    this.movement_vector = this.init_movement_vector()
  }

  get_colliding_border_position() {

    return {x:this.board.position.top_left.x+200, y:this.board.position.top_left.y}
  }

  init_movement_vector() {
    const x_vec = get_random_int(-10, 10)
    const y_vec = get_random_int(-10, 10)
    return {x:x_vec, y:y_vec}
  }

  init_collision_area(x, y) {
    return {
      x1: x,
      x2: x + this.size,
      y1: y,
      y2: y + this.size,
    };
  }

  init() {
    const rect = this.board.get_bounding_client_rect()
    console.log("hello", this.board.get_bounding_client_rect())

    const new_div = document.createElement("div");
    //new_div.setAttribute("id", "enemy");
    new_div.setAttribute("class", "enemy");
    new_div.style.left=`${rect.x+200}px`
    new_div.style.top=`${rect.y+200}px`
    new_div.innerHTML = "X"
    this.element = new_div
    this.board.insert_element("beforeend", new_div)
  }

  change_pos() {
    const rect = this.board.get_bounding_client_rect()

    const rand_x = get_random_int(rect.x, rect.right)
    const rand_y = get_random_int(rect.y, rect.bottom)

    this.element.style.left=`${rand_x}px`
    this.element.style.top=`${rand_y}px`

    this.collision_area = this.init_collision_area(rand_x-rect.x, rand_y-rect.y)
  }

  start_transition(vector2) {
    this.element.style.transitionDuration = 5
    this.element.style.left=`${vector2.x}px`
    this.element.style.top=`${vector2.y}px`
  }

  hide() {

  }

  

}


const collision_manager = new CollisionManager();
const game_board = new Board(document.getElementById("game-board"));
const player_el = document.getElementById("player");
const player = new Player(player_el, game_board, collision_manager);
const enemy = new Enemy(game_board, collision_manager)

console.log(player.collision_area);
