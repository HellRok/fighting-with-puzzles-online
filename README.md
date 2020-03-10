# Fighting with Puzzles Online

## TODO:

 * Real 0 ARR
 * Mobile controls
 * Live vs (one day...)

## Bugs:

 * Leaderboard doesn't show all replays (This needs a proper fix)
 * When clearing out the 3x12 and 4x12 the game thinks you lose when you shouldn't
 * Lockdelay when initialized late in the gravity turn locks immediately, it
   should start fresh

## DEV:

### How do I run this thing?

Run these three things in different terminals:
$ bundle exec rails server
$ yarn stylesheets
$ yarn javascripts

### How do I build this thing?

The Dockerfile should take care of that for you, just make sure you have docker
installed and run
$ make
