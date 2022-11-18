package register

import (
	token_package "SC-Redback/src/backend/authorization/token"
	"SC-Redback/src/backend/database"
	"SC-Redback/src/backend/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func registerSubmit(c *gin.Context) {
	email := c.PostForm("email")
	password := c.PostForm("password")

	db := database.CheckAndGetMYSQL()

	rows, err := db.Query("SELECT * FROM MapUser WHERE Email = ? limit 1", email)

	if err != nil {
		c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
		return
	} else if err == nil && rows.Next() {
		c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "User exist", nil))
		return
	}

	successRows, err := db.Exec("Insert INTO MapUser (Email, PasswordHash) VALUES(?, ?)", email, password)

	if err != nil {
		c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
		return
	}

	useridInt, _ := successRows.LastInsertId()
	userid := strconv.FormatInt(useridInt, 10)

	pasetokey := utils.RandomString(32)
	maker, _ := token_package.NewPasetoMaker(pasetokey)
	token, _ := maker.CreateToken(userid, utils.RedisTokenLifeTime)
	// authorization.StoreToken(userid, pasetokey, token, utils.RedisTokenLifeTime)

	c.Header("userId", userid)
	c.Header("token", token)
	c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", nil))
}
