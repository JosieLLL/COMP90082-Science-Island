package login

import (
	token_package "SC-Redback/src/backend/authorization/token"
	"SC-Redback/src/backend/database"
	"SC-Redback/src/backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func validateLogin(c *gin.Context) {
	email := c.PostForm("email")
	password := c.PostForm("password")

	userId := validateAccount(email, password)

	if userId != "" {
		pasetoKey := utils.RandomString(32)
		maker, _ := token_package.NewPasetoMaker(pasetoKey)
		token, _ := maker.CreateToken(userId, utils.RedisTokenLifeTime)

		// authorization.StoreToken(userId, pasetoKey, token, utils.RedisTokenLifeTime)

		c.Header("userId", userId)
		c.Header("token", token)
		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", nil))
	} else {
		c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Email or password wrong", nil))
	}
}

func validateAccount(email string, password string) string {
	db := database.CheckAndGetMYSQL()

	rows, err := db.Query("SELECT MapUserID FROM MapUser"+
		" WHERE Email = ? and PasswordHash = ? limit 1", email, password)

	if err != nil || !rows.Next() {
		return ""
	} else {
		var userId string
		rows.Scan(&userId)
		return userId
	}
}

func resetPassword(c *gin.Context) {
	email := c.PostForm("email")
	oldPassword := c.PostForm("oldPassword")
	newPassword := c.PostForm("newPassword")

	db := database.CheckAndGetMYSQL()

	testValid, err := db.Query("SELECT MapUserID FROM MapUser"+
		" WHERE Email = ? and PasswordHash = ? limit 1", email, oldPassword)

	if err != nil {
		c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
		return
	} else if err == nil && !testValid.Next() {
		c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Email or password wrong", nil))
		return
	}

	_, err = db.Exec("UPDATE MapUser SET PasswordHash = '" + newPassword + "' WHERE Email = '" + email + "' AND PasswordHash = '" + oldPassword + "' limit 1")

	if err != nil {
		c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
		return
	}

	c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", nil))
}
