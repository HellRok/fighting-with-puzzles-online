#!/usr/bin/env ruby

# https://stackoverflow.com/a/38861839

require 'bundler'
require 'open-uri'

Bundler.require

require 'capybara/rspec'
require 'capybara-screenshot/rspec'
require 'webdrivers'

Capybara.run_server = false
Capybara.default_driver = ENV.fetch('CAPYBARA_DRIVER', :selenium_chrome_headless).to_sym
Capybara.app_host = 'http://localhost:9999'
Capybara.current_session.current_window.resize_to(1280, 800)
Capybara.save_path = './tmp'

bad_strings = JSON.parse(URI.open('https://raw.githubusercontent.com/minimaxir/big-list-of-naughty-strings/master/blns.json').read)

describe 'First time banner', type: :feature do
  before do
    visit '/'
  end

  it 'is on the first page loaded' do
    expect(page).to have_content 'It looks like it\'s your first time here'
  end

  it 'when clicked takes you to the how to play page and gets rid of the banner' do
    click_link 'see how to play'

    expect(page).to have_content 'How to Play'
    expect(page).to_not have_content 'It looks like it\'s your first time here'
  end
end

USERNAME = bad_strings.sample
PASSWORD = bad_strings.sample

puts "Username: #{USERNAME}"
puts "Password: #{PASSWORD}"

describe 'User registration and sessions', type: :feature do
  before do
    visit '/'
  end

  it 'lets you create a user' do
    click_link 'Register'
    fill_in 'Username', with: USERNAME
    fill_in 'Password', with: PASSWORD
    fill_in 'Password Confirmation', with: PASSWORD
    click_button 'Submit'

    expect(page).to have_content "Welcome #{USERNAME}!"
  end

  it 'has sensible error messages on registration' do
    click_link 'Register'
    fill_in 'Username', with: USERNAME
    fill_in 'Password', with: PASSWORD
    fill_in 'Password Confirmation', with: 'SomethingElse'
    click_button 'Submit'

    expect(page).to have_content 'has already been taken'
    expect(page).to have_content 'doesn\'t match Password'
  end

  it 'lets you login as the newly created user' do
    click_link 'Login'
    fill_in 'Username', with: USERNAME
    fill_in 'Password', with: PASSWORD
    click_button 'Submit'

    expect(page).to have_content "Logged in as #{USERNAME}"
  end

  it 'lets you logout' do
    click_link 'Login'
    fill_in 'Username', with: USERNAME
    fill_in 'Password', with: PASSWORD
    click_button 'Submit'

    click_link 'Logout'

    expect(page).to have_content 'Login'
    expect(page).to have_content 'Register'
  end
end

describe 'Sprint game mode', type: :feature do
  before do
    login
    visit '/sprint?seed=123456'
    setup_keys
  end

  it 'lets you die' do
    press_key 'q'
    sleep 1.3
    15.times { press_key 'w' }
    expect(page).to have_content 'Oh no, you topped out!'
  end

  it 'lets you win' do
    press_key 'q'
    sleep 1.3
    require './games/sprint_win'
    sprint_win
    expect(page).to have_content 'Finished'
    expect(page).to have_content 'You took 0:0'
    expect(page).to have_content 'Gems: -4'
    expect(page).to have_content 'Replay saved'
  end

  it 'can play the replay' do
    click_link USERNAME
    click_link href: /sprint\/replay\/\d/
    sleep 10
    expect(page).to have_content 'Sprint Replay'
    expect(page).to have_content USERNAME
    expect(page).to have_content 'Finished'
    expect(page).to have_content 'They took 0:0'
    expect(page).to have_content 'Gems: -4'
  end
end

describe 'Survival game mode', type: :feature do
  before do
    login
    visit '/survival?seed=123456'
    setup_keys
  end

  it 'lets you win' do
    press_key 'q'
    sleep 7.3
    17.times { press_key 'w' }
    expect(page).to have_content 'Finished'
    expect(page).to have_content 'You survived 0:0'
    expect(page).to have_content 'Score: 1,000'
    expect(page).to have_content 'Replay saved'
  end

  it 'can play the replay' do
    click_link USERNAME
    click_link href: /survival\/replay\/\d/
    sleep 10
    expect(page).to have_content 'Survival Replay'
    expect(page).to have_content USERNAME
    expect(page).to have_content 'Finished'
    expect(page).to have_content 'They survived 0:0'
    expect(page).to have_content 'Score: 1,000'
  end
end

describe 'Ultra game mode', type: :feature do
  before do
    login
    visit '/ultra?seed=1588857284522'
    setup_keys
  end

  it 'lets you die' do
    press_key 'q'
    sleep 1.3
    17.times { press_key 'w' }
    expect(page).to have_content 'Oh no, you topped out!'
  end

  it 'lets you win' do
    press_key 'q'
    play_replay('./games/ultra_win.json')
    expect(page).to have_content 'Finished'
    expect(page).to have_content 'Score: 57,450'
    expect(page).to have_content 'Replay saved'
  end

  it 'can play the replay' do
    click_link USERNAME
    click_link href: /ultra\/replay\/\d/
    sleep 183
    expect(page).to have_content 'Ultra Replay'
    expect(page).to have_content USERNAME
    expect(page).to have_content 'Finished'
    expect(page).to have_content 'Their score was 57,450!'
    expect(page).to have_content 'Score: 57,450'
  end
end

def login
  visit '/login'
  fill_in 'Username', with: USERNAME
  fill_in 'Password', with: PASSWORD
  click_button 'Submit'
end

def press_key(key)
  keycodes = {
    'q' => 81,
    'w' => 87,
    'a' => 65,
    's' => 83,
    'd' => 68,
    'j' => 74,
    'k' => 75,
    'l' => 76,
  }
  keypress_script = <<-JS
    const keydown = new KeyboardEvent('keydown', { keyCode : #{keycodes[key]} });
    const keyup = new KeyboardEvent('keyup', { keyCode : #{keycodes[key]} });
    document.dispatchEvent(keydown);
    setTimeout(() => { document.dispatchEvent(keyup) }, 5);
  JS
  page.driver.browser.execute_script(keypress_script)
  sleep 0.016
end

def setup_keys
  page.find('.toggle-settings').click
  page.find('#das').send_keys :backspace, :backspace, :backspace, '117'
  page.find('#arr').send_keys :backspace, :backspace, '0'
  page.find('#restart').send_keys 'q'
  page.find('#left').send_keys 'a'
  page.find('#right').send_keys 'd'
  page.find('#hardDrop').send_keys 'w'
  page.find('#softDrop').send_keys 's'
  page.find('#cw').send_keys 'j'
  page.find('#ccw').send_keys 'k'
  page.find('#switch').send_keys 'l'
  click_button 'Save'
end

def play_replay(file)
  replay = JSON.parse(File.read(file))
  move_keys = {
    'hardDrop' => 'w',
    'moveActivePieceLeft' => 'a',
    'moveActivePieceRight' => 'd',
    'rotateActivePieceCW' => 'j',
    'rotateActivePieceCCW' => 'k',
    'switchActivePieceGems' => 'l',
  }
  moves = replay['moves']
  current_time = (Time.now.to_f * 1000).to_i
  elapsed_time = 0

  loop do
    moves.each { |move|
      break if move['timestamp'] > elapsed_time

      if move_keys.keys.include?(move['move'])
        press_key move_keys[move['move']]
      end

      moves.shift
    }

    break if moves.size.zero?

    new_time = (Time.now.to_f * 1000).to_i
    elapsed_time = new_time - current_time
  end
end
