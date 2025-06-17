class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def google_oauth2
    handle_auth "Google"
  end

  def wechat
    handle_auth "WeChat"
  end

  def failure
    redirect_to root_path
  end

  private

  def handle_auth(kind)
    @user = User.from_omniauth(request.env['omniauth.auth'])
    if @user.persisted?
      sign_in_and_redirect @user, event: :authentication
    else
      session['devise.auth_data'] = request.env['omniauth.auth']
      redirect_to new_user_registration_url, alert: "#{kind} authentication failed"
    end
  end
end
