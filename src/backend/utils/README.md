# Utils Package

Utils folder contains all general useful functions that provide support for services.

## Folder Structure

```txt
├── account.go
├── apiReply.go
├── constants.go
├── database.go
├── envReader.go
└── routers.go
...
```

## Util Details

Details of some important util files are shown below.

### `apiReply.go`

All reply formats are stored in this file. The `Reply` is the top-level return format.

```go
type Reply struct {
	Code int
	Msg  string
	Data interface{}
}
```

Code is the status code of this request.

Msg is the error information or successful message.

Data is the response data for this request.

### `constants.go`

Key names in environment file and some constants on which the service depends.

### `database.go`

Contains all tables in the MySQL database and connection authorization information.

### `envReader.go`

Read configuration constants into `os` environment.

### `routers.go`

Functions for constructing routers and initializing the go-gin engine.
