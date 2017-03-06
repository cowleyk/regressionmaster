from flask import Flask, render_template, session, redirect, request
from twitter_utils import get_request_token, get_oauth_verifier_url, get_access_token
from user import User
from database import Database

app = Flask(__name__)
# __name__ = '__main__'
    # means we ran app.py file
    # would get same result for running in login.py, user.py, etc
app.secret_key = '1234'

Database.initialize(host='localhost', database='linreg', user='postgres', password='1234')

@app.route('/')
def homepage():
    return render_template('home.html')

@app.route('/login/twitter')
def twitter_login():
    if 'screen_name' in session:
        return session['screen_name']
    request_token = get_request_token()
    # need to store token while user leaves site, save request_token in session cookie (stored on browser)
    session['request_token'] = request_token

    # redirect user to twitter to confirm authorization
    return redirect(get_oauth_verifier_url(request_token))
    # twitter redirects back to us w/ that authorization

@app.route('/logout')
def logout():
    session.clear()
    return render_template('home.html')

@app.route('/auth/twitter')
def twitter_auth():
    oauth_verifier = request.args.get('oauth_verifier')
    access_token = get_access_token(session['request_token'], oauth_verifier)

    user = User.load_from_db_by_screen_name(access_token['screen_name'])
    if not user:
        user = User(access_token['screen_name'], access_token['oauth_token'],
                    access_token['oauth_token_secret'], None)
        user.save_to_db()

    session['screen_name'] = user.screen_name

    return user.screen_name


app.run(port=4995)
# can use app.run(port=4995, debug=True) to enable debugger

# use user.twitter_request(uri, verb) to interact w/ twitter api (ie. send DMs)
