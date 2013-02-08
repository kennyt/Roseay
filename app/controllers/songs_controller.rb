class SongsController < ApplicationController
  def index
    @songs = Song.all.sort {|x, y| x.true_value <=> y.true_value }
  end
end
