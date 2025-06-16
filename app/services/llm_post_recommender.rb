class LlmPostRecommender
  def initialize(user, llm: LocalLlmClient.new)
    @user = user
    @llm = llm
  end

  def interested?(post)
    prefs = @user.preferences
    prompt = <<~TEXT
      The following JSON describes a user's interests:
      #{prefs.to_json}
      Based on these interests, would the user be interested in the post titled "#{post.title}" with body:
      #{post.body}
      Respond with "Yes" or "No".
    TEXT
    if @llm
      response = @llm.complete(prompt, tokens: 8)
      return true if response.downcase.include?('yes')
    end
    keyword_fallback(prefs, post)
  rescue StandardError => e
    Rails.logger.error("LLM recommendation failed: #{e.message}")
    keyword_fallback(prefs, post)
  end

  private

  def keyword_fallback(prefs, post)
    keywords = Array(prefs['keywords'] || prefs['interests'] || prefs['topics'])
    content = "#{post.title} #{post.body}".downcase
    keywords.any? { |kw| content.include?(kw.downcase) }
  end
end
