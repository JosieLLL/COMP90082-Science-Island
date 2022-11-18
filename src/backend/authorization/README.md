# Authorization Package

Authorization folder provides functionalities for creating and validating the PASETO token. We are using PASETO local v2 tokens, which utilize symmetric-key encryption and is consistent with the Science Island Teacher Protal.

## Folder Structure

```txt
└── token
    └── maker.go
    └── paseto_maker.go
    └── payload.go
...
```

### `maker.go`

Interfaces for creating and validating token

### `paseto_maker.go`

Functionalities for creating and validating PASETO token

### `payload.go`

The information contained in the PASETO token.

```go
type Payload struct {
	Userid    string    `json:"userid"`
	IssuedAt  time.Time `json:"issued_at"`
	ExpiredAt time.Time `json:"expired_at"`
}
```

## Authorization Process

### Create and Grant Token

If user register or login successfully, a new token will be created with a random key, and granted to the user through response header.

The UserID and the token will be stored in the Redis database for future validating.

Default token valid time is 10 minutes, it can be changed in `services/local.env`. This valid time also apply to Redis database, which means that token will be deleted if it is expired.

### Validate Token

All requests should contain userid and token in the request header except `register` and `login` API.

Server will find token in the Redis database with the userid, and check if two tokens are the same.

If request fails to contain token, token not exist in Redis database, or two tokens are different, server will respond with HTTP status codes `400` (Unauthorization).

If server validate token successfully, original token and userid will be granted to the user through response header again.

### Refresh Token

If server validate token successfully, it will refresh token valid time in Redis database.

## Problem

There are still some problems need to be fixed in future developing.

### Replay Attack

If attacker intercept the token and userid, they can access the system until the real user login again and get new token.

### Valid Process Not Used

We want to refresh token time but keep the old token. But the valid time in the payload of the old token can't be changed because new payload will create new token. So, the valid process is useless because the token will be invalid even we refresh the token time in the Redis database.

We also consider to create new token for each request, but if attacker intercept one token and send request prior to real user, real user will fail to send following requests, which is unacceptable.

As a result, we only refresh the valid time in the Redis database, deprecate the valid process in PASETO authorization and check if the token in Redis database and the token from user request are the same.
