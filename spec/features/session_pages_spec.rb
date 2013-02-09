require 'spec_helper'

describe "SessionPages" do

  def fill_in_signup
    fill_in 'Username', with: 'tester!'
    fill_in 'user_password', with: '1234'
    fill_in 'Password confirmation', with: '1234'
    click_button 'Create User'
  end

  def fill_in_signin
    fill_in 'Username', with: 'testzz'
    fill_in 'Password', with: '1234'
    click_button 'Sign In'
  end

  describe "able to create users" do
    before do
      visit new_user_path
      fill_in_signup
    end

    it "creates a new user" do
      User.last.username.should == 'tester!'
    end
  end

  describe "able to signin with existing user" do
    before do
      User.create(username: 'testzz', password: '1234', password_confirmation: '1234')
      visit new_session_path
      fill_in_signin
    end

    subject { page }

    it "can sign in" do
      current_path.should == '/songs'
    end

    it "can log out" do
      click_on 'logout'
      page.should_not have_content(User.last.username)
    end
  end
end