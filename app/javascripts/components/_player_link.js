import m from 'mithril';
import { isEmpty } from 'lodash/lang';

import { isBigScreen } from '../lib/helpers';

export default {
  view: (vnode) => {
    if (isEmpty(vnode.attrs.user)) {
      return 'Anon';
    } else {
      if (vnode.attrs.state?.alive && !isBigScreen()) {
        return vnode.attrs.user.username;
      } else {
        return m(m.route.Link, { href: `/profile/${vnode.attrs.user.id}` }, vnode.attrs.user.username);
      }
    }
  }
};
