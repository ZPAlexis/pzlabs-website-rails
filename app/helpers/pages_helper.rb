module PagesHelper
  # Renders a post image, or a labelled placeholder box until the image file exists.
  def post_image_or_placeholder(path, alt:)
    if asset_exists?(path)
      image_tag path, alt: alt, class: "post-image drop-shadow js-zoomable-image"
    else
      tag.div(alt, class: "post-image-placeholder", role: "img", aria: { label: alt })
    end
  end

  # A GitHub button that names the file it opens, e.g. "docs/build-stages.md: Project stages as built".
  def github_doc_button(url, path:, label:)
    tag.button(class: "js-animated-button cta-button nav-button social doc-button post-self-center",
               data: { action: "navigate", target: url, new_tab: "true" }) do
      safe_join([
        image_tag("icons/icon_github_dark.png", class: "button-icon"),
        tag.span(class: "doc-button-text") { safe_join([ tag.span("#{path}:", class: "doc-button-path"), " ", label ]) }
      ])
    end
  end
end
