/**
 * Modified from https://gist.github.com/blixt/f17b47c62508be59987b
 **/
export default class  Random {
  constructor(seed) {
    this._seed = seed % 2147483647;
    if (this._seed <= 0) this._seed += 2147483646;
  }

  /**
   * Returns a pseudo-random value between 1 and 2^32 - 2.
   **/
  next() {
    return this._seed = this._seed * 16807 % 2147483647;
  };

  /**
   * Returns a pseudo-random value between 0 and max - 1.
   **/
  max(max) {
    return this.next() % max;
  }
};
