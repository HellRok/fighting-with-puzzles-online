#!/usr/bin/env ruby

require 'json'

replay = JSON.parse(File.read(ARGV[0]))
output = File.open(ARGV[1], 'w')

# We don't record soft drops so we can't replay them, just don't use that for replay conversions
move_keys = {
  'hardDrop' => 'w',
  'moveActivePieceLeft' => 'a',
  'moveActivePieceRight' => 'd',
  'rotateActivePieceCW' => 'j',
  'rotateActivePieceCCW' => 'k',
  'switchActivePieceGems' => 'l',
}
current_time = 0

replay['moves'].each { |m|
  if move_keys.keys.include?(m['move'])
    output.puts %Q{press_key "#{move_keys[m['move']]}", false; sleep #{(m['timestamp']  - current_time) / 1000.0}}
    puts %Q{press_key "#{move_keys[m['move']]}", false; sleep #{(m['timestamp']  - current_time) / 1000.0}}
    current_time = m['timestamp']
  end
}
