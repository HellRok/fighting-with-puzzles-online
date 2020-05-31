#!/usr/bin/env ruby

require 'open-uri'

data = JSON.parse(URI.open('http://share.apps.oequacki.com/new_format.json').read)

data.each { |id, contents| Replay.find(id).update(data: contents) }


# Details!
#
#  I put this code in the home.js file so I could pull all the new format replays out
#    let data = {};
#    Api.replaysAll().then(replays => {
#      console.log(replays);
#      replays.forEach(replay => {
#        data[replay.id] = replay.compressing();
#      });
#    }).then(() => {
#      var element = document.createElement('a');
#      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data)));
#      element.setAttribute('download', 'test.json');
#
#      element.style.display = 'none';
#      document.body.appendChild(element);
#
#      element.click();
#
#      document.body.removeChild(element);
#    });
#
#  And added this code to the replay model so I could get the new format
#    compressing() {
#      if (!this.data) { return undefined };
#      return compressToUTF16(JSON.stringify(this.parsedData()));
#    }
