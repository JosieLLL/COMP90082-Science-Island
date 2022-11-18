package activitypool

import (
	"SC-Redback/src/backend/database"
	"SC-Redback/src/backend/services/authorization"
	"SC-Redback/src/backend/utils"
	"database/sql"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func GetActivityPool(c *gin.Context) {
	var activityPoolReply utils.ActivityPoolReply

	userId := c.GetHeader("userId")
	token := c.GetHeader("token")

	page := c.Query("page")
	pageLimit := c.Query("pageLimit")
	status := c.Query("status")
	questTypes := c.Query("questTypes")
	learningAreas := c.Query("learningAreas")
	generalCapabilities := c.Query("generalCapabilities")
	folderIds := c.Query("folderIds")

	filterSQL := parseFilters(status, questTypes, learningAreas, generalCapabilities, folderIds)
	pageSize, left, right := utils.CalculatePage(page, pageLimit)

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)
		db := database.CheckAndGetMYSQL()

		rows, err := db.Query("SELECT DISTINCT Quest.QuestID, Quest.Name, FolderName, MapStatus, CreateDate, ResourceURL, ImageSrc, Realm.RealmID, Realm.Name " +
			"FROM Quest LEFT JOIN Folder ON Quest.FolderID = Folder.FolderID LEFT JOIN Realm ON Quest.RealmID = Realm.RealmID " +
			filterSQL + "ORDER BY CreateDate DESC")
		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		var activitys []utils.AcitivityOverview
		var folderName sql.NullString
		var resourceUrl sql.NullString
		var imageSrc sql.NullString

		index := 0    // the index to filter the record not in page
		totalNum := 0 // total records
		for rows.Next() {
			if index >= left && index <= right {
				var activityOverview utils.AcitivityOverview
				err = rows.Scan(&activityOverview.ActivityID, &activityOverview.QuestName, &folderName,
					&activityOverview.MapStatus, &activityOverview.CreateDate, &resourceUrl, &imageSrc, &activityOverview.Realm.RealmID,
					&activityOverview.Realm.RealmName)

				if err != nil {
					c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
					return
				}

				questTypeRows, err := db.Query("SELECT ActivityType FROM Activity WHERE QuestID IN " +
					"(SELECT QuestID FROM Activity WHERE QuestID = \"" +
					strconv.Itoa(activityOverview.ActivityID) + "\")")
				if err != nil {
					c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
					return
				}

				var questTypes []string
				for questTypeRows.Next() {
					var questtype string
					err = questTypeRows.Scan(&questtype)

					if err != nil {
						c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
						return
					}
					questTypes = append(questTypes, questtype)
				}

				yearRows, err := db.Query("SELECT YearLevelID, YearLevelName FROM YearLevel WHERE YearLevelID IN " +
					"(SELECT YearLevelID FROM YearLevelInQuest WHERE QuestID = \"" + strconv.Itoa(activityOverview.ActivityID) + "\")")
				if err != nil {
					c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
					return
				}

				var yearLevels []utils.YearLevelTable
				for yearRows.Next() {
					var yearLevel utils.YearLevelTable
					err = yearRows.Scan(&yearLevel.YearLevelID, &yearLevel.YearLevelName)

					if err != nil {
						c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
						return
					}
					yearLevels = append(yearLevels, yearLevel)
				}

				activityOverview.YearLevels = yearLevels
				activityOverview.FolderName = folderName.String
				activityOverview.ResourceUrl = resourceUrl.String
				activityOverview.ImageSrc = imageSrc.String
				activityOverview.QuestTypes = questTypes
				activitys = append(activitys, activityOverview)
			}

			totalNum++
			index++
		}

		activityPoolReply.Activities = activitys
		activityPoolReply.TotalNum = totalNum
		activityPoolReply.PageSize = pageSize

		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", activityPoolReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}
}

func GetActivity(c *gin.Context) {
	var activityReply utils.ActivityReply

	userId := c.GetHeader("userId")
	token := c.GetHeader("token")

	activityid := c.Param("activityId")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)
		db := database.CheckAndGetMYSQL()

		rows, err := db.Query("SELECT Quest.QuestID, Quest.Name, ResourceUrl, Link, CreateDate, " +
			"QuestionSpoken, Realm.Name, TopicName, KeyConceptName, ContentDescription, " +
			"Outcomes, AgeRangeName, ScientistName, FieldName, MappingPersonName, MappingPersonEmail, FolderName, RealWorldConnection, " +
			"PurposeName, AuthorTitle, InstitutionName, AuthorEmail, AuthorPhone, CountryName, MappingPersonPhone, MapDate, MapStatus " +
			"FROM Quest LEFT JOIN Folder ON Quest.FolderID = Folder.FolderID " +
			"LEFT JOIN Realm ON Quest.RealmID = Realm.RealmID " +
			"LEFT JOIN Topic ON Quest.TopicID = Topic.TopicID " +
			"LEFT JOIN KeyConcept ON Quest.KeyConceptID = KeyConcept.KeyConceptID " +
			"LEFT JOIN Purpose ON Quest.PurposeID = Purpose.PurposeID " +
			"LEFT JOIN AgeRange ON Quest.AgeRangeID = AgeRange.AgeRangeID " +
			"LEFT JOIN Scientist ON Quest.ScientistID = Scientist.ScientistID " +
			"LEFT JOIN Institution ON Quest.InstitutionID = Institution.InstitutionID " +
			"LEFT JOIN Field ON Quest.FieldID = Field.FieldID " +
			"LEFT JOIN Country ON Quest.CountryID = Country.CountryID " +
			"WHERE Quest.QuestID = \"" + activityid + "\"")

		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		} else if err == nil && !rows.Next() {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Activity Not Exist", nil))
			return
		}

		var activity utils.AcitivityTable
		err = rows.Scan(&activityReply.ActivityID, &activityReply.QuestName, &activity.ResourceUrl, &activity.Link,
			&activityReply.CreateDate, &activity.QuestionSpoken, &activity.RealmName, &activity.TopicName, &activity.KeyConceptName,
			&activity.ContentDescription, &activity.Outcomes, &activity.AgeRangeName,
			&activity.ScientistName, &activity.FieldName, &activity.MappingPersonName, &activity.MappingPersonEmail, &activity.FolderName,
			&activity.RealWorldConnection, &activity.PurposeName, &activity.AuthorTitle, &activity.InstitutionName, &activity.AuthorEmail,
			&activity.AuthorPhone, &activity.CountryName, &activity.MappingPersonPhone, &activityReply.MapDate, &activityReply.MapStatus)

		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		activityReply := convertNull(activityReply, activity)

		rows, err = db.Query("SELECT CurriculumID, EducationLevel, Description, Code, Subject, Title, StatementLabel, LearningArea, GeneralCapability " +
			"FROM Curriculum WHERE CurriculumID IN (SELECT CurriculumID FROM CurriculumInQuest WHERE QuestID = \"" +
			activityid + "\")")
		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		var curriculums []utils.CurriculumTable
		for rows.Next() {
			var curriculum utils.CurriculumTable
			err = rows.Scan(&curriculum.CurriculumID, &curriculum.EducationLevel, &curriculum.Description,
				&curriculum.Code, &curriculum.Subject, &curriculum.Title, &curriculum.StatementLabel, &curriculum.LearningArea, &curriculum.GeneralCapabilities)

			if err != nil {
				c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
				return
			}
			curriculums = append(curriculums, curriculum)
		}

		activityReply.Curriculums = curriculums

		rows, err = db.Query("SELECT AudienceRoleID, AudienceRoleName FROM AudienceRole WHERE AudienceRoleID IN " +
			"(SELECT AudienceRoleID FROM AudienceRoleInQuest WHERE QuestID = \"" + activityid + "\")")
		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		var audienceRoles []utils.AudienceRoleTable
		for rows.Next() {
			var audienceRole utils.AudienceRoleTable
			err = rows.Scan(&audienceRole.AudienceRoleID, &audienceRole.AudienceRoleName)

			if err != nil {
				c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
				return
			}
			audienceRoles = append(audienceRoles, audienceRole)
		}

		activityReply.AudienceRoles = audienceRoles

		rows, err = db.Query("SELECT YearLevelID, YearLevelName FROM YearLevel WHERE YearLevelID IN " +
			"(SELECT YearLevelID FROM YearLevelInQuest WHERE QuestID = \"" + activityid + "\")")
		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		var yearLevels []utils.YearLevelTable
		for rows.Next() {
			var yearLevel utils.YearLevelTable
			err = rows.Scan(&yearLevel.YearLevelID, &yearLevel.YearLevelName)

			if err != nil {
				c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
				return
			}
			yearLevels = append(yearLevels, yearLevel)
		}

		activityReply.YearLevels = yearLevels

		rows, err = db.Query("SELECT FileID, FileName, DiskName FROM Files WHERE FileID IN " +
			"(SELECT FileID FROM FilesInQuest WHERE QuestID = \"" + activityid + "\")")
		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		var files []utils.FileTable
		for rows.Next() {
			var file utils.FileTable
			err = rows.Scan(&file.FileID, &file.FileName, &file.DiskName)

			if err != nil {
				c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
				return
			}
			files = append(files, file)
		}

		activityReply.Files = files

		rows, err = db.Query("SELECT ActivityType FROM Activity WHERE QuestID = \"" + activityid + "\"")
		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		var questTypes []string
		for rows.Next() {
			var questtype string
			err = rows.Scan(&questtype)

			if err != nil {
				c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
				return
			}
			questTypes = append(questTypes, questtype)
		}
		activityReply.QuestTypes = questTypes

		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", activityReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}
}

// convert null value in database to empty string
func convertNull(activityReply utils.ActivityReply, activity utils.AcitivityTable) utils.ActivityReply {
	activityReply.ResourceUrl = activity.ResourceUrl.String
	activityReply.Link = activity.Link.String
	activityReply.QuestionSpoken = activity.QuestionSpoken.String
	activityReply.ContentDescription = activity.ContentDescription.String
	activityReply.Outcomes = activity.Outcomes.String
	activityReply.MappingPersonName = activity.MappingPersonName.String
	activityReply.MappingPersonEmail = activity.MappingPersonEmail.String
	activityReply.RealWorldConnection = activity.RealWorldConnection.String
	activityReply.AuthorTitle = activity.AuthorTitle.String
	activityReply.AuthorEmail = activity.AuthorEmail.String
	activityReply.AuthorPhone = activity.AuthorPhone.String
	activityReply.MappingPersonPhone = activity.MappingPersonPhone.String
	activityReply.RealmName = activity.RealmName.String
	activityReply.TopicName = activity.TopicName.String
	activityReply.KeyConceptName = activity.KeyConceptName.String
	activityReply.AgeRangeName = activity.AgeRangeName.String
	activityReply.ScientistName = activity.ScientistName.String
	activityReply.FieldName = activity.FieldName.String
	activityReply.FolderName = activity.FolderName.String
	activityReply.PurposeName = activity.PurposeName.String
	activityReply.InstitutionName = activity.InstitutionName.String
	activityReply.CountryName = activity.CountryName.String

	return activityReply
}

func parseFilters(status string, questTypes string, learningAreas string, generalCapability string, folderIds string) string {
	filterResult := ""
	filterActivate := false
	where := ""

	if status != "" || folderIds != "" {
		where += "WHERE "
	}

	learningAreaResult, filterActivate := parseLearningAreaFilter(learningAreas, filterActivate)
	generalCapabilityResult, filterActivate := parseGeneralCapabilityFilter(generalCapability, filterActivate)
	questTypeResult := questTypeFilter(questTypes)

	folderResult, filterActivate := parseFilter(folderIds, "Folder.FolderID", filterActivate)
	statusResult, _ := parseFilter(status, "MapStatus", filterActivate)

	filterResult += learningAreaResult + generalCapabilityResult + questTypeResult + where + folderResult + statusResult

	return filterResult
}

func parseFilter(filterString string, filterName string, filterActivate bool) (string, bool) {
	filterResult := ""
	filterStart := false

	if filterString != "" {
		slice := strings.Split(filterString, ",")
		for _, eachType := range slice {
			if filterActivate {
				if filterStart {
					filterResult += "OR " + filterName + "=\"" + eachType + "\" "
				} else {
					filterStart = true
					filterResult += "AND (" + filterName + "=\"" + eachType + "\" "
				}
			} else {
				filterActivate = true
				filterStart = true
				filterResult += "(" + filterName + "=\"" + eachType + "\" "
			}
		}

		if filterStart {
			filterResult += ") "
		}

		return filterResult, filterActivate
	} else {
		return "", filterActivate
	}
}

func parseLearningAreaFilter(learningAreas string, filterActivate bool) (string, bool) {
	if learningAreas != "" {
		filterActivate = true
		filterResult := "INNER JOIN CurriculumInQuest ON Quest.QuestID = CurriculumInQuest.QuestID " +
			"INNER JOIN Curriculum ON Curriculum.CurriculumID = CurriculumInQuest.CurriculumID AND ("
		filterStart := false

		learningAreaSlice := strings.Split(learningAreas, ",")
		for _, learningArea := range learningAreaSlice {
			if filterStart {
				filterResult += "OR LearningArea = \"" + learningArea + "\" "
			} else {
				filterStart = true
				filterResult += "LearningArea = \"" + learningArea + "\" "
			}
		}

		filterResult += ") "

		return filterResult, filterActivate
	} else {
		return "", filterActivate
	}
}

func parseGeneralCapabilityFilter(generalCapabilities string, filterActivate bool) (string, bool) {
	if generalCapabilities != "" {
		var filterResult string
		if filterActivate {
			filterResult = "AND ("
		} else {
			filterResult = "INNER JOIN CurriculumInQuest ON Quest.QuestID = CurriculumInQuest.QuestID " +
				"INNER JOIN Curriculum ON Curriculum.CurriculumID = CurriculumInQuest.CurriculumID AND ("
		}

		filterStart := false

		generalCapabilitiesSlice := strings.Split(generalCapabilities, ",")
		for _, generalCapability := range generalCapabilitiesSlice {
			if filterStart {
				filterResult += "OR GeneralCapability LIKE '%" + generalCapability + "%' "
			} else {
				filterStart = true
				filterResult += "GeneralCapability LIKE '%" + generalCapability + "%' "
			}
		}

		filterResult += ") "

		return filterResult, filterActivate
	} else {
		return "", filterActivate
	}
}

func questTypeFilter(questTypes string) string {
	filterResult := "INNER JOIN Activity ON Activity.QuestID = Quest.QuestID "
	if questTypes != "" {
		filterResult += "AND ("
		filterStart := false

		questTypeSlice := strings.Split(questTypes, ",")
		for _, questType := range questTypeSlice {
			if filterStart {
				filterResult += "OR ActivityType = \"" + questType + "\" "
			} else {
				filterStart = true
				filterResult += "ActivityType = \"" + questType + "\" "
			}
		}

		filterResult += ") "
	}

	return filterResult
}
