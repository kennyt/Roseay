require 'spec_helper'

describe User do
  describe "user attributes" do
    before do
      @user = FactoryGirl.create(:user)
    end

    subject { @user }

    it { should respond_to(:username) }
    it { should respond_to(:password) }
    it { should respond_to(:password_confirmation) }

    describe "password can't be blank when creating a user" do
      before { @user.password = nil}
      it { should_not be_valid}
    end

    describe "username can't be blank" do
      before { @user.username = nil }
      it { should_not be_valid}
    end

    describe "password confirmation can't be blank" do
      before { @user.password_confirmation = nil}
      it { should_not be_valid}
    end
  end

  describe "user associations" do
    before do
      @user = FactoryGirl.create(:user)
    end

    subject { @user }

    describe "user can submit a song" do
      before { FactoryGirl.create(:song) }

      it "should have one submitted song" do
        @user.submissions.length.should eq(1)
      end
    end

    describe "user can submit many songs" do
      before { 20.times{ FactoryGirl.create(:song) } }

      it "should have one submitted song" do
        @user.submissions.length.should eq(20)
      end
    end

    describe "user should be able to vote up" do
      before { FactoryGirl.create(:song); FactoryGirl.create(:like) }

      it "should have one liked song" do
        @user.liked_songs.length.should eq(1)
      end
    end
  end
end