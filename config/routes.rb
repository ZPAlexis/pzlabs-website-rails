Rails.application.routes.draw do
  get "about", to: "pages#about"
  get "projects", to: "pages#projects"
  get "dev", to: "pages#dev"
  get "projects/born_survivor", to: "pages#born_survivor"
  get "projects/flappy_astronaut", to: "pages#flappy_astronaut"
  get "projects/trofy", to: "pages#trofy"
  root "pages#index"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Silence Chrome DevTools requests
  get '/.well-known/appspecific/com.chrome.devtools.json', to: proc { [200, {}, ['{}']] }
end
