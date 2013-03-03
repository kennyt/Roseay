Dotsongs::Application.routes.draw do
  resources :users 

  resources :songs do
		member do
	      post 'upvote'
	      post 'uphub'
		end
  end
  resources :sessions
  resources :remarks, only: [:index, :create]

  root to: 'songs#index'
end
