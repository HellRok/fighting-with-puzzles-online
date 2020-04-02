#!/usr/bin/env ruby

require 'bundler'

Bundler.require

require 'capybara/rspec'
require 'webdrivers'

Capybara.run_server = false
Capybara.default_driver = :selenium
Capybara.app_host = 'http://localhost:9999'
Capybara.current_session.current_window.resize_to(1280, 800)

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

describe 'User registration and sessions', type: :feature do
  before do
    visit '/'
  end

  it 'lets you create a user' do
    click_link 'Register'
    fill_in 'Username', with: 'TestUser'
    fill_in 'Password', with: 'Password123'
    fill_in 'Password Confirmation', with: 'Password123'
    click_button 'Submit'

    expect(page).to have_content 'Welcome TestUser!'
  end

  it 'has sensible error messages on registration' do
    click_link 'Register'
    fill_in 'Username', with: 'TestUser'
    fill_in 'Password', with: 'Password123'
    fill_in 'Password Confirmation', with: 'SomethingElse'
    click_button 'Submit'

    expect(page).to have_content 'has already been taken'
    expect(page).to have_content 'doesn\'t match Password'
  end

  it 'lets you login as the newly created user' do
    click_link 'Login'
    fill_in 'Username', with: 'TestUser'
    fill_in 'Password', with: 'Password123'
    click_button 'Submit'

    expect(page).to have_content 'Logged in as TestUser'
  end

  it 'lets you logout' do
    click_link 'Login'
    fill_in 'Username', with: 'TestUser'
    fill_in 'Password', with: 'Password123'
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
    expect(page).to have_content 'You took 0:05'
    expect(page).to have_content 'Gems: -4'
    expect(page).to have_content 'Replay saved'
  end

  it 'can play the replay' do
    click_link 'TestUser'
    click_link href: /sprint\/replay\/\d/
    sleep 10
    expect(page).to have_content 'Sprint Replay'
    expect(page).to have_content 'TestUser'
    expect(page).to have_content 'Finished'
    expect(page).to have_content 'They took 0:05'
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
    13.times { press_key 'w' }
    expect(page).to have_content 'Finished'
    expect(page).to have_content 'You survived 0:07'
    expect(page).to have_content 'Score: 800'
    expect(page).to have_content 'Replay saved'
  end

  it 'can play the replay' do
    click_link 'TestUser'
    click_link href: /survival\/replay\/\d/
    sleep 10
    expect(page).to have_content 'Survival Replay'
    expect(page).to have_content 'TestUser'
    expect(page).to have_content 'Finished'
    expect(page).to have_content 'They survived 0:07'
    expect(page).to have_content 'Score: 800'
  end
end

def login
  visit '/login'
  fill_in 'Username', with: 'TestUser'
  fill_in 'Password', with: 'Password123'
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
    setTimeout(() => { document.dispatchEvent(keyup) }, 16);
  JS
  page.driver.browser.execute_script(keypress_script)
  sleep 0.016
end

def setup_keys
  page.find('.toggle-settings').click
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
