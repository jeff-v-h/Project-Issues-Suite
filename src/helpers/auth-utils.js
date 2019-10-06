import { CRYPTOBJ, authConstants } from '../shared/config/constants.js';
import vendors from 'vendors';
import { getNameFromD3Email } from './utils';


// OAUTH FUNCTIONS =============================
export const buildAuthUrl = () => {
  // Session Storage - Generate random values for state and nonce
  sessionStorage.authState = guid();
  sessionStorage.authNonce = guid();

  const authParams = {
    response_type: 'id_token token',
    client_id: authConstants.CLIENT_ID,
    redirect_uri: authConstants.REDIRECT_URI,
    scope: authConstants.SCOPES,
    state: sessionStorage.authState,
    nonce: sessionStorage.authNonce,
    response_mode: 'fragment'
  };
  const authUrl = authConstants.AUTH_ENDPOINT + vendors.$.param(authParams);
  return authUrl;
};

export const handleTokenResponse = (hash) => {
  // If this was a silent request remove the iframe
  vendors.$('#auth-iframe').remove();

  // clear tokens
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('idToken');

  const tokenresponse = parseHashParams(hash);

  // Check that state is what we sent in sign in request
  if (tokenresponse.state !== sessionStorage.authState) {
    sessionStorage.removeItem('authState');
    sessionStorage.removeItem('authNonce');
    // Report error
    window.location.hash =
      '#error=Invalid+state&error_description=The+state+in+the+authorization+response+did+not+match+the+expected+value.+Please+try+signing+in+again.';
    return;
  }

  sessionStorage.authState = '';
  sessionStorage.accessToken = tokenresponse.access_token;

  // Get the number of seconds the token is valid for,
  // Subract 5 minutes (300 sec) to account for differences in clock settings
  // Convert to milliseconds
  const expiresin = (parseInt(tokenresponse.expires_in, 10) - 300) * 1000;
  const now = new Date();
  const expireDate = new Date(now.getTime() + expiresin);
  sessionStorage.tokenExpires = expireDate.getTime();

  sessionStorage.idToken = tokenresponse.id_token;

  validateIdToken(function(isValid) {
    if (isValid) {
      window.location.hash = '#';
      return;
    } else {
      clearUserSessionState();
      // Report error
      window.location.hash =
        '#error=Invalid+ID+token&error_description=ID+token+failed+validation,+please+try+signing+in+again.';
      return;
    }
  });
};

export const validateIdToken = (callback) => {
  // Per Azure docs (and OpenID spec), we MUST validate
  // the ID token before using it. However, full validation
  // of the signature currently requires a server-side component
  // to fetch the public signing keys from Azure. This sample will
  // skip that part (technically violating the OpenID spec) and do
  // minimal validation

  if (sessionStorage.idToken == null || sessionStorage.idToken.length <= 0) {
    callback(false);
  }

  // JWT is in three parts seperated by '.'
  const tokenParts = sessionStorage.idToken.split('.');
  if (tokenParts.length !== 3){
    callback(false);
  }

  // Parse the token parts
  // const header = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(tokenParts[0]));
  const payload = vendors.KJUR.jws.JWS.readSafeJSONString(
    vendors.b64utoutf8(tokenParts[1]));

  // Check the nonce
  if (payload.nonce !== sessionStorage.authNonce) {
    sessionStorage.authNonce = '';
    callback(false);
  }

  sessionStorage.authNonce = '';

  // Check the audience
  if (payload.aud !== authConstants.CLIENT_ID) {
    callback(false);
  }

  // Check the issuer
  // Should be https://login.microsoftonline.com/{tenantid}/v2.0
  if (payload.iss !== 'https://login.microsoftonline.com/' + payload.tid + '/v2.0') {
    callback(false);
  }

  // Check the valid dates
  const now = new Date();
  // To allow for slight inconsistencies in system clocks, adjust by 5 minutes
  const notBefore = new Date((payload.nbf - 300) * 1000);
  const expires = new Date((payload.exp + 300) * 1000);
  if (now < notBefore || now > expires) {
    callback(false);
  }

  // Now that we've passed our checks, save the bits of data
  // we need from the token.
  sessionStorage.userSigninName = payload.preferred_username;
  sessionStorage.userDisplayName = getNameFromD3Email(payload.preferred_username);

  // Per the docs at:
  // https://azure.microsoft.com/en-us/documentation/articles/active-directory-v2-protocols-implicit/#send-the-sign-in-request
  // Check if this is a consumer account so we can set domain_hint properly
  sessionStorage.userDomainType =
    payload.tid === '9188040d-6c67-4c5b-b112-36a304b66dad' ?
      'consumers' : 'organizations';

  callback(true);
};

// ?refactor to react
export const makeSilentTokenRequest = (callback) => {
  // Build up a hidden iframe
  const iframe = vendors.$('<iframe/>');
  iframe.attr('id', 'auth-iframe');
  iframe.attr('name', 'auth-iframe');
  iframe.appendTo('body');
  iframe.hide();

  iframe.load(function() {
    callback(sessionStorage.accessToken);
  });

  iframe.attr('src', buildAuthUrl() + '&prompt=none&domain_hint=' +
    sessionStorage.userDomainType + '&login_hint=' +
    sessionStorage.userSigninName);
};

// Checks for presence of access token
export const isAccessToken = () => {
  if (sessionStorage.accessToken != null && sessionStorage.accessToken.length > 0) {
    return true;
  } else {
    return false;
  }
};

// Helper method to validate token and refresh if needed
export const getAccessToken = (callback) => {
  const now = new Date().getTime();
  const isExpired = now > parseInt(sessionStorage.tokenExpires);
  // Do we have a token already?
  if (sessionStorage.accessToken && !isExpired) {
    // Just return what we have
    if (callback) {
      callback(sessionStorage.accessToken);
    }
  } else {
    // Attempt to do a hidden iframe request
    makeSilentTokenRequest(callback);
  }
};

// HELPER FUNCTIONS (to other helper functions) ============================
// Create a guid
export const guid = () => {
  const buf = new Uint16Array(8);
  CRYPTOBJ.getRandomValues(buf);
  function s4(num) {
    let ret = num.toString(16);
    while (ret.length < 4) {
      ret = '0' + ret;
    }
    return ret;
  }
  return s4(buf[0]) + s4(buf[1]) + '-' + s4(buf[2]) + '-' + s4(buf[3]) + '-' +
    s4(buf[4]) + '-' + s4(buf[5]) + s4(buf[6]) + s4(buf[7]);
};

// help parse the has for handling token response
export const parseHashParams = (hash) => {
  const params = hash.slice(1).split('&');

  const paramarray = {};
  params.forEach(function(param) {
    param = param.split('=');
    paramarray[param[0]] = param[1];
  });

  return paramarray;
};

export const decodePlusEscaped = (value) => {
  // decodeURIComponent doesn't handle spaces escaped
  // as '+'
  if (value) {
    return decodeURIComponent(value.replace(/\+/g, ' '));
  } else {
    return '';
  }
};

// sign out and clear session storage
export const clearUserSessionState = () => sessionStorage.clear();
