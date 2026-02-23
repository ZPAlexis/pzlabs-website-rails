require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get root_url
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
end
