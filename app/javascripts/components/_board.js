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
  }

  oncreate() {
    this.canvas = document.querySelector('.board');
    this.context = this.canvas.getContext('2d');
    const _this = this;
    this.forEachSquare((x, y) => {
      _this.setSquare(new Gem(
        this, x, y,
        sample(['red', 'blue', 'orange', 'purple'])
      ));
    });

    this.update();
  }

  update() {
    this.growClusters();
    this.createClusters();
    console.log(this.clusters);
    window.clusters = this.clusters;
    this.smashGems();
    this.render();
  }

  render() {
    const _this = this;
    this.forEachSquare((x, y) => {
      _this.getSquare(x, y).render(this.context);
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
              sample(['red', 'blue', 'orange', 'purple'])
            ));
          });
          this.update();
        }
      }, 'Randomise'),
      m('canvas.board', {
        width: (32 * this.width),
        height: (32 * this.height)
      })
    ];
  }
};
