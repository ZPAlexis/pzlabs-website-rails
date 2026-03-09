require "application_system_test_case"

class HomepagesTest < ApplicationSystemTestCase
  test "visiting the index" do
    visit root_url
    assert_current_path "/#{I18n.default_locale}"
    assert_selector "nav"
    assert_selector "footer"
  end
end
