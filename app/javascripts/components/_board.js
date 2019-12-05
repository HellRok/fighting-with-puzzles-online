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
        'green'
        //sample(['red', 'green', 'blue', 'yellow'])
        //sample(['red', 'green', 'blue'])
      ));
    });


    //debugging
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
      if (this.clusters.length > 0) { return };

      const gem = this.getSquare(x, y);

      if (gem === undefined || gem.cluster !== undefined) { return undefined; }

      if (
        gem.rightGem()      && !gem.rightGem().cluster      && gem.rightGem().colour      === gem.colour &&
        gem.belowGem()      && !gem.belowGem().cluster      && gem.belowGem().colour      === gem.colour &&
        gem.belowRightGem() && !gem.belowRightGem().cluster && gem.belowRightGem().colour === gem.colour
      ) {
        console.log(`CREATING CLUSTER: ${x}, ${y}`);
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
  }

  view() {
    const _this = this;
    return [
      m('button', {
        onclick: () => {
          console.log('RANDOMISE');
          this.clusters = window.clusters = [];
          this.forEachSquare((x, y) => {
            _this.setSquare(new Gem(
              this, x, y,
              'green'
              //sample(['red', 'green', 'blue', 'yellow'])
            ));
          });
          this.growClusters();
          this.createClusters();
          console.log(this.clusters);
          window.clusters = this.clusters;
          this.smashGems();
        }
      }, 'Randomise'),
      m('.board', {
        style: {
          position: 'relative',
        }
      }, this.forEachSquare((x, y) => {
        return m(_this.getSquare(x, y));
      }))
    ];
  }
};
