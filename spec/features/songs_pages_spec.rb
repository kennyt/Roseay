require 'spec_helper'

describe 'Songs Pages' do
  def fill_in_user
    fill_in 'Username', with: 'User1'
    fill_in 'Password', with: '123456'
    click_button 'Create User'
  end

  def fill_in_song
    fill_in 'Song artist ', with: 'asdf'
    fill_in 'Song name ', with: 'zzzz'
    fill_in 'Song link ', with: 'www.appacademy.io'
    click_button 'Create Song'
  end

  before do
    FactoryGirl.create(:user)
    20.times { FactoryGirl.create(:song) }
  end

  describe "song#index" do

    subject { page }

    describe "main page" do
      before { visit root_path }

      it { should have_content('.dance') }
      it { should have_content(Song.last.song_artist) }
      it { should have_content(Song.last.song_name) }
    end
  end

  describe "song brings you to song page" do
    before do
      visit root_path
    end
    subject { page }

    it "should have link" do
      page.should have_link("#{Song.first.song_artist} - #{Song.first.song_name}",
                           {:href => 'www.google.com'})
    end
  end

  describe "song#new" do
    before do
      visit root_path
      click_on 'submit'
    end

    subject { page }

    it "brings you to login page if not logged in" do
      current_path.should == '/sessions/new'
    end

    it "is able to submit a song" do
      u = FactoryGirl.create(:user)
      u.submissions.create(song_artist: 'asdf', song_name: 'zzzz',
                           song_link: 'appacademy.io')
      visit root_path
      page.should have_content('asdf')
    end
  end
end