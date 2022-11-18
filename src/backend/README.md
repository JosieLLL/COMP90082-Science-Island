# Backend

The server provides a REST API for the client. The server is written in Go and uses the [Gin Web Framework](https://gin-gonic.com/). For more, please see the [Architecture page on Confluence](https://scienceislandplatform.atlassian.net/wiki/spaces/SWEN900132021SI/pages/54116944/Architecture).

## Prerequisites

- [Go](https://go.dev/learn/)
- [MySQL](https://www.w3schools.com/mySQl/default.asp)
- [Redis](https://redis.io/docs/getting-started/)

## Folder Structure

| File/Folder         | Description                                                                               |
| ------------------- | ----------------------------------------------------------------------------------------- |
| ├── `authorization` | PASETO authentication                                                                     |
| ├── `database`      | Database connection handler for MySQL and Redis                                           |
| ├── `services`      | Contains each of the services that make up the server.      |
| ├── `testing`       | Functions for the testing of the components of the system.                                 |
| ├── `utils`         | Generic functionality and database constants for services.                                |
| ├── `vendor`        | Contains third-party dependency libraries. See [`vendor/`](#vendor).                                |

## Local Development

### Prerequisites

Setting up MYSQL and Redis database and modify configurations in `services/local.env`. 

<!-- 
### `authorization/`

The `authorization/` folder is about creating payload, creating token and verifying token. 

### `database/`

The `database/` folder is about crawling data, connecting to mysql and connecting to redis.  -->

### `services/`

The `services/` folder contains services that make up the server. Each service has the following folder structure:

```txt
.
├── handler.go
├── router.go
```

These services are about activity pool, authorization, login, new acticity and register functions.

<!-- ### `testing/`

The `testing/` folder contains test cases of invalid token and illegal length key.

### `utils/`

The `utils/` folder contains all realizations about generating hash password, api replying, parsing data and parsing env. -->

### `vendor/`

`vendor/` contains critical dependencies. This ensures the correct version of each dependency is used.

To add a new dependency, or to download all the dependencies, run:

```shell
go mod tidy
go mod vendor
```

For more, see the documentation for `go mod`: <https://golang.org/ref/mod#go-mod-vendor>