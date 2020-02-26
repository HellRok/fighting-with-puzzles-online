import m from 'mithril';

import Flash from '../lib/flash';

export default class FlashManager {
  view() {
    return m('.flashes',
      Flash.flashes.map((flash, index) => {
        return m(
          flash.href ? m.route.Link : 'div',
          {
            key: flash.id,
            class: `flash ${flash.level}`,
            href: flash.href,
            style: { top: `${index * 50}px` },
            onclick: () => { Flash.removeFlash(flash.id) },
          },
          flash.text
        );
      })
    );
  }
};
