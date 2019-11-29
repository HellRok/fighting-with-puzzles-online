import m from 'mithril';
import { range } from 'lodash/util';
import { sample } from 'lodash/collection';
import Gem from '../lib/gem';
import Cluster from '../lib/cluster';

export default class Board {
  constructor() {
    this.width = 6;
    this.height = 12;
    this.data = [];
    this.clusters = [];
    const _this = this;
    this.forEachSquare((x, y) => {
      _this.setSquare(new Gem(
        this, x, y,
        sample(['red', 'green', 'blue', 'yellow'])
      ));
    });


    //debugging
    this.growClusters();
    this.createClusters();
    console.log(this.clusters);
    this.smashGems();
  }

  forEachSquare(func) {
    return range(this.height, 0, -1).map(y => {
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
        gem.rightGem() && gem.rightGem().cluster === undefined && gem.rightGem().colour === gem.colour &&
        gem.aboveGem() && gem.aboveGem().cluster === undefined && gem.aboveGem().colour === gem.colour &&
        gem.aboveRightGem() && gem.aboveRightGem().cluster === undefined && gem.aboveRightGem().colour === gem.colour
      ) {
        console.log("CREATING CLUSTER");
        const cluster = new Cluster([
          gem,
          gem.rightGem(),
          gem.aboveGem(),
          gem.aboveRightGem(),
        ]);

        this.clusters.push(cluster);

        gem.cluster = cluster;
        gem.rightGem().cluster = cluster;
        gem.aboveGem().cluster = cluster;
        gem.aboveRightGem().cluster = cluster;
      }
    });
  }

  smashGems() {
  }

  view() {
    const _this = this;
    return m('.board', {
      style: {
        position: 'relative',
      }
    }, this.forEachSquare((x, y) => {
      return m(_this.getSquare(x, y));
    }));
  }
};
