require 'spec_helper'

describe Song do
  describe "song attributes" do
    before do
      FactoryGirl.create(:user)
      @song = FactoryGirl.create(:song)
    end

    subject { @song }

    describe "song artist can't be blank" do
      before { @song.song_artist = nil }
      it { should_not be_valid}
    end

    describe "song name can't be blank" do
      before { @song.song_name = nil }
      it { should_not be_valid}
    end

    describe "song link can't be blank" do
      before { @song.song_link = nil }
      it { should_not be_valid}
    end

    describe "song user id can't be blank" do
      before { @song.user_id = nil }
      it { should_not be_valid}
    end
  end

  describe "song associations" do
    before do
      @song = FactoryGirl.create(:song)
    end

    describe "song has an author" do
      before { FactoryGirl.create(:user) }

      it "should have one author" do
        @song.author.class.should eq(User)
      end
    end

    describe "song has one liker" do
      before { FactoryGirl.create(:user); @song.likes.create(user_id: 1) }

      it "has one liker" do
        @song.likers.length.should eq(1)
      end
    end

    describe "song has many likers" do
      before do
        20.times do
          FactoryGirl.create(:user)
          @song.likes.create(user_id: 1)
        end
      end

      it "has 20 likers" do
        @song.likers.length.should eq(20)
      end
    end
  end
end