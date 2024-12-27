class Ship {
  #hits = 0;

  constructor(length) {
    this.shipLength = length;
  }

  hit() {
    this.#hits += 1;
  }

  isSunk() {
    if (this.shipLength - this.#hits <= 0) return true;
    return false;
  }
}

export default Ship;
