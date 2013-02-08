require 'spec_helper'

describe 'Songs Pages' do
  before do
    FactoryGirl.create(:user)
    20.times { FactoryGirl.create(:song) }
  end


  describe "song#index" do

    subject { page }

    describe "main page" do
      before { visit root_path }

      it { should have_content('.songs') }
      it { should have_content(Song.last.song_artist) }
      it { should have_content(Song.last.song_name) }
    end
  end

  describe "song brings you to song page" do
    before do
      visit root_path
      click_link "#{Song.first.song_artist}"
    end

    subject { page }

    it "should bring you to song link" do
      page.should have_content(Song.first.song_artist)
      # find_link("#{Song.last.song_artist}").src.should == Song.last.song_link
    end
  end
end