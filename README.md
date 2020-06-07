# Fighting with Puzzles Online

## TODO:

 * Real 0 ARR

## Bugs:

 * Leaderboard doesn't show all replays (This needs a proper fix)

## DEV:

### How do I run this thing?

Run these three things in different terminals:
$ bundle exec rails server
$ cd ./game_sever && bundle exec iodine config.ru -p 3002
$ yarn stylesheets
$ yarn javascripts

### How do I build this thing?

The Dockerfile should take care of that for you, just make sure you have docker
installed and run
$ make

### How do I run tests?

$ cd ./blob-test
$ ./run_test.sh
