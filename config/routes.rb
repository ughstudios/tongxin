Rails.application.routes.draw do
  root 'posts#index'
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }
  resources :posts do
    resources :comments, only: [:create, :destroy]
    resource :like, only: [:create, :destroy]
  end
  get 'feed', to: 'posts#feed'
  get 'trending', to: 'posts#trending'
  get 'videos', to: 'posts#videos'
  get 'notifications', to: 'notifications#index'
  get 'tags/:name', to: 'posts#tagged', as: :tag
  resources :users, only: [:show] do
    member do
      post :follow
      delete :unfollow
    end
  end

  resources :products
  resource :cart, only: [:show]
  resources :cart_items, only: [:create, :destroy]
  resources :orders, only: [:index, :show, :create]
  resources :messages, only: [:index, :create]
  resources :groups
  resources :live_streams, only: [:index, :show, :create]
  resources :brands, only: [:index]
  resources :partnerships, only: [:create]
end
