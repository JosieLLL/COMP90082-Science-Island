package utils

import "github.com/gin-gonic/gin"

type Option func(*gin.Engine)

var options = []Option{}

// initialize all routers
func IncludeRouters(opts ...Option) {
	options = append(options, opts...)
}

// initialize gin engine
func InitEngine() *gin.Engine {
	r := gin.New()
	for _, opt := range options {
		opt(r)
	}
	return r
}
