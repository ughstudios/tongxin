Devise.setup do |config|
  require 'devise/orm/active_record'
  config.mailer_sender = 'please-change-me@example.com'
  config.secret_key = 'dummysecretkey'
  config.parent_controller = 'ApplicationController'
  config.authentication_keys = [:login]
end
