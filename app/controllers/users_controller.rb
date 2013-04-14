class UsersController < ApplicationController
  def index
    # @user = User.find(params[:id])
    # @remarks = []
    # @user.submissions.each {|song| @remarks << Remark.mentioned_song(song.id) }
    # @remarks = @remarks.flatten.uniq
    # @remarks.sort! {|x, y| y.created_at <=> x.created_at }
    # page = params[:page].to_i

    # respond_to do |format|
    #   format.html
    #   if @remarks[page*16..page*16+15].nil?
    #     format.json { render :json => {} }
    #   else
    #     format.json { render :json => custom_remark_json(@remarks[page*16..page*16+15]) }
    #   end
    # end
    respond_to do |format|
      format.json { render :json => custom_user_json }
    end
  end

  def new
    @user = User.new
  end

  def create
    user = User.new(params[:user])
    user.username.downcase!

    respond_to do |format|
      if user.save
        build_cookie(user)
        @account_sid = 'AC6839fc4ef5994628a25e6f8169f991d1'
        @auth_token = 'e59630744bca8f23f5c8ca56ab6ca9c1'

        @client = Twilio::REST::Client.new(@account_sid, @auth_token)
        @client.account.sms.messages.create(:body => 'another signed up. User count => ' + User.all.length.to_s + ' User name => ' + user.username,
                                            :to => '+16262322151',
                                            :from => '+18185383872')
        format.json { render :json => current_user }
      else
        format.json { render :json => {'error' => 'yes' }.to_json}
      end
    end

  end
end
