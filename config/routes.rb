Dotsongs::Application.routes.draw do
  resources :users 

  resources :songs do
	member do
      post 'upvote'
	end
  end
  resources :sessions

  root to: 'songs#index'
end
