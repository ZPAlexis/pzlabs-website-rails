require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

module PzlabsWebsiteRails
  class Application < Rails::Application
    config.load_defaults 8.1

    config.autoload_lib(ignore: %w[assets tasks])

    config.i18n.available_locales = [:en, :pt]
    config.i18n.default_locale = :en
  end
end
