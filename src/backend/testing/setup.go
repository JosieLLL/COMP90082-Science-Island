package testing

import (
	"SC-Redback/src/backend/database"
	"SC-Redback/src/backend/utils"
	"database/sql"
	"os"

	"github.com/go-redis/redis"

	"github.com/stretchr/testify/assert"

	"testing"
)

func SetupMySQL(t *testing.T) *sql.DB {
	_, success := os.LookupEnv("DB_USERNAME")
	assert.True(t, success)

	_, success = os.LookupEnv("DB_PASSWORD")
	assert.True(t, success)

	_, success = os.LookupEnv("DB_NAME")
	assert.True(t, success)

	_, success = os.LookupEnv("DB_PORT")
	assert.True(t, success)

	_, success = os.LookupEnv("DB_HOST")
	assert.True(t, success)

	_, success = os.LookupEnv("NOT_EXIST_VARIABLE")
	assert.False(t, success)

	var mySQLDb *sql.DB
	t.Run("MySQL connection", func(t *testing.T) {
		mySQLDb = database.CheckAndGetMYSQL()
		assert.NotNil(t, mySQLDb)
	})

	return mySQLDb
}

func SetupRedis(t *testing.T) *redis.Client {
	_, success := os.LookupEnv("REDIS_HOST")
	assert.True(t, success)

	_, success = os.LookupEnv("REDIS_TOKEN_MINUTE")
	assert.True(t, success)

	_, success = os.LookupEnv("NOT_EXIST_VARIABLE")
	assert.False(t, success)

	var redis *redis.Client
	t.Run("Redis connection", func(t *testing.T) {
		redis = database.CheckAndGetRedis()
		assert.NotNil(t, redis)
	})

	return redis
}

func SetupEnv(t *testing.T) {
	assert.NoError(t, utils.ReadEnv("../services/service.env"))
}
