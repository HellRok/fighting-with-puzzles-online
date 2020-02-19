source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

gem 'rails', '~> 6.0.0'
gem 'sqlite3', groups: [:development, :test]
gem 'pg', '>= 0.18', '< 2.0', groups: [:production]
gem 'puma'
gem 'bcrypt'
gem 'cancancan'
gem 'jbuilder'

group :production do
  gem 'tzinfo-data' # Needed to run on Heroku apparently
end

group :development do
  gem 'listen', '>= 3.0.5', '< 3.2'
end
