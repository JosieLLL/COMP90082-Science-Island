# Database Package

Database folder contains connectors for MySQL and Redis database, functionalities for crawling curriculum data from The Australian Curriculum API and updating curriculum data in MYSQL database.

## Folder Structure

```txt
└── getCurriculumData.go
└── mysqlConnector.go
└── redisConnector.go
└── tableSQL.txt
...
```

### `getCurriculumData.go`

Crawling the JSON file from The Australian Curriculum API.

Parsing each file, storing the data and the relationship into MySQL database.

### `mysqlConnector.go`

Functionalities for checking database connection and connecting to the MySQL database.

### `redisConnector.go`

Functionalities for checking database connection and connecting to the Redis database.

### `tableSQL.txt`

SQL for creating all tables in MySQL database.

## Notes

All services need to check the connection before accessing the database, reconnect if disconnected.