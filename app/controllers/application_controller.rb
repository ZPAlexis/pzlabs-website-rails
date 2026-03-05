class ApplicationController < ActionController::Base
  allow_browser versions: :modern
  stale_when_importmap_changes

  before_action :set_locale

  private

  def set_locale
    parsed_locale = params[:locale]
    I18n.locale = I18n.available_locales.include?(parsed_locale&.to_sym) ? parsed_locale : I18n.default_locale
  end

  def default_url_options
    { locale: I18n.locale }
  end
end
