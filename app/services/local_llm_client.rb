class LocalLlmClient
  DEFAULT_MODEL = ENV.fetch('OLLAMA_MODEL', 'gemma3:4b')
  DEFAULT_URL = ENV.fetch('OLLAMA_URL', 'http://localhost:11434')

  def initialize(model: DEFAULT_MODEL, url: DEFAULT_URL)
    require 'ollama'
    @client = Ollama::Client.new(base_url: url)
    @model = model
  rescue LoadError
    raise 'Please add the ollama-ruby gem to use the local LLM.'
  end

  def complete(prompt, tokens: 64)
    @client.generate(model: @model, prompt:, options: { num_predict: tokens }).response.to_s
  end
end
