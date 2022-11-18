package main

import (
	"SC-Redback/src/backend/database"
	"SC-Redback/src/backend/services/activityFile"
	activitypool "SC-Redback/src/backend/services/activityPool"
	"SC-Redback/src/backend/services/authorization"
	"SC-Redback/src/backend/services/curriculum"
	"SC-Redback/src/backend/services/login"
	"SC-Redback/src/backend/services/newActivity"
	"SC-Redback/src/backend/services/register"
	"SC-Redback/src/backend/utils"
	//"fmt"
	//"github.com/robfig/cron"
)

func main() {
	utils.ReadEnv(utils.GetEnvFile())
	utils.InitVariables()
	database.ConnectMySQL()
	database.ConnectRedis()
	// database.InputCurriculumData()
	/*cron := cron.New()
	err := cron.AddFunc("0 0 1 1 * ?", func() {
		database.InputCurriculumData()
	})
	if err != nil {
		fmt.Println(err)
	}
	cron.Start()*/
	utils.IncludeRouters(login.Routers, register.Routers, authorization.Routers, activitypool.Routers, newActivity.Routers, curriculum.Routers, activityFile.Routers)
	r := utils.InitEngine()
	r.Run(utils.GetPort())
}
