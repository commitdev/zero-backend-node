var serverless = require("serverless-http");
var express = require('express');
const { auth } = require('express-openid-connect');


// OIDC settings
const issuerBaseURL = process.env.ISSUER_BASE_URL;
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
// Redirect URL settings
const authorizerEndpoint = process.env.AUTH_ENDPOINT;
const frontendURL = process.env.FRONTEND_URL;
const authScope = process.env.AUTH_SCOPE || 'openid profile email';
// Cookie settings
const cookieDomain = process.env.COOKIE_DOMAIN;
const cookieAllowInsecure = process.env.ALLOW_INSECURE_COOKIES === "true";
const cookieSigningSecret = process.env.COOKIE_SIGNING_SECRET;
const jwtCookieKey = process.env.JWT_COOKIE_KEY;

const app = express();

// For development you may need to run this function locally
const lambdaRuntime = process.env.NODE_ENV === 'development' ? false : true;
// If request is from Authorize request must use context.succeed instead of res.json()
// this is for API gateway to parse versus it going to the end user
const isAuthorizerRequest = (req) => lambdaRuntime && (req.apiGateway.event.type === 'REQUEST');

const cookieParamsOverride = cookieAllowInsecure ? { secure: false, sameSite: 'Lax' } : {};

// By Default, this OIDC Authorizer sets an encrypted JWE, you can use this when migration to EKS
// to also set a JWT token on client cookie for JWT authorizer middleware, defaults to undefined
const afterCallback = jwtCookieKey ? (req, res, session) => {
  res.cookie(jwtCookieKey, session.id_token, {
    domain: cookieDomain,
    path: "/",
    ...cookieParamsOverride,
  });
  return session
} : undefined;

if (!lambdaRuntime) {
  const cors = require("cors");
  app.use(cors({
    origin: frontendURL,
    credentials: true,
  }));
}

app.use((req, res, next) => {
  auth({
    issuerBaseURL: issuerBaseURL,
    baseURL: authorizerEndpoint,
    routes: {
      postLogoutRedirect: frontendURL,
    },
    afterCallback,
    session: {
      cookie: {
        domain: cookieDomain,
        path: "/",
        ...cookieParamsOverride,
      },
    },
    getLoginState(req, options) {
      if (req.originalUrl === "/login") {
        return {
          returnTo: frontendURL || options.returnTo || req.originalUrl,
        };
      } else if (!req.oidc.isAuthenticated()) {
        const response = {
          isAuthorized: false,
          context: {
            loginUrl: `${authorizerEndpoint}/login`,
          },
        };

        if (isAuthorizerRequest(req)) {
          res.simpleResponse = response;
        }
        res.status(401).json(response);
        return {};
      }
    },
    clientID,
    clientSecret,
    secret: cookieSigningSecret,
    idpLogout: true,
    authorizationParams: {
      response_type: 'code',
      scope: authScope,
    }
  })(req, res, next);
});

app.use('/*', (req, res) => {
  const response = {
    isAuthorized: true,
    context: { ...req.oidc.user }
  };
  if (isAuthorizerRequest(req)) {
    res.simpleResponse = response;
  }
  res.json(response);
});

app.use((err, req, res) => {
  console.error(req.originalUrl, err);
});

// In lambda runtime it exports the lambdaHandler instead of http server listening
if (!lambdaRuntime) {
  const port = process.env.SERVER_PORT || 80;
  app.listen(port, () => {
    console.log(`Authorizer listening at http://localhost:${port}`);
  });
}

module.exports.lambdaHandler = serverless(app, {
  response(response, event, context) {
    if (response.simpleResponse) {
      return context.succeed({ ...response.simpleResponse })
    }
  }
});
