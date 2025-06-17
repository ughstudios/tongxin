require "application_system_test_case"

class BasicFlowTest < ApplicationSystemTestCase
  test "user can sign up and create a post" do
    visit root_path
    click_link "Sign Up"

    fill_in "Username", with: "tester"
    fill_in "Email", with: "tester@example.com"
    fill_in "Password", with: "password"
    fill_in "Password confirmation", with: "password"
    click_button "Create Account"

    assert_text "Signed in as tester"

    click_link "New Post"
    fill_in "Title", with: "Hello"
    fill_in "Body", with: "First post"
    click_button "Save"

    assert_text "Post was successfully created"
    assert_text "Hello"

    click_link "Logout"
    assert_text "Login"
  end
end
