#!/usr/bin/env ruby

def score(x, y)
  result = x * y * 20
  if x == y
    result *= 1.25
  end

  result
end

square_sizes = (2..11).map { |y|
  (2..6).map { |x|
    {
      [x, y].join('x') => {
        gems: x * y,
        score: score(x, y)
      }
    }
  }
}.flatten

puts "Total: #{square_sizes.size}"
puts square_sizes
