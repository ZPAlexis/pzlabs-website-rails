pin "application", preload: true
pin "index"
pin "common"
pin "i18n"

pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"

pin_all_from "app/javascript/controllers", under: "controllers"
pin_all_from "app/javascript/logic", under: "logic"

pin "i18next" # @25.8.4
pin "i18next-http-backend" # @3.0.2
pin "i18next-browser-languagedetector" # @8.2.0
pin "cross-fetch" # @4.0.0
