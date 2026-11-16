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
end
