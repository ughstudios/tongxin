# frozen_string_literal: true

Rails.application.configure do
  config.eager_load = false
  # Allow assets like application.js to be served without precompiling
  config.assets.compile = true
end
