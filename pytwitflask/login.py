import constants
import oauth2
import urllib.parse
from user import User
from database import Database
from twitter_utils import consumer

Database.initialize(user='postgres', password='1234', host='localhost', database='linreg')

user_email=input('enter your email; ')
user = User.load_from_db_by_email(user_email)
if user:
    # no need to register
    pass
else:
    # have user register

    # client = object which represents logged in user
        # used to perform request for request token to API
    client = oauth2.Client(consumer)

    # post req to twitter to create/get the request token
    # for this post route, no body required
    # content = req token, response = success/fail
    response, content = client.request(constants.REQUEST_TOKEN_URL, 'POST')
    if response.status != 200:
        print('An Error Occured getting request token from twitter')

    # get the request token, content returns qsl, parse it into dictionary
    request_token = dict(urllib.parse.parse_qsl(content.decode('utf-8')))

    # go to site and authorize our app
    print('go to teh following address in your browser')
    # links our app to the twitter user
    # dictionaries must be accessed w/ ['']
    print('{}?oauth_token={}'.format(constants.AUTHORIZATION_URL, request_token['oauth_token']))

    oauth_verifier = input('What is the PIN? ')
    # 9644161 (from url printed above)

    # .Token() object is just combined object w/ token,token_secret AND verifier pin
    token = oauth2.Token(request_token['oauth_token'], request_token['oauth_token_secret'])
    token.set_verifier(oauth_verifier)

    # creates client a req token w/ associated user (new and verified token)
    client = oauth2.Client(consumer, token)

    # ask twitter for specific client access token, should work w/ verified request token
    response, content = client.request(constants.ACCESS_TOKEN_URL, 'POST')
    access_token = dict(urllib.parse.parse_qsl(content.decode('utf-8')))

    first_name = input('Enter your first name ')
    last_name = input('Enter your last name ')

    user = User(user_email, first_name, last_name, access_token['oauth_token'], access_token['oauth_token_secret'], None)
    user.save_to_db()


tweets = user.twitter_request('https://api.twitter.com/1.1/search/tweets.json?q=computers+filter:images')

for tweet in tweets['statuses']:
    print(tweet['text'])

