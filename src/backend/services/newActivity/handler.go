package newActivity

import (
	"SC-Redback/src/backend/database"
	"SC-Redback/src/backend/services/authorization"
	"SC-Redback/src/backend/utils"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func AddNewActivity(c *gin.Context) {
	var reply utils.Reply

	userId := c.GetHeader("userId")
	token := c.GetHeader("token")

	folderid := c.PostForm("folderId")
	questName := c.PostForm("questName")
	questTypes := c.PostForm("questTypes")
	activityid := c.PostForm("activityId")
	realmId := c.PostForm("realmId")
	resourceUrl := c.PostForm("resourceUrl")
	fileids := c.PostForm("fileIds")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)
		message, success := addActivity(folderid, questName, questTypes, activityid, resourceUrl, fileids, realmId)

		if success {
			reply.Code = http.StatusOK
			reply.Msg = "Successful"
			reply.Data = message
			c.JSON(http.StatusOK, reply)
		} else {
			reply.Code = http.StatusBadRequest
			reply.Msg = message
			c.JSON(http.StatusBadRequest, reply)
		}
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}
}

func addActivity(folderid string, questName string, questTypes string, activityid string, resourceUrl string, fileids string, realmId string) (string, bool) {
	var err error

	db := database.CheckAndGetMYSQL()

	rows, err := db.Query("SELECT * FROM Quest WHERE QuestID = ? limit 1", activityid)

	if err == nil && rows.Next() {
		return "Activity ID exist", false
	}
	trx, err := db.Begin()
	if err != nil {
		return "Database Error", false
	}

	if folderid == "" {
		_, err = trx.Exec("Insert INTO Quest(QuestID, RealmID, Name, Description, ResourceUrl)VALUE(?, ?, ?, ?, ?)",
			activityid, realmId, questName, "", resourceUrl)

		if err != nil {
			trx.Rollback()
			return "Database error", false
		}
	} else {
		_, err = trx.Exec("Insert INTO Quest(QuestID, RealmID, Name, Description, ResourceUrl, FolderID)VALUE(?, ?, ?, ?, ?, ?)",
			activityid, realmId, questName, "", resourceUrl, folderid)

		if err != nil {
			trx.Rollback()
			return "Database error", false
		}
	}

	questTypeSlice := strings.Split(questTypes, ",")
	for _, questType := range questTypeSlice {
		_, err = trx.Exec("Insert INTO Activity(QuestID, ActivityType)VALUE(?, ?)",
			activityid, questType)

		if err != nil {
			trx.Rollback()
			return "Database error", false
		}
	}

	if fileids != "" {
		fileIdSlice := strings.Split(fileids, ",")

		for _, fileid := range fileIdSlice {
			_, err := trx.Exec("INSERT INTO FilesInQuest (FileID, QuestID) VALUES(?, ?);", fileid, activityid)

			if err != nil {
				trx.Rollback()
				return "Database Error", false
			}
		}
	}

	err = trx.Commit()
	if err != nil {
		return "Database Error", false
	}

	return activityid, true
}

func MapCurriculum(c *gin.Context) {
	var reply utils.Reply

	userId := c.GetHeader("userId")
	token := c.GetHeader("token")

	activityid := c.PostForm("activityId")
	questName := c.PostForm("questName")
	questTypes := c.PostForm("questTypes")
	resourceUrl := c.PostForm("resourceUrl")
	ingameLink := c.PostForm("ingameLink")

	questionSpoken := c.PostForm("questionSpoken")
	realmId := c.PostForm("realmId")
	topicId := c.PostForm("topicId")
	keyConceptId := c.PostForm("keyConceptId")
	contentDescription := c.PostForm("contentDescription")
	outcomes := c.PostForm("outcomes")
	yearLevelIds := c.PostForm("yearLevelIds")
	ageRangeId := c.PostForm("ageRangeId")
	audienceRoleIds := c.PostForm("audienceRoleIds")
	scientistId := c.PostForm("scientistId")
	fieldId := c.PostForm("fieldId")
	mapName := c.PostForm("mapName")
	mapEmail := c.PostForm("mapEmail")
	curriculumIds := c.PostForm("curriculumIds")

	folderid := c.PostForm("folderId")
	realWorldConnection := c.PostForm("realWorldConnection")
	purposeId := c.PostForm("purposeId")
	authorTitle := c.PostForm("authorTitle")
	institutionId := c.PostForm("institutionId")
	authorEmail := c.PostForm("authorEmail")
	authorPhone := c.PostForm("authorPhone")
	countryId := c.PostForm("countryId")
	mapPhone := c.PostForm("mapPhone")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)

		if audienceRoleIds == "" || curriculumIds == "" {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest,
				"One of them is empty: audienceRoleIds, curriculumIds, generalCapabilityIds", nil))
		}

		message, success := addCurriculum(activityid, questName, questTypes, resourceUrl, ingameLink,
			questionSpoken, realmId, topicId, keyConceptId, contentDescription, yearLevelIds, outcomes, ageRangeId,
			audienceRoleIds, scientistId, fieldId, mapName, mapEmail, curriculumIds,
			folderid, realWorldConnection, purposeId, authorTitle, institutionId, authorEmail, authorPhone, countryId, mapPhone)

		if success {
			reply.Code = http.StatusOK
			reply.Msg = "Successful"
			reply.Data = message
			c.JSON(http.StatusOK, reply)
		} else {
			reply.Code = http.StatusBadRequest
			reply.Msg = message
			c.JSON(http.StatusBadRequest, reply)
		}
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}
}

func addCurriculum(activityid string, questName string, questTypes string, resourceUrl string, ingameLink string,
	questionSpoken string, realmId string, topicId string, keyConceptId string, contentDescription string, yearLevelIds string,
	outcomes string, ageRangeId string, audienceRoleIds string, scientistId string, fieldId string, mapName string, mapEmail string,
	curriculumIds string, folderid string, realWorldConnection string, purposeId string, authorTitle string,
	institutionId string, authorEmail string, authorPhone string, countryId string, mapPhone string) (string, bool) {

	db := database.CheckAndGetMYSQL()

	rows, err := db.Query("SELECT * FROM Quest WHERE QuestID = ? limit 1", activityid)

	exist := true
	if err != nil {
		return "Database Error", false
	} else if err == nil && !rows.Next() {
		exist = false
	}

	trx, err := db.Begin()
	if err != nil {
		return "Database error", false
	}

	if exist {
		// map curriculum to exist activity
		sqlAttr := "UPDATE Quest SET Name = \"" + questName + "\", ResourceUrl = \"" + resourceUrl +
			"\", Link = \"" + ingameLink + "\", QuestionSpoken = \"" + questionSpoken + "\", RealmID = \"" + realmId + "\", TopicID = \"" + topicId +
			"\", KeyConceptID = \"" + keyConceptId + "\", ContentDescription = \"" + contentDescription + "\", Outcomes = \"" + outcomes +
			"\", AgeRangeID = \"" + ageRangeId + "\", ScientistID = \"" + scientistId + "\", FieldID = \"" + fieldId +
			"\", MappingPersonName = \"" + mapName + "\", MappingPersonEmail = \"" + mapEmail + "\", MapStatus = 1, MapDate = now() "
		sqlCondition := "WHERE QuestID = \"" + activityid + "\""

		sqlAttr = updateCurriculumSql(sqlAttr, folderid, realWorldConnection, purposeId, authorTitle,
			institutionId, authorEmail, authorPhone, countryId, mapPhone)

		_, err = trx.Exec(sqlAttr + sqlCondition)
		if err != nil {
			trx.Rollback()
			return "Database error", false
		}
	} else {
		// map curriculum to new activity
		rows, err := db.Query("SELECT * FROM Quest WHERE QuestID = ? limit 1", activityid)

		if err != nil {
			return "Database Error", false
		} else if err == nil && rows.Next() {
			return "Activity ID exist", false
		}

		sqlAttr := "INSERT INTO Quest(QuestID, Name, ResourceUrl, Link, QuestionSpoken, RealmID, " +
			"TopicID, KeyConceptID, ContentDescription, Outcomes, AgeRangeID, ScientistID, FieldID, " +
			"MappingPersonName, MappingPersonEmail, MapStatus, MapDate, Description"
		sqlValue := "VALUES(\"" + activityid + "\", \"" + questName + "\", \"" + resourceUrl + "\", \"" + ingameLink + "\", \"" +
			questionSpoken + "\", \"" + realmId + "\", \"" + topicId + "\", \"" + keyConceptId + "\", \"" + contentDescription + "\", \"" + outcomes +
			"\", \"" + ageRangeId + "\", \"" + scientistId + "\", \"" + fieldId + "\", \"" + mapName + "\", \"" + mapEmail + "\", \"1\", now(), \"\""

		sqlAttr, sqlValue = newCurriculumSql(sqlAttr, sqlValue, folderid, realWorldConnection, purposeId, authorTitle,
			institutionId, authorEmail, authorPhone, countryId, mapPhone)

		_, err = trx.Exec(sqlAttr + sqlValue)
		if err != nil {
			trx.Rollback()
			return "Database error", false
		}

		questTypeSlice := strings.Split(questTypes, ",")
		for _, questType := range questTypeSlice {
			_, err = trx.Exec("Insert INTO Activity(QuestID, ActivityType)VALUE(?, ?)",
				activityid, questType)

			if err != nil {
				trx.Rollback()
				return "Database error", false
			}
		}
	}

	audienceRoleIdSlice := strings.Split(audienceRoleIds, ",")
	trx.Exec("DELETE FROM AudienceRoleInQuest where QuestID = \"" + activityid + "\"")

	for _, audienceRoleId := range audienceRoleIdSlice {
		_, err := trx.Exec("INSERT INTO AudienceRoleInQuest (QuestID, AudienceRoleId) VALUE(?, ?);", activityid, audienceRoleId)

		if err != nil {
			trx.Rollback()
			return "Database error", false
		}
	}

	curriculumIdSlice := strings.Split(curriculumIds, ",")
	trx.Exec("DELETE FROM CurriculumInQuest where QuestID = \"" + activityid + "\"")

	for _, curriculumId := range curriculumIdSlice {
		_, err := trx.Exec("INSERT INTO CurriculumInQuest (QuestID, CurriculumID) VALUE(?, ?);", activityid, curriculumId)

		if err != nil {
			trx.Rollback()
			return "Database error", false
		}
	}

	yearLevelIdSlice := strings.Split(yearLevelIds, ",")
	trx.Exec("DELETE FROM YearLevelInQuest where QuestID = \"" + activityid + "\"")

	for _, yearLevelId := range yearLevelIdSlice {
		_, err := trx.Exec("INSERT INTO YearLevelInQuest (QuestID, YearLevelID) VALUE(?, ?);", activityid, yearLevelId)

		if err != nil {
			trx.Rollback()
			return "Database error", false
		}
	}

	err = trx.Commit()
	if err != nil {
		return "Database error", false
	}

	return activityid, true
}

func updateCurriculumSql(sqlAttr string, folderid string, realWorldConnection string, purposeId string,
	authorTitle string, institutionId string, authorEmail string, authorPhone string, countryId string, mapPhone string) string {

	if folderid != "" {
		sqlAttr += ", FolderID = \"" + folderid + "\" "
	}

	if realWorldConnection != "" {
		sqlAttr += ", RealWorldConnection = \"" + realWorldConnection + "\" "
	}

	if purposeId != "" {
		sqlAttr += ", PurposeID = \"" + purposeId + "\" "
	}

	if authorTitle != "" {
		sqlAttr += ", AuthorTitle = \"" + authorTitle + "\" "
	}

	if institutionId != "" {
		sqlAttr += ", InstitutionID = \"" + institutionId + "\" "
	}

	if authorEmail != "" {
		sqlAttr += ", AuthorEmail = \"" + authorEmail + "\" "
	}

	if authorPhone != "" {
		sqlAttr += ", AuthorPhone = \"" + authorPhone + "\" "
	}

	if countryId != "" {
		sqlAttr += ", CountryID = \"" + countryId + "\" "
	}

	if mapPhone != "" {
		sqlAttr += ", MappingPersonPhone = \"" + mapPhone + "\" "
	}

	return sqlAttr
}

func newCurriculumSql(sqlAttr string, sqlValue string, folderid string, realWorldConnection string, purposeId string,
	authorTitle string, institutionId string, authorEmail string, authorPhone string, countryId string, mapPhone string) (string, string) {

	if folderid != "" {
		sqlAttr += ", FolderID"
		sqlValue += ", \"" + folderid + "\""
	}

	if realWorldConnection != "" {
		sqlAttr += ", RealWorldConnection"
		sqlValue += ", \"" + realWorldConnection + "\""
	}

	if purposeId != "" {
		sqlAttr += ", PurposeID"
		sqlValue += ", \"" + purposeId + "\""
	}

	if authorTitle != "" {
		sqlAttr += ", AuthorTitle"
		sqlValue += ", \"" + authorTitle + "\""
	}

	if institutionId != "" {
		sqlAttr += ", InstitutionID"
		sqlValue += ", \"" + institutionId + "\""
	}

	if authorEmail != "" {
		sqlAttr += ", AuthorEmail"
		sqlValue += ", \"" + authorEmail + "\""
	}

	if authorPhone != "" {
		sqlAttr += ", AuthorPhone"
		sqlValue += ", \"" + authorPhone + "\""
	}

	if countryId != "" {
		sqlAttr += ", CountryID"
		sqlValue += ", \"" + countryId + "\""
	}

	if mapPhone != "" {
		sqlAttr += ", MappingPersonPhone"
		sqlValue += ", \"" + mapPhone + "\""
	}

	sqlAttr += ") "
	sqlValue += ")"

	return sqlAttr, sqlValue
}

func GetExistFolder(c *gin.Context) {
	var existFolderReply utils.ExistFolderReply
	userId := c.GetHeader("userId")
	token := c.GetHeader("token")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)

		db := database.CheckAndGetMYSQL()

		rows, err := db.Query("SELECT FolderID, FolderName FROM Folder")

		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		var folders []utils.FolderTable

		for rows.Next() {
			var folderOverview utils.FolderTable
			err = rows.Scan(&folderOverview.FolderID, &folderOverview.FolderName)

			if err != nil {
				c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
				return
			}

			folders = append(folders, folderOverview)
		}
		existFolderReply.Folders = folders

		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", existFolderReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}
}

func NewFolder(c *gin.Context) {
	var newFolderReply utils.NewFolderReply

	userId := c.GetHeader("userId")
	token := c.GetHeader("token")

	folderName := c.PostForm("folderName")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)

		db := database.CheckAndGetMYSQL()

		rows, err := db.Exec("INSERT INTO Folder(FolderName)value(?)", folderName)

		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		folderid, _ := rows.LastInsertId()

		newFolderReply.FolderName = folderName
		newFolderReply.FolderID = strconv.FormatInt(folderid, 10)

		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", newFolderReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}

}

func GetExistTopic(c *gin.Context) {
	var existTopicReply utils.ExistTopicReply

	userId := c.GetHeader("userId")
	token := c.GetHeader("token")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)

		db := database.CheckAndGetMYSQL()

		rows, err := db.Query("SELECT TopicID, TopicName FROM Topic")

		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		var topics []utils.TopicTable

		for rows.Next() {
			var topicOverview utils.TopicTable
			err = rows.Scan(&topicOverview.TopicID, &topicOverview.TopicName)

			if err != nil {
				c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
				return
			}

			topics = append(topics, topicOverview)
		}
		existTopicReply.Topics = topics

		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", existTopicReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}
}

func NewTopic(c *gin.Context) {
	var newTopicReply utils.NewTopicReply

	userId := c.GetHeader("userId")
	token := c.GetHeader("token")

	topicName := c.PostForm("topicName")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)
		db := database.CheckAndGetMYSQL()

		rows, err := db.Exec("INSERT INTO Topic(TopicName)value(?)", topicName)

		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}
		topicid, _ := rows.LastInsertId()

		newTopicReply.TopicName = topicName
		newTopicReply.TopicID = strconv.FormatInt(topicid, 10)

		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", newTopicReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}

}

func GetExistRealm(c *gin.Context) {
	var existRealmReply utils.ExistRealmReply
	userId := c.GetHeader("userId")
	token := c.GetHeader("token")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)

		db := database.CheckAndGetMYSQL()

		rows, err := db.Query("SELECT RealmID, Name FROM Realm")

		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		var realms []utils.RealmTable

		for rows.Next() {
			var realmOverview utils.RealmTable
			err = rows.Scan(&realmOverview.RealmID, &realmOverview.RealmName)

			if err != nil {
				c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
				return
			}

			realms = append(realms, realmOverview)
		}
		existRealmReply.Realms = realms

		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", existRealmReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}
}

func NewRealm(c *gin.Context) {
	var newRealmReply utils.NewRealmReply
	userId := c.GetHeader("userId")
	token := c.GetHeader("token")

	realmName := c.PostForm("realmName")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)

		var err error

		db := database.CheckAndGetMYSQL()

		rows, err := db.Exec("INSERT INTO Realm(Name, Description)value(?, ?)", realmName, "")

		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}
		realmid, _ := rows.LastInsertId()

		newRealmReply.RealmName = realmName
		newRealmReply.RealmID = strconv.FormatInt(realmid, 10)

		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", newRealmReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}

}

func GetExistKeyConcept(c *gin.Context) {
	var existKeyConceptReply utils.ExistKeyConceptReply
	userId := c.GetHeader("userId")
	token := c.GetHeader("token")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)

		db := database.CheckAndGetMYSQL()

		rows, err := db.Query("SELECT KeyConceptID, KeyConceptName FROM KeyConcept")

		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		var keyConcepts []utils.KeyConceptTable

		for rows.Next() {
			var keyConceptOverview utils.KeyConceptTable
			err = rows.Scan(&keyConceptOverview.KeyConceptID, &keyConceptOverview.KeyConceptName)

			if err != nil {
				c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
				return
			}

			keyConcepts = append(keyConcepts, keyConceptOverview)
		}
		existKeyConceptReply.KeyConcepts = keyConcepts

		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", existKeyConceptReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}
}

func NewKeyConcept(c *gin.Context) {
	var newKeyConceptReply utils.NewKeyConceptReply
	userId := c.GetHeader("userId")
	token := c.GetHeader("token")

	keyConceptName := c.PostForm("keyConceptName")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)

		db := database.CheckAndGetMYSQL()

		rows, err := db.Exec("INSERT INTO KeyConcept(KeyConceptName)value(?)", keyConceptName)

		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		keyConceptid, _ := rows.LastInsertId()

		newKeyConceptReply.KeyConceptName = keyConceptName
		newKeyConceptReply.KeyConceptID = strconv.FormatInt(keyConceptid, 10)

		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", newKeyConceptReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}

}

func GetExistPurpose(c *gin.Context) {
	var existPurposeReply utils.ExistPurposeReply
	userId := c.GetHeader("userId")
	token := c.GetHeader("token")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)

		db := database.CheckAndGetMYSQL()

		rows, err := db.Query("SELECT PurposeID, PurposeName FROM Purpose")

		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		var purposes []utils.PurposeTable

		for rows.Next() {
			var purposeOverview utils.PurposeTable
			err = rows.Scan(&purposeOverview.PurposeID, &purposeOverview.PurposeName)

			if err != nil {
				c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
				return
			}

			purposes = append(purposes, purposeOverview)
		}
		existPurposeReply.Purposes = purposes

		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", existPurposeReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}
}

func NewPurpose(c *gin.Context) {
	var newPurposeReply utils.NewPurposeReply
	userId := c.GetHeader("userId")
	token := c.GetHeader("token")
	purposeName := c.PostForm("purposeName")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)
		db := database.CheckAndGetMYSQL()

		rows, err := db.Exec("INSERT INTO Purpose(PurposeName)value(?)", purposeName)

		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		purposeid, _ := rows.LastInsertId()

		newPurposeReply.PurposeName = purposeName
		newPurposeReply.PurposeID = strconv.FormatInt(purposeid, 10)

		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", newPurposeReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}

}

func GetExistAgeRange(c *gin.Context) {
	var existAgeRangeReply utils.ExistAgeRangeReply
	userId := c.GetHeader("userId")
	token := c.GetHeader("token")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)

		db := database.CheckAndGetMYSQL()

		rows, err := db.Query("SELECT AgeRangeID, AgeRangeName FROM AgeRange")

		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		var ageRanges []utils.AgeRangeTable

		for rows.Next() {
			var ageRangeOverview utils.AgeRangeTable
			err = rows.Scan(&ageRangeOverview.AgeRangeID, &ageRangeOverview.AgeRangeName)

			if err != nil {
				c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
				return
			}

			ageRanges = append(ageRanges, ageRangeOverview)
		}
		existAgeRangeReply.AgeRanges = ageRanges

		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", existAgeRangeReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}
}

func NewAgeRange(c *gin.Context) {
	var newAgeRangeReply utils.NewAgeRangeReply
	userId := c.GetHeader("userId")
	token := c.GetHeader("token")
	ageRangeName := c.PostForm("ageRangeName")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)

		db := database.CheckAndGetMYSQL()

		rows, err := db.Exec("INSERT INTO AgeRange(AgeRangeName)value(?)", ageRangeName)

		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		ageRangeid, _ := rows.LastInsertId()

		newAgeRangeReply.AgeRangeName = ageRangeName
		newAgeRangeReply.AgeRangeID = strconv.FormatInt(ageRangeid, 10)

		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", newAgeRangeReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}
}

func GetExistScientist(c *gin.Context) {
	var existScientistReply utils.ExistScientistReply
	userId := c.GetHeader("userId")
	token := c.GetHeader("token")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)

		db := database.CheckAndGetMYSQL()

		rows, err := db.Query("SELECT ScientistID, ScientistName FROM Scientist")

		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		var scientists []utils.ScientistTable
		for rows.Next() {
			var scientistOverview utils.ScientistTable
			err = rows.Scan(&scientistOverview.ScientistID, &scientistOverview.ScientistName)

			if err != nil {
				c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
				return
			}

			scientists = append(scientists, scientistOverview)
		}
		existScientistReply.Scientists = scientists

		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", existScientistReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}
}

func NewScientist(c *gin.Context) {
	var newScientistReply utils.NewScientistReply
	userId := c.GetHeader("userId")
	token := c.GetHeader("token")
	scientistName := c.PostForm("scientistName")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)

		db := database.CheckAndGetMYSQL()

		rows, err := db.Exec("INSERT INTO Scientist(ScientistName)value(?)", scientistName)

		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}
		scientistid, _ := rows.LastInsertId()

		newScientistReply.ScientistName = scientistName
		newScientistReply.ScientistID = strconv.FormatInt(scientistid, 10)

		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", newScientistReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}
}

func GetExistInstitution(c *gin.Context) {
	var existInstitutionReply utils.ExistInstitutionReply
	userId := c.GetHeader("userId")
	token := c.GetHeader("token")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)

		db := database.CheckAndGetMYSQL()

		rows, err := db.Query("SELECT InstitutionID, InstitutionName FROM Institution")

		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		var institutions []utils.InstitutionTable
		for rows.Next() {
			var institutionOverview utils.InstitutionTable
			err = rows.Scan(&institutionOverview.InstitutionID, &institutionOverview.InstitutionName)

			if err != nil {
				c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
				return
			}

			institutions = append(institutions, institutionOverview)
		}
		existInstitutionReply.Institutions = institutions

		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", existInstitutionReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}
}

func NewInstitution(c *gin.Context) {
	var newInstitutionReply utils.NewInstitutionReply
	userId := c.GetHeader("userId")
	token := c.GetHeader("token")
	institutionName := c.PostForm("institutionName")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)

		db := database.CheckAndGetMYSQL()

		rows, err := db.Exec("INSERT INTO Institution(InstitutionName)value(?)", institutionName)

		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}
		institutionid, _ := rows.LastInsertId()

		newInstitutionReply.InstitutionName = institutionName
		newInstitutionReply.InstitutionID = strconv.FormatInt(institutionid, 10)

		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", newInstitutionReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}
}

func GetExistField(c *gin.Context) {
	var existFieldReply utils.ExistFieldReply
	userId := c.GetHeader("userId")
	token := c.GetHeader("token")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)

		db := database.CheckAndGetMYSQL()

		rows, err := db.Query("SELECT FieldID, FieldName FROM Field")

		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		var fields []utils.FieldTable
		for rows.Next() {
			var fieldOverview utils.FieldTable
			err = rows.Scan(&fieldOverview.FieldID, &fieldOverview.FieldName)

			if err != nil {
				c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
				return
			}

			fields = append(fields, fieldOverview)
		}
		existFieldReply.Fields = fields

		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", existFieldReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}
}

func NewField(c *gin.Context) {
	var newFieldReply utils.NewFieldReply
	userId := c.GetHeader("userId")
	token := c.GetHeader("token")
	fieldName := c.PostForm("fieldName")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)

		db := database.CheckAndGetMYSQL()

		rows, err := db.Exec("INSERT INTO Field(FieldName)value(?)", fieldName)

		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		fieldid, _ := rows.LastInsertId()

		newFieldReply.FieldName = fieldName
		newFieldReply.FieldID = strconv.FormatInt(fieldid, 10)

		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", newFieldReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}

}

func GetExistCountry(c *gin.Context) {
	var existCountryReply utils.ExistCountryReply
	userId := c.GetHeader("userId")
	token := c.GetHeader("token")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)

		db := database.CheckAndGetMYSQL()

		rows, err := db.Query("SELECT CountryID, CountryName FROM Country")

		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		var Countries []utils.CountryTable
		for rows.Next() {
			var countryOverview utils.CountryTable
			err = rows.Scan(&countryOverview.CountryID, &countryOverview.CountryName)

			if err != nil {
				c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
				return
			}

			Countries = append(Countries, countryOverview)
		}
		existCountryReply.Countries = Countries

		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", existCountryReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}
}

func NewCountry(c *gin.Context) {
	var newCountryReply utils.NewCountryReply
	userId := c.GetHeader("userId")
	token := c.GetHeader("token")
	countryName := c.PostForm("countryName")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)

		db := database.CheckAndGetMYSQL()

		rows, err := db.Exec("INSERT INTO Country(CountryName)value(?)", countryName)

		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		countryid, _ := rows.LastInsertId()

		newCountryReply.CountryName = countryName
		newCountryReply.CountryID = strconv.FormatInt(countryid, 10)

		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", newCountryReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}
}
