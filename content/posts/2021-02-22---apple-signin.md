---
title: Apple Sign-In and the issue we faced with Expo
date: "2021-02-22T18:00:37.121Z"
template: "post"
draft: false
slug: "general-blogs"
category: "General"
tags:
	- "Apple Signin"
description: "Now, Apple has mandated to provide Apple Sign-In as an equivalent option if your app is providing other social logins(FB, Gmail Twitter, etc) as well. In this guide I tried to simplify the entire process and how we resolved an issue we faced while using Expo for Apple Signin"
---

In one of the projects, we submitted an app to AppStore for review and it was rejected due to the below-mentioned reason.

**_We noticed that your app uses a third-party login service but does not offer Sign in with Apple._**

Apple has updated their guidelines which says Apps that exclusively use a third-party or social login service (such as Facebook Login, Google Sign-In, Sign in with Twitter, Sign In with LinkedIn, log in with Amazon, or WeChat Login) to set up or authenticate the user’s primary account with the app must also offer Sign in with Apple as an equivalent option.

Like other social login services, Apple too follows the same approach to authenticate the users like redirecting the users to the apple sign-in followed by API server validations.

##Overview

![alt](/apple-sign.jpg)

After your app receives the user information, you can verify their associated identity token with the server to confirm that the token is not expired and ensure it has not been tampered with or replayed to your app.

Start by securely transmitting the identity token, authorization code, and userId to your API server and perform the below-mentioned validations:-

```javascript
 {
  "authorizationCode": "c8adca8fb9eee455bbffae2314475dc15.0.rrruv.PFSuTcpvUNsetRanLgbp-w",
  "identityToken": "eyJraWQiOiJlWGF1bm1MIiwiYWxnIjoiUlMyNTYifQ.
                   eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiaG9zdC5leHAuRXhwb25lb
                   nQiLCJleHAiOjE2MTM2NzE2MTEsImlhdCI6MTYxMzU4NTIxMSwic3ViIjoiMDAxMTQ1LjQ0MmMyNGU1NjQx
                   NzQ4OTY4NmUxYWIyZjAwNTAzMjg4LjA2MjciLCJjX2hhc2giOiJWeU05eFg2SWNxTWVhdFZIbG90QTNRIiwi
                   ZW1haWwiOiJ24fifWpheUB3ZWJvbmlzZWxhYi5jb20iLCJlbWFpbF92ZXJpZmllZCI6InRydWUiLCJhdXRoX
                   3RpbWUiOjE2MTM1ODUyMTEsIm5vbmNlX3N1cHBvcnRlZCI6dHJ1ZX0.ng7VcCSBdc1clxYzcnFBiqnuC1
                   9eHuOAUnEvRKRYNnYpqKXXwWxErteN6l1yPJOBqIz4eYWRer7ufkDhUpkPA45y6QUpGb25rFGREDidPefidcW5
                   B23XNGwufCaCx2n49GUZFGsN4sJmrGx7aPhUHeFKmzT3K_gJUy3OOLnAeB3Enu-BKtvFQ0kAdl_hQQB9UpNbdq
                   D-qKEvfFS4oGemKCjW2SV0z4cdk_q4sUKIyr0i3zpz8DeErjbd2lsNY2-6RiG6CHCPEQonQA-AJcPQ2cpFf
                   18x9ZfSsYXI3zWRK_YTiz0QwAxKM7MhWdXVnAdi05u98D6qaAfN0FjVOYoREA",
  "user": "001122.442c24e56417489686e1a3742f00503288.0327",
}
```

##Validate authorization code

An authorization grant code that gets delivered to your API server, can be validated using this API

```javascript
POST https://appleid.apple.com/auth/token
```

When you send an authorization request to the validation server, include the following form data parameters:

```javascript
client_id: com.example.com; // AppId from Apple developers account

// Need to generate it (Link in reference)

client_secret: code: "Authorization code received from App";

grant_type: "authorization_code";
```

The validation server returns status as 200 for a successful validation request or 400 for failed request.

##Verify an Identity

Once the authorization code is validated, we need to verify the identity token(JWT) as well. Now in order to do that we need Apple's public key to verify the signature.

To get the public key first we need to fetch JWKs (JSON Web Key). You can get the JWK keys from the following endpoint:

```javascript
GET https://appleid.apple.com/auth/keys

The response would look like this:

{
  "keys": [
    {
      "kty": "RSA",
      "kid": "YuyXoY",
      "use": "sig",
      "alg": "RS256",
    },
    {
      "kty": "RSA",
      "kid": "86D88Kf",
      "use": "sig",
      "alg": "RS256",
    },
    {
      "kty": "RSA",
      "kid": "eXaunmL",
      "use": "sig",
      "alg": "RS256",
    }
  ]
}
```

Now, it has 3 keys, then how to select the right key from the set. So, If you decode the Identity JWT token that you got (put it in https://jwt.io/), in the header you will see something like this:

```javascript
{
  "kid": "eXaunmL",
  "alg": "RS256"
}
```

so, The "kid" (key ID) Header Parameter is a hint indicating which key we need to use to verify the signature of an identity token. In our case, we should be using the 3rd one.

Also note that we do not need to decode the JWT and handpick the key from the keys set, instead there are already built libraries in all the languages which do all these things for you.

for example, in NodeJS it would look like:-

```javascript
var request = require("request");
var jwtDecoder = require("jsonwebtoken");
var jwksClient = require("jwks-rsa");

var token = "recieved identity token";
var userId = "received user id";

request(options, function(error, response) {
	if (error) throw new Error(error);
	console.log(response.body);

	var client = jwksClient({
		jwksUri: "https://appleid.apple.com/auth/keys"
	});

	function getKey(header, callback) {
		client.getSigningKey(header.kid, function(err, key) {
			var signingKey = key.publicKey || key.rsaPublicKey;
			callback(null, signingKey);
		});
	}

	jwtDecoder.verify(token, getKey, { algorithms: ["RS256"] }, function(
		err,
		decoded
	) {
		const isValid =
			decoded.user === userId &&
			decoded.iss === "https://appleid.apple.com" &&
			decoded.aud === "com.test.app" &&
			decoded.exp >= Date.now();
	});
});
```

We just need to specify the apple JWKs endpoint and algorithm and the library will take care of all the stuff, it does the following things under the hood:-

- Find kid from the jwt header.
- Find the correct JWK from the Apple keys set.
- Fetch the public key based on the selected JWK.
- Verify and decode the JWT token.

Now once we have verified and decoded the JWT token, we need to check

- iss field contains https://appleid.apple.com
- aud field is the developer’s client_id
- The current time is earlier than the expired value of the token

##The issue with the Expo Apple Sign-In

In order to implement Apple Sign-In in Expo, we used expo-apple-authentication package, followed the Expo docs, and set up what was needed in Apple Developer account and when we're trying to sign in (with Apple), we were getting the expected credential (authorizationCode, name, email, identityToken, etc.). We were sending the code and identity token to our api server and according to the doc we were calling the auth endpoint `/auth/token` to validate the auth code but it was failling and returning `400 (“invalid_grant”)` back from Apple.

It really blocked us and Expo docs are not clear enough to help us debugged this issue, so it took us a day to finally debugged this issue, what we did was, tried decoding the identity (JWT) token (put it in https://jwt.io/) and found that the `aud` was being sent as `host.exp.Exponent` as opposed to that of com.test.app. So, due to the `aud` mismatch, Apple wasn't able to identify the auth code and was returning `400 (“invalid_grant”)`.

```javascript
{
  "iss": "https://appleid.apple.com",
  "aud": "host.exp.Exponent",
  "exp": 1613802987,
  "iat": 1613716587,
}
```

So, It definitely doesn’t work in the Expo app but, it works well with the standalone build on TestFlight.

In our case, to get it working on expo we skipped calling an auth endpoint, and also while verifying an identity jwt token we skipped checking an aud field.

###References

To generate the client_secret:- https://developer.okta.com/blog/2019/06/04/what-the-heck-is-sign-in-with-apple#create-a-private-key-for-client-authentication

vhttps://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens
