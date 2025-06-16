class LlmPostRecommender
  def initialize(user, llm: LocalLlmClient.new)
    @user = user
    @llm = llm
  end

  def interested?(post)
    meta = @user.preferences || {}
    if @llm.respond_to?(:complete)
      prompt = <<~TEXT
        The following JSON describes a user's interests:
        #{meta.to_json}
        Based on these interests, would the user be interested in the post titled "#{post.title}" with body:
        #{post.body}
        Respond with "Yes" or "No".
      TEXT
      response = @llm.complete(prompt, tokens: 8)
      response.to_s.downcase.include?('yes')
    else
      keywords = Array(meta['keywords']).map(&:downcase)
      text = "#{post.title} #{post.body}".downcase
      keywords.any? { |kw| text.include?(kw) }
    end
  rescue StandardError => e
    Rails.logger.error("LLM recommendation failed: #{e.message}")
    false
  end
end
