Rails.application.routes.draw do
  root 'posts#index'
  devise_for :users
  resources :posts do
    resources :comments, only: [:create, :destroy]
    resource :like, only: [:create, :destroy]
  end
  get 'feed', to: 'posts#feed'
  get 'trending', to: 'posts#trending'
  resources :users, only: [:show] do
    member do
      post :follow
      delete :unfollow
    end
  end
end
