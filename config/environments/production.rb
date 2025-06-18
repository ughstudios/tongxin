# frozen_string_literal: true

Rails.application.configure do
  config.eager_load = true
  # Disable asset fingerprinting so static HTML can reference
  # non-digested filenames like /assets/application.js in production.
  config.assets.digest = false

  # Allow on-the-fly compilation if precompiled assets are missing.
  config.assets.compile = true
end
