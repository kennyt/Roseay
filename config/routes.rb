Dotsongs::Application.routes.draw do
  resources :users
  resources :songs
  resources :sessions

  root to: 'songs#index'
end
