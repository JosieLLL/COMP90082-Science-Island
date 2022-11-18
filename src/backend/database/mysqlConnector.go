package database

import (
	"SC-Redback/src/backend/utils"
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

var MySQLDB *sql.DB

func ConnectMySQL() {
	MySQLDB, _ = sql.Open("mysql", utils.GetDSN())
	fmt.Println(utils.GetDSN())
	// // https://github.com/Go-SQL-Driver/MySQL/#important-settings
	// DB.SetMaxOpenConns(150)
	// DB.SetMaxIdleConns(150)
	// DB.SetConnMaxIdleTime(100 * time.Millisecond)
	// DB.SetConnMaxLifetime(100 * time.Millisecond)
}

func testMySQLConnection() bool {
	return MySQLDB != nil && MySQLDB.Ping() == nil
}

func CheckAndGetMYSQL() *sql.DB {
	if !testMySQLConnection() {
		ConnectMySQL()
	}

	return MySQLDB
}
