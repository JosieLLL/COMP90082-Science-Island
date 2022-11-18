package database

import (
	"SC-Redback/src/backend/utils"

	"github.com/go-redis/redis"
)

var RedisDB *redis.Client

func ConnectRedis() {
	RedisDB = redis.NewClient(&redis.Options{
		Addr:     utils.RedisHost + ":6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

}

func testRedisConnection() bool {
	return RedisDB != nil && RedisDB.Ping() != nil && RedisDB.Ping().Err() == nil
}

func CheckAndGetRedis() *redis.Client {
	if !testRedisConnection() {
		ConnectRedis()
	}

	return RedisDB
}
