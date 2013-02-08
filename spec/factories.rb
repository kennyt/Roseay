FactoryGirl.define do
  factory :user do
    sequence(:username) {|n| "User#{n}"}
    password "123456"
    password_confirmation "123456"
  end

  factory :song do
    sequence(:song_artist) {|n| "artist#{n}"}
    sequence(:song_name) {|n| "name#{n}"}
    sequence(:song_link) {|n| "www.google.com"}
    user_id 1
  end

  factory :like do
    sequence(:user_id) {|n| n}
    sequence(:song_id) {|n| n}
  end
end