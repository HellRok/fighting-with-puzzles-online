Rails.application.routes.draw do
  get '/', to: 'home#index', format: false

  namespace :api do
    namespace :v1 do
      resources :users, only: [:index, :show, :create] do
        resources :replays, shallow: true, only: :index do
          collection do
            get :leader_board
          end
        end
      end
      resource :sessions, only: [:show, :create, :update]
      resources :replays, only: [:index, :show, :create] do
        collection do
          get :leader_board
        end
      end
    end
  end

  get '*all', to: 'home#index', format: false
end
