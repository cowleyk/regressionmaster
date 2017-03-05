import oauth2
import constants
import constants
import urllib.parse

# consumer = object which represents our app uniquely
consumer = oauth2.Consumer(constants.CONSUMER_KEY, constants.CONSUMER_SECRET)


def get_request_token():
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
    return dict(urllib.parse.parse_qsl(content.decode('utf-8')))

def get_oauth_verifier(request_token):
    # go to site and authorize our app
    print('go to teh following address in your browser')
    # links our app to the twitter user
    # dictionaries must be accessed w/ ['']
    print(get_oauth_verifier_url(request_token))

    oauth_verifier = input('What is the PIN? ')
    # 9644161 (from url printed above)

def get_oauth_verifier_url(request_token):
    return '{}?oauth_token={}'.format(constants.AUTHORIZATION_URL, request_token['oauth_token'])

def get_access_token(request_token, oauth_verifier):
    # .Token() object is just combined object w/ token,token_secret AND verifier pin
    token = oauth2.Token(request_token['oauth_token'], request_token['oauth_token_secret'])
    token.set_verifier(oauth_verifier)

    # creates client a req token w/ associated user (new and verified token)
    client = oauth2.Client(consumer, token)

    # ask twitter for specific client access token, should work w/ verified request token
    response, content = client.request(constants.ACCESS_TOKEN_URL, 'POST')
    return dict(urllib.parse.parse_qsl(content.decode('utf-8')))

