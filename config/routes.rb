Rails.application.routes.draw do
  root 'posts#index'
  devise_for :users
  resources :posts do
    collection do
      get :feed
      get :trending
      get :search
    end
    resources :comments, only: [:create, :destroy]
    resources :likes, only: [:create, :destroy]
  end
  resources :users, only: [:show] do
    resources :follows, only: [:create, :destroy]
  end
end
