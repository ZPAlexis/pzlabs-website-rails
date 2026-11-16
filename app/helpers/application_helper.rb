module ApplicationHelper
  DEFAULT_SHARE_IMAGE = "og/default.png"

  def page_title
    content_for(:title).presence ||
      t("meta.#{controller_name}.#{action_name}.title", default: t("meta.default_title"))
  end

  def page_description
    content_for(:description).presence ||
      t("meta.#{controller_name}.#{action_name}.description", default: t("meta.description"))
  end

  def share_image_url
    image_url(DEFAULT_SHARE_IMAGE) if asset_exists?(DEFAULT_SHARE_IMAGE)
  end

  def asset_exists?(path)
    Rails.application.assets.resolver.resolve(path).present?
  end
end
