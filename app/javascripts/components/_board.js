import m from 'mithril';
import { range } from 'lodash/util';
import { filter, sample, some } from 'lodash/collection';
import { min, max } from 'lodash/math';

import Gem from '../lib/gem';
import Cluster from '../lib/cluster';

export default class Board {
  constructor() {
    this.id = 1;
    this.width = 6;
    this.height = 12;
    this.activePiece = [];
    this.data = [];
    this.clusters = [];
    this.theme = document.querySelector('#gems');
  }

  context() {
    return document.querySelector(`#board-${this.id}`).getContext('2d');
  }

  update() {
    this.growClusters();
    this.createClusters();
    this.smashGems();
  }

  blank() {
    this.context().clearRect(0, 0, 32 * this.width, 32 * this.height);
  }

  render() {
    const _this = this;
    this.blank();
    this.activePiece.forEach((gem, _) => {
      gem.render(_this.context());
    });
    this.forEachSquare((x, y) => {
      const square = _this.getSquare(x, y);
      if (square) { square.render(_this.context()); }
    });
  }

  /* This will get passed an array of objects that respond to .x and .y */
  isClear(positions) {
    const minX = min(positions.map(piece => piece.x));
    const maxX = max(positions.map(piece => piece.x));
    const minY = min(positions.map(piece => piece.y));
    const maxY = max(positions.map(piece => piece.y));

    if (minX < 0) { return false; }
    if (minY < 0) { return false; }
    if (maxX >= this.width) { return false; }
    if (maxY >= this.height) { return false; }

    return !some(positions, (position, a, b) => {
      if (this.getSquare(position.x, position.y)) { return true; }
    });
  }

  forEachSquare(func) {
    return range(0, this.height).map(y => {
      return range(this.width).map(x => {
        return func(x, y);
      });
    }).flat();
  }

  getSquare(x, y) {
    return this.data[
      x + (y * this.width)
    ];
  }

  setSquare(gem, x, y) {
    if (typeof gem !== 'undefined') {
      x = gem.x;
      y = gem.y;
    }

    this.data[x + (y * this.width)] = gem;
  }

  setGems(gemOne, gemTwo) {
    this.setSquare(gemOne);
    this.setSquare(gemTwo);
  }

  growClusters() {
    this.clusters.forEach(cluster => {
      cluster.attemptGrowth();
    });
  }

  createClusters() {
    this.forEachSquare((x, y) => {
      const gem = this.getSquare(x, y);

      if (gem === undefined || gem.cluster !== undefined) { return undefined; }

      if (
        gem.rightGem()      && !gem.rightGem().cluster      && gem.rightGem().colour      === gem.colour &&
        gem.belowGem()      && !gem.belowGem().cluster      && gem.belowGem().colour      === gem.colour &&
        gem.belowRightGem() && !gem.belowRightGem().cluster && gem.belowRightGem().colour === gem.colour
      ) {
        const cluster = new Cluster([
          gem,
          gem.rightGem(),
          gem.belowGem(),
          gem.belowRightGem(),
        ]);

        this.clusters.push(cluster);

        gem.cluster = cluster;
        gem.rightGem().cluster = cluster;
        gem.belowGem().cluster = cluster;
        gem.belowRightGem().cluster = cluster;

        cluster.attemptGrowth();
      }
    });
  }

  smashGems() {
    const smashers = filter(this.data, gem => (gem && gem.smasher));
    smashers.forEach(gem => gem.attemptSmash());
    this.data.forEach(gem => {
      if (gem && gem.toSmash) {
        this.setSquare(undefined, gem.x, gem.y);
      }
    });

    this.data.forEach(gem => { gem && gem.gravity() });
  }

  view() {
    const _this = this;
    return [
      m('canvas.board', {
        id: `board-${this.id}`,
        width: (32 * this.width),
        height: (32 * this.height)
      })
    ];
  }
};
