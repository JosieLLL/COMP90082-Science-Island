package utils

import (
	"os"
	"strconv"
	"time"

	"github.com/google/uuid"
)

const envFile = "service.env"
const httpPort = "8088"
const dBUserNameKey = "DB_USERNAME"
const dbPasswordKey = "DB_PASSWORD"
const dbNameKey = "DB_NAME"
const dbPortKey = "DB_PORT"
const dbHostKey = "DB_HOST"
const redisHostKey = "REDIS_HOST"
const redisTokenMinuteKey = "REDIS_TOKEN_MINUTE"
const filePathKey = "FILE_PATH"
const curriculumPathKey = "CURRICULUM_PATH"

var RedisHost string
var RedisTokenLifeTime time.Duration
var FilePath string
var CurriculumPath string

func GetEnvFile() string {
	return envFile
}

func GetPort() string {
	port, envPort := os.LookupEnv("BACKEND_PORT")
	if envPort {
		return ":" + port
	} else {
		return ":" + httpPort
	}
}

func NewUUID() string {
	return uuid.New().String()
}

func getDbCredentials() bool {
	var exist bool
	Connection.username, exist = os.LookupEnv(dBUserNameKey)
	if !exist {
		return false
	}

	Connection.password, exist = os.LookupEnv(dbPasswordKey)
	if !exist {
		return false
	}

	Connection.dbName, exist = os.LookupEnv(dbNameKey)
	if !exist {
		return false
	}

	Connection.port, exist = os.LookupEnv(dbPortKey)
	if !exist {
		return false
	}

	Connection.host, exist = os.LookupEnv(dbHostKey)
	if !exist {
		return false
	}

	return true
}

func getRedisValidTime() {
	redisTokenMinute, success := os.LookupEnv(redisTokenMinuteKey)
	if success {
		tokenMinute, err := strconv.Atoi(redisTokenMinute)
		if err != nil {
			RedisTokenLifeTime = 10 * time.Minute
		} else {
			RedisTokenLifeTime = time.Duration(tokenMinute) * time.Minute
		}
	} else {
		RedisTokenLifeTime = 10 * time.Minute
	}
}

func getRedisHost() {
	var exist bool
	RedisHost, exist = os.LookupEnv(redisHostKey)
	if !exist {
		RedisHost = "localhost"
	}
}

func getFilePath() {
	var exist bool
	FilePath, exist = os.LookupEnv(filePathKey)
	if !exist {
		FilePath = "./uploadFile/"
	}
}

func getCurriculumPath() {
	var exist bool
	CurriculumPath, exist = os.LookupEnv(curriculumPathKey)
	if !exist {
		CurriculumPath = "./CurriculumData"
	}
}

func InitVariables() {
	getDbCredentials()
	getRedisValidTime()
	getRedisHost()
	getFilePath()
	getCurriculumPath()
}
