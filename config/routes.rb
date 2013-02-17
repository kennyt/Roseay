Dotsongs::Application.routes.draw do
  resources :users 

  resources :songs do
	member do
      get 'upvote'
	end
  end
  resources :sessions

  root to: 'songs#index'
end
