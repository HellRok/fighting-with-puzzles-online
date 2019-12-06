Rails.application.routes.draw do
  get '/', to: 'home#index', format: false
end
