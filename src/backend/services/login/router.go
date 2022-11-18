package login

import (
	"github.com/gin-gonic/gin"
)

func Routers(e *gin.Engine) {
	e.POST("/login", validateLogin)
	e.POST("/reset-password", resetPassword)
}
