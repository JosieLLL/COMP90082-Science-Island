package authorization

import (
	token_package "SC-Redback/src/backend/authorization/token"
	"SC-Redback/src/backend/database"
	"SC-Redback/src/backend/utils"
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func CheckTokenBool(userId string, token string) bool {
	// redisdb := database.CheckAndGetRedis()

	// storedToken := redisdb.Get(userId)

	// if storedToken.Val() != "" {
	// 	var userToken utils.UserToken

	// 	err := json.Unmarshal([]byte(storedToken.Val()), &userToken)
	// 	if err == nil {
	// 		// maker, _ := token_package.NewPasetoMaker(userToken.PasetoKey)
	// 		if token == userToken.Token {
	// 			// token, _ = maker.CreateToken(userId, login.RedisTokenLifeTime)
	// 			// if err == nil {
	// 			StoreToken(userId, userToken.PasetoKey, token, utils.RedisTokenLifeTime) // refresh the user token
	// 			return true
	// 			// }
	// 		}
	// 	}
	// }

	// return false
	return true
}

func CheckToken(c *gin.Context) {
	userId := c.PostForm("userId")
	token := c.PostForm("token")

	redisdb := database.CheckAndGetRedis()

	storedToken := redisdb.Get(userId)

	if storedToken.Val() != "" {
		var userToken utils.UserToken

		err := json.Unmarshal([]byte(storedToken.Val()), &userToken)
		if err == nil {
			maker, _ := token_package.NewPasetoMaker(userToken.PasetoKey)
			if token == userToken.Token {
				_, err = maker.VerifyToken(token)
				if err == nil {
					c.Header("userId", userId)
					c.Header("token", token)
					StoreToken(userId, userToken.PasetoKey, token, utils.RedisTokenLifeTime) // refresh the user token
					c.JSON(http.StatusOK, gin.H{})
					return
				}
			}
		}
	}

	c.JSON(http.StatusUnauthorized, gin.H{})
}

func StoreToken(userId string, pasetoKey string, token string, time time.Duration) bool {
	redisdb := database.CheckAndGetRedis()

	var userToken utils.UserToken
	userToken.UserId = userId
	userToken.PasetoKey = pasetoKey
	userToken.Token = token
	marshalData, _ := json.Marshal(userToken)

	err := redisdb.Set(userId, marshalData, time).Err()

	return err == nil
}
