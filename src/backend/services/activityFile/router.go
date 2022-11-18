package activityFile

import (
	"github.com/gin-gonic/gin"
)

func Routers(e *gin.Engine) {
	e.POST("/upload-file", UploadFile)
	e.POST("/attach-files", AttachFiles)
	e.GET("/get-file", DownloadFile)
}
