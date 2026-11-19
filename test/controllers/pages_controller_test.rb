require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "should redirect from root to localized path" do
    get root_url
    assert_response :redirect
    assert_redirected_to "/#{I18n.default_locale}"
  end

  test "should get index with locale" do
    get root_url(locale: I18n.default_locale)
    assert_response :success
  end

  test "should get about" do
    get about_url
    assert_response :success
  end

  test "should get born_survivor" do
    get pages_born_survivor_url
    assert_response :success
  end

  test "should get dev" do
    get dev_url
    assert_response :success
  end

  test "should get flappy_astronaut" do
    get pages_flappy_astronaut_url
    assert_response :success
  end

  test "should get projects" do
    get projects_url
    assert_response :success
  end

  test "should get trofy" do
    get pages_trofy_url
    assert_response :success
  end

  test "about sets the English title, lang and link preview tags" do
    get about_url(locale: :en)
    assert_response :success
    assert_select "html[lang=?]", "en"
    assert_select "title", "About | Alexis Coelho"
    assert_select "meta[property='og:title'][content=?]", "About | Alexis Coelho"
    assert_select "meta[property='og:description'][content=?]", I18n.t("meta.description", locale: :en)
    assert_select "meta[property='og:url'][content$=?]", "/en/about"
    assert_select "meta[property='og:locale'][content=?]", "en_US"
    assert_select "meta[property='og:locale:alternate'][content=?]", "pt_BR"
    assert_select "meta[property='og:image']" do |tags|
      assert_match %r{\Ahttps?://[^/]+/assets/og/default-\w+\.png\z}, tags.first["content"]
    end
    assert_select "meta[name='twitter:card'][content=?]", "summary_large_image"
  end

  test "about sets the Portuguese title, lang and locale tags" do
    get about_url(locale: :pt)
    assert_response :success
    assert_select "html[lang=?]", "pt-BR"
    assert_select "title", "Sobre | Alexis Coelho"
    assert_select "meta[property='og:locale'][content=?]", "pt_BR"
    assert_select "meta[property='og:locale:alternate'][content=?]", "en_US"
  end

  test "a project page uses its own title and description" do
    get pages_jiko_url(locale: :en)
    assert_response :success
    assert_select "title", "JIKO | Alexis Coelho"
    assert_select "meta[name='description'][content=?]", I18n.t("meta.pages.jiko.description", locale: :en)
  end

  test "a page with no title of its own falls back to the default" do
    get dev_url(locale: :en)
    assert_response :success
    assert_select "title", "Alexis Coelho"
  end

  test "provenance pipeline renders in English with its banner as the link preview image" do
    get pages_provenance_pipeline_url(locale: :en)
    assert_response :success
    assert_select "title", "Provenance Pipeline | Alexis Coelho"
    assert_select "meta[property='og:description'][content=?]", I18n.t("projects.provenance_pipeline_project_description", locale: :en)
    assert_select "meta[property='og:image']" do |tags|
      assert_match %r{/assets/projects/provenance_pipeline/provenance_pipeline_banner-\w+\.png\z}, tags.first["content"]
    end
    assert_select "h1 + p.post-text", I18n.t("portfolio.provenance_pipeline.subtitle", locale: :en)
    assert_select "table.post-table", 2
    assert_select "table.post-table tbody tr", 18
    assert_select ".post-result-card", 5
    assert_select "img.js-zoomable-image, .post-image-placeholder", 6
    assert_select ".translation_missing", 0
  end

  test "provenance pipeline links to the repo's docs, in a new tab" do
    repo = "https://github.com/ZPAlexis/provenance-pipeline"
    get pages_provenance_pipeline_url(locale: :pt)
    assert_response :success
    assert_select "a.post-code-link[href^='#{repo}/blob/main/']", 7
    assert_select "a.post-code-link[href^='http']:not([target='_blank'][rel='noopener'])", 0
    assert_select "a.post-code-link[href^='mailto:']", 1
    assert_select "a.post-code-link[href^='https://www.linkedin.com/'], a.post-code-link[href^='https://wa.me/']", 2
    assert_select "button.doc-button[data-target^='#{repo}'][data-new-tab='true']", 7
    assert_select "button.doc-button .doc-button-path", text: "docs/build-stages.md:"
  end

  test "provenance pipeline keeps how I built it under the project plan, without its own heading" do
    get pages_provenance_pipeline_url(locale: :en)
    assert_response :success
    assert_select "#how-built", 0
    assert_select "#plan ~ .post-quote-box.titled .post-text-title", I18n.t("portfolio.provenance_pipeline.how_built_heading", locale: :en)
    assert_select ".post-result-card .post-result-part", 3
  end

  test "provenance pipeline renders in Portuguese" do
    get pages_provenance_pipeline_url(locale: :pt)
    assert_response :success
    assert_select "html[lang=?]", "pt-BR"
    assert_select "h1 + p.post-text", I18n.t("portfolio.provenance_pipeline.subtitle", locale: :pt)
    assert_select ".translation_missing", 0
  end

  test "provenance pipeline has the same keys in English and Portuguese" do
    flatten = ->(hash, prefix = nil) do
      hash.flat_map do |key, value|
        path = [ prefix, key ].compact.join(".")
        value.is_a?(Hash) ? flatten.call(value, path) : [ path ]
      end
    end
    en = flatten.call(I18n.t("portfolio.provenance_pipeline", locale: :en)).sort
    pt = flatten.call(I18n.t("portfolio.provenance_pipeline", locale: :pt)).sort
    assert_equal en, pt
  end

  test "the projects list starts with provenance pipeline, linking to its page and repo" do
    get projects_url(locale: :pt)
    assert_response :success
    assert_select ".project-container:first-child .project-title-text", "Provenance Pipeline"
    assert_select ".project-container:first-child button[data-target=?]", "/pt/projects/provenance_pipeline"
    assert_select ".project-container:first-child button[data-target=?]", "https://github.com/ZPAlexis/provenance-pipeline"
  end

  test "about links to provenance pipeline in its own locale" do
    get about_url(locale: :pt)
    assert_response :success
    assert_select "button[data-target=?]", "/pt/projects/provenance_pipeline"
    assert_select "#ai ~ p.about-text-description", text: I18n.t("about.ai_4", locale: :pt)
  end
end
