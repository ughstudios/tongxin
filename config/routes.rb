Rails.application.routes.draw do
  root 'posts#index'
  devise_for :users
  resources :posts do
    resources :comments, only: [:create, :destroy]
  end
  resources :users, only: [:show]
  resources :recommendations, only: [:index]
end
