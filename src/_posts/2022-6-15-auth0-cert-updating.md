---
date: 2022-06-15 22:55:00
title: "Encrypting a SAML Assertion using Auth0 as the IdP"
description: "When working with third-party SSO partners and using Auth0 as an IdP, it can be intimidating to implement encryption if you're not familiar with the established patterns. Here's a complete ground-up guide that I've used in my work."
tags:
  - dev tools
---


Auth0 has pretty [good docs on this process](https://auth0.com/docs/protocols/saml/saml-configuration/special-configuration-scenarios/signing-and-encrypting-saml-requests#send-encrypted-saml-authentication-assertions), but there are some formatting tricks that you may not be familiar with if you don't normally deal with openssl, SAML metadata, and other specifics.

## 1. Get the cert and/or public key from the Service Provider (SP)

Ideally these will come as .pem or .crt text files pre-formatted for you, however, we've seen providers simply hand over SAML metadata with only the encryption cert provided.

In that case, you'll need to find the encryption cert within the provided metadata. Often it's nested in a XML element like `<ds:X509Certificate>`.


Note that sometimes you will get a .pem file that includes multiple certificates in a chain. As long as these certs are in the [correct order](https://serverfault.com/questions/476576/how-to-combine-various-certificates-into-single-pem), you should be ok to use the .pem file as-is.

## 2. Format the cert correctly (if necessary)

A certificate should look like this:

```
-----BEGIN CERTIFICATE-----
MIIC9ECCAd2aAwIBAgLJAdDlNJbJwi9NMA0GCSqGSIb3DQEBCwUAMBgxFjAUBgNV
...[many other lines]
-----END CERTIFICATE-----
```

If you weren't provided a cert formatted this way or had to pull the cert out of a client's metadata, you can manually add in those headers/footers OR you can use [this handy formatter](https://www.samltool.com/format_x509cert.php) from the gracious folks at [OneLogin](https://www.onelogin.com/), a popular Auth0 competitor. Just paste in the cert from the metadata and save the output provided in the "X.509 cert with header" box.

Otherwise if you have a certificate in this format, skip this step.

## 3. Generate the public key from the cert (if necessary)

If you don't have the public key, you can use openssl on your command line to generate it from the certificate:

`openssl x509 -in certificate.pem -pubkey -noout > public_key.pem`

That example assumes your correctly formatted certificate is saved as `certificate.pem`, and outputs the `public_key.pem` file in the correct formatting.

Note that this command may need some modification depending on your version of openssl/OS...it has worked well for me on MacOS for several years.

## 4. JSON encode the public key and cert

Both the certs will need to be formatted in JSON-friendly strings to insert to your Auth0 rule like this:

```
"-----BEGIN PUBLIC KEY-----\nnMIIC8jCCBdqgAwIBAgIJObB6jmhG0QOEMA0GCSqGSIb3DQEEBQUAMCAxHjAcBgNV\n[..all the other lines..]-----END PUBLIC KEY-----\n";
```

Note the `\n` newline characters throughout. To convert your existing cert/key text to that format, paste them in to [this JSON Escape tool](https://jsonformatter.org/json-escape)

## 5. Add them to your Auth0 Rule

Finally, go to the Auth0 rule you want to use for this text and add the keys as indicated in the Auth0 docs:

```js
function (user, context, callback) {
  // this rule sets a specific public key to encrypt the SAML assertion generated from Auth0
  if (context.clientID === 'THE_CLIENT_ID_OF_THE_APP_WITH_THE_SAML_APP_ADDON') {
	  context.samlConfiguration = (context.samlConfiguration || {});
    context.samlConfiguration.encryptionPublicKey = "-----BEGIN PUBLIC KEY-----\nnMIIC8jCCBdqgAwIBAgIJObB6jmhG0QOEMA0GCSqGSIb3DQEEBQUAMCAxHjAcBgNV\n[..all the other lines..]-----END PUBLIC KEY-----\n";
    context.samlConfiguration.encryptionCert = "-----BEGIN CERTIFICATE-----\nnnMIIC8jCCBdqgAwIBAgIJObB6jmhG0QOEMA0GCSqGSIb3DQEEBQUAMCAxHjAcBgNV\n[..all the other lines..]-----END CERTIFICATE-----\n";
	}
  callback(null, user, context);
}
```
