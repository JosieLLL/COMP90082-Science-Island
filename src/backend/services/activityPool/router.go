package activitypool

import (
	"github.com/gin-gonic/gin"
)

func Routers(e *gin.Engine) {
	e.GET("/activity-pool", GetActivityPool)
	e.GET("/activity-pool/:activityId", GetActivity)
}
