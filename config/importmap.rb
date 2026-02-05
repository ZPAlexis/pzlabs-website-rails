# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin "i18next" # @25.8.4
pin "i18next-http-backend" # @3.0.2
pin "i18next-browser-languagedetector" # @8.2.0
pin "cross-fetch" # @4.0.0
pin "i18n", to: "i18n.js"
pin "index", to: "index.js"
pin_all_from "app/javascript/logic", under: "logic"