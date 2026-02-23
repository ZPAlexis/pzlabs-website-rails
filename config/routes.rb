Rails.application.routes.draw do
  namespace :api do
    post "record-event", to: "events#create"
    get  "metrics/coins", to: "events#metrics"
  end

  get "about", to: "pages#about", as: :about
  get "projects", to: "pages#projects", as: :projects
  get "dev", to: "pages#dev", as: :dev
  get "projects/born_survivor", to: "pages#born_survivor", as: :pages_born_survivor
  get "projects/flappy_astronaut", to: "pages#flappy_astronaut", as: :pages_flappy_astronaut
  get "projects/trofy", to: "pages#trofy", as: :pages_trofy
  root "pages#index"
  
  get "up" => "rails/health#show", as: :rails_health_check

  get "/.well-known/appspecific/com.chrome.devtools.json", to: proc { [ 200, {}, [ "{}" ] ] }
end
