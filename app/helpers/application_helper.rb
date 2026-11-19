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
    image = content_for(:share_image).presence || DEFAULT_SHARE_IMAGE
    image_url(image) if asset_exists?(image)
  end

  def asset_exists?(path)
    Rails.application.assets.resolver.resolve(path).present?
  end
end
