Rails.application.routes.draw do
  root 'posts#index'
  resources :posts
  resources :users
  resources :sessions, only: [:new, :create, :destroy]
end
