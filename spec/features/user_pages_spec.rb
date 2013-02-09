require 'spec_helper'

describe "UserPages" do

  def fill_in_signin(user)
    fill_in 'Username', with: user.username
    fill_in 'Password', with: '123456'
    click_button 'Sign In'
  end

  describe "user#show page" do
    before do
      FactoryGirl.create(:user)
      visit user_path(User.first)
    end

    subject{ page }

    it { should have_content("#{User.first.username}") }

    describe "shows the users submission" do
      before { FactoryGirl.create(:song); visit user_path(User.first) }

      it "has the song name in submissions" do
        page.should have_content("#{User.first.submissions.first.song_name}")
      end

      it "has the song artist in submissions" do
        page.should have_content("#{User.first.submissions.first.song_artist}")
      end
    end

    describe "shows the songs the user upvoted" do
      before do
        FactoryGirl.create(:song)
        FactoryGirl.create(:user)
        User.last.vote_up(Song.last)
        visit user_path(User.last)
      end

      it "has the song name in upvoted" do
        page.should have_content("#{User.first.submissions.first.song_name}")
      end

      it "has the song artist in upvoted" do
        page.should have_content("#{User.first.submissions.first.song_artist}")
      end
    end
  end

  describe "songs#index page with loggin in user" do
    before do
      FactoryGirl.create(:user)
      visit new_session_path
      fill_in_signin(User.last)
    end

    subject { page }

    it "has the right setup in homepage for user" do
      visit songs_path
      page.should have_content(User.last.username)
    end
  end
end





