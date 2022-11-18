package newActivity

import (
	"github.com/gin-gonic/gin"
)

func Routers(e *gin.Engine) {
	e.POST("/new-activity", AddNewActivity)
	e.POST("/map-curriculum", MapCurriculum)
	e.GET("/new-activity/get-exist-folder", GetExistFolder)
	e.POST("/new-activity/new-folder", NewFolder)
	e.GET("/new-activity/get-exist-realm", GetExistRealm)
	e.POST("/new-activity/new-realm", NewRealm)
	e.GET("/new-activity/get-exist-topic", GetExistTopic)
	e.POST("/new-activity/new-topic", NewTopic)
	e.GET("/new-activity/get-exist-keyConcept", GetExistKeyConcept)
	e.POST("/new-activity/new-keyConcept", NewKeyConcept)
	e.GET("/new-activity/get-exist-purpose", GetExistPurpose)
	e.POST("/new-activity/new-purpose", NewPurpose)
	e.GET("/new-activity/get-exist-ageRange", GetExistAgeRange)
	e.POST("/new-activity/new-ageRange", NewAgeRange)
	e.GET("/new-activity/get-exist-scientist", GetExistScientist)
	e.POST("/new-activity/new-scientist", NewScientist)
	e.GET("/new-activity/get-exist-institution", GetExistInstitution)
	e.POST("/new-activity/new-institution", NewInstitution)
	e.GET("/new-activity/get-exist-field", GetExistField)
	e.POST("/new-activity/new-field", NewField)
	e.GET("/new-activity/get-exist-country", GetExistCountry)
	e.POST("/new-activity/new-country", NewCountry)
}
