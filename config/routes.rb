Dotsongs::Application.routes.draw do
  resources :users 

  resources :songs do
		member do
	      post 'upvote'
	      post 'uphub'
	      post 'songcomment'
	      get 'songcomments'
		end
  end
  resources :sessions
  resources :aircomments, only: [:create, :index]
  resources :aircommentlikes
  resources :songcommentlikes

  root to: 'songs#index'
end
