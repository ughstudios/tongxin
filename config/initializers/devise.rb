Devise.setup do |config|
  config.mailer_sender = 'please-change-me@example.com'
  config.secret_key = 'dummysecretkey'
  config.parent_controller = 'ApplicationController'
end
