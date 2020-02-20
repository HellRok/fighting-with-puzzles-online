Rails.application.routes.draw do
  get '/', to: 'home#index', format: false

  namespace :api do
    namespace :v1 do
      resources :users, only: [:index, :show, :create]
      resources :sessions, only: [:index, :create]
      resources :replays
    end
  end

  get '*all', to: 'home#index', format: false
end
