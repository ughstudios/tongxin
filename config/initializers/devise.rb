Devise.setup do |config|
  require 'devise/orm/active_record'
  config.mailer_sender = 'please-change-me@example.com'
  config.secret_key = 'dummysecretkey'
  config.parent_controller = 'ApplicationController'
  config.authentication_keys = [:login]
  config.omniauth :google_oauth2, ENV['GOOGLE_CLIENT_ID'], ENV['GOOGLE_CLIENT_SECRET']
  config.omniauth :wechat, ENV['WECHAT_APP_ID'], ENV['WECHAT_APP_SECRET']
end
