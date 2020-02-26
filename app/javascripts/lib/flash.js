import m from 'mithril';
import { partition } from 'lodash/collection';

export default {
  lastId: 0,
  flashes: [],

  /* Expected hash to be like:
   *    {
   *      text: 'Something to display',
   *      level: 'success', // Optional (info(default), success, error, warning)
   *      href: '/home', // Optional
   *      timeout: 5000, // Optional
   *      afterClear: () => { console.log('hi'); } // Optional
   *    }
   */
  addFlash: function(opts) {
    this.lastId += 1;

    const newFlash = {
      ...{ level: 'info' },
      ...opts,
      ...{ id: this.lastId },
    };

    if (newFlash.timeout) {
      const _lastId = this.lastId;
      newFlash.timeoutCallback = setTimeout(() => { this.removeFlash(_lastId) }, newFlash.timeout);
    }

    this.flashes.push(newFlash);
    m.redraw();
  },

  removeFlash: function(id) {
    let removedFlash;
    [removedFlash, this.flashes] = partition(this.flashes, flash => flash.id === id);
    removedFlash = removedFlash[0];

    if (removedFlash.timeout) { clearTimeout(removedFlash.timeoutCallback); }
    if (removedFlash.afterClear) { removedFlash.afterClear(); }

    m.redraw();
  }
}
