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
  it 'is on the first page loaded' do
    visit '/'

    expect(page).to have_content 'It looks like it\'s your first time here'
  end

  it 'when clicked takes you to the how to play page and gets rid of the banner' do
    visit '/'
    click_link 'see how to play'

    expect(page).to have_content 'How to Play'
    expect(page).to_not have_content 'It looks like it\'s your first time here'
  end
end
