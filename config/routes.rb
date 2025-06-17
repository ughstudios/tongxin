Rails.application.routes.draw do
  root 'spa#index'
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }

  # All HTML post pages are served by the SPA
  get 'posts(/*path)', to: 'spa#index', constraints: ->(req) { req.format.html? }

  resources :posts, defaults: { format: :json } do
    resources :comments, only: [:create, :destroy]
    resource :like, only: [:create, :destroy]
  end
  get 'feed', to: 'spa#index', constraints: ->(req) { req.format.html? }
  get 'feed', to: 'posts#feed', defaults: { format: :json }
  get 'trending', to: 'spa#index', constraints: ->(req) { req.format.html? }
  get 'trending', to: 'posts#trending', defaults: { format: :json }
  get 'videos', to: 'spa#index', constraints: ->(req) { req.format.html? }
  get 'videos', to: 'posts#videos', defaults: { format: :json }
  get 'notifications', to: 'spa#index', constraints: ->(req) { req.format.html? }
  get 'notifications', to: 'notifications#index', defaults: { format: :json }
  get 'tags/:name', to: 'spa#index', constraints: ->(req) { req.format.html? }
  get 'tags/:name', to: 'posts#tagged', as: :tag, defaults: { format: :json }
  get 'users/:id', to: 'spa#index', constraints: ->(req) { req.format.html? }
  resources :users, only: [:show], defaults: { format: :json } do
    member do
      post :follow
      delete :unfollow
    end
  end

  resources :products, defaults: { format: :json }
  resource :cart, only: [:show], defaults: { format: :json }
  resources :cart_items, only: [:create, :destroy], defaults: { format: :json }
  resources :orders, only: [:index, :show, :create], defaults: { format: :json }
  resources :messages, only: [:index, :create], defaults: { format: :json }
  resources :groups, defaults: { format: :json }
  resources :live_streams, only: [:index, :show, :create], defaults: { format: :json }
  resources :brands, only: [:index], defaults: { format: :json }
  resources :partnerships, only: [:create], defaults: { format: :json }

  # Catch-all for React Router paths so direct visits work
  get '*path', to: 'spa#index', constraints: ->(req) { !req.xhr? && req.format.html? }
end
