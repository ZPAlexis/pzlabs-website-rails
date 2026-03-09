class ApplicationController < ActionController::Base
  allow_browser versions: :modern
  stale_when_importmap_changes

  before_action :set_locale_and_redirect

  private

  def set_locale_and_redirect
    if params[:locale].present?
      I18n.locale = params[:locale]
      cookies[:locale] = { value: params[:locale], expires: 30.days.from_now }

    elsif request.path == "/"
      preferred_locale = cookies[:locale] || extract_locale_from_accept_language || I18n.default_locale
      redirect_to "/#{preferred_locale}"

    else
      I18n.locale = params[:locale] || I18n.default_locale
    end
  end

  def extract_locale_from_accept_language
    language = request.env["HTTP_ACCEPT_LANGUAGE"]&.scan(/^[a-z]{2}/)&.first
    I18n.available_locales.map(&:to_s).include?(language) ? language : nil
  end

  def default_url_options
    { locale: I18n.locale }
  end
end
