class LlmPostRecommender
  def initialize(user, llm: LocalLlmClient.new)
    @user = user
    @llm = llm
  end

  def interested?(post)
    meta = @user.preferences.to_json
    prompt = <<~TEXT
      The following JSON describes a user's interests:
      #{meta}
      Based on these interests, would the user be interested in the post titled "#{post.title}" with body:
      #{post.body}
      Respond with "Yes" or "No".
    TEXT
    response = @llm.complete(prompt, tokens: 8)
    response.downcase.include?('yes')
  rescue StandardError => e
    Rails.logger.error("LLM recommendation failed: #{e.message}")
    false
  end
end
