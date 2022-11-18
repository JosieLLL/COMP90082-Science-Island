package curriculum

import (
	"github.com/gin-gonic/gin"
)

func Routers(e *gin.Engine) {
	e.GET("/get-curriculum", GetCurriculum)
	// e.GET("/get-curriculum/filter-by-code", FilterByCode)
}
