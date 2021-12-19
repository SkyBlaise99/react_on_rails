Rails.application.routes.draw do
  root 'pages#index'
  get 'pages/index'

  namespace :api do
    namespace :v1 do
      resources :tasks
    end
  end

  get '*path', to: 'pages#index', via: :all
end
