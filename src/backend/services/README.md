# Services Package

Services folder provides the APIs for frontend to access data.

## Folder Structure

```txt
├── service.env
├── main.go
└── Service_1
    └── router.go
    └── handler.go
└── Service_2
    └── router.go
    └── handler.go
...
```

All Services contain two files :

> `router.go`

The API routes of this service.

> `handler.go`

The handler for each API to handle the request from the front-end.

Access the database and perform querying, inserting, updating, and authorization.

Construct reply for API response.

## Service Details

### `activityFile`

Responsible for uploading file, downloading file, and attaching file to the activity.

All uploading files will be provided with a new name to avoid overwriting if new file have duplicate name with other existing file in server.

If the file was uploaded but not attached to the activity, it will be identified as trash file. Server needs to clean up those trash files and trash records in MySQL database periodly (To be developed in future).

Front-end upload files firstly, collect all fileId and attach them to activity after sending submit request.

### `activityPool`

Responsible for displaying activity pool, filtering the activity, and displaying activity detail.

Construct SQL to filter activity, return activities that match the filter requirements.

Construct SQL to join different tables and get names for front-end displaying.

### `authorization`

Responsible for storing token in the Redis database abd checking if token is valid.

If server validate token successfully, it will refresh token valid time in Redis database.

### `curriculum`

Responsible for filtering curriculum from database and returning curriculum information to front-end.

Construct SQL to filter curriculum, return curriculums that match the filter requirements (Filter by Code and YearLevel).

### `login`

Responsible for login function.

Check if user identification is valid, grant token for valid user, and store token for future validation.

### `register`

Responsible for account register function.

Check if new account is already exist in system.

Add new account into system, grant token for new account, and store token for future validation.

## Developing Notes
Querying use `Query(query)`

Inserting, updating or deleteing use `Exec(query)`