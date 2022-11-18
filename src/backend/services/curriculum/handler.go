package curriculum

import (
	"SC-Redback/src/backend/database"
	"SC-Redback/src/backend/services/authorization"
	"SC-Redback/src/backend/utils"
	"database/sql"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func GetCurriculum(c *gin.Context) {
	var getCurriculumReply utils.GetCurriculumReply
	var subjectTree []utils.SubjectTree
	userId := c.GetHeader("userId")
	token := c.GetHeader("token")

	page := c.Query("page")
	pageLimit := c.Query("pageLimit")
	subjects := c.Query("subjects")
	yearLevel := c.Query("yearLevel")
	code := c.Query("code")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)
		db := database.CheckAndGetMYSQL()

		pageSize, left, right := utils.CalculatePage(page, pageLimit)

		subjectCurriculumQuery := ""
		subjectSubjectQuery := ""
		if subjects != "" {
			subjectsSlice := strings.Split(subjects, ",")
			start := false
			for _, subject := range subjectsSlice {
				if start {
					subjectCurriculumQuery += "OR child.Subject = '" + subject + "' "
				} else {
					start = true
					subjectCurriculumQuery += "AND (child.Subject = '" + subject + "' "
				}
			}
			subjectCurriculumQuery += ") "

			start = false
			for _, subject := range subjectsSlice {
				if start {
					subjectSubjectQuery += "OR Subject = '" + subject + "' "
				} else {
					start = true
					subjectSubjectQuery += "AND (Subject = '" + subject + "' "
				}
			}
			subjectSubjectQuery += ") "
		}

		yearLevelCurriculumQuery := ""
		yearLevelSubjectQuery := ""
		if yearLevel != "" {
			if yearLevel == "Year 1" {
				yearLevelCurriculumQuery += "AND child.EducationLevel LIKE '%Year 1%' AND child.EducationLevel NOT LIKE '%Year 10%' "
				yearLevelSubjectQuery += "AND EducationLevel LIKE '%Year 1%' AND EducationLevel NOT LIKE '%Year 10%' "
			} else {
				yearLevelCurriculumQuery += "AND child.EducationLevel LIKE '%" + yearLevel + "%' "
				yearLevelSubjectQuery += "AND EducationLevel LIKE '%" + yearLevel + "%' "
			}

		}

		codeCurriculumQuery := ""
		codeSubjectQuery := ""
		if code != "" {
			codeCurriculumQuery += "AND child.Code LIKE '%" + code + "%' "
			codeSubjectQuery += "AND Code LIKE '%" + code + "%' "
		}

		rows, err := db.Query("SELECT LearningArea, COUNT(Code) FROM Curriculum WHERE StatementLabel = 'Content description' " +
			subjectSubjectQuery + yearLevelSubjectQuery + codeSubjectQuery + "Group By LearningArea ORDER BY LearningArea")
		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		for rows.Next() {
			var subject utils.SubjectTree
			subject.Level = 0
			subject.IsLeaf = true

			err = rows.Scan(&subject.Title, &subject.SubjectNum)

			if err != nil {
				c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
				return
			}

			subjectTree = append(subjectTree, subject)
		}

		rows, err = db.Query("SELECT LearningArea, Subject, COUNT(Code) FROM Curriculum WHERE StatementLabel = " +
			"'Content description' AND LearningArea != Subject " + subjectSubjectQuery + yearLevelSubjectQuery + codeSubjectQuery +
			"Group By LearningArea, Subject ORDER BY LearningArea")
		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		index := 0

		var children []utils.SubjectTree
		for rows.Next() {
			var title string
			var childTitle string
			var count int

			err = rows.Scan(&title, &childTitle, &count)

			if err != nil {
				c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
				return
			}

			for {
				if title == subjectTree[index].Title {
					break
				}

				if len(children) != 0 {
					subjectTree[index].IsLeaf = false
					subjectTree[index].Children = children
					children = []utils.SubjectTree{}
					index++
					continue
				}

				index++
			}

			var subject utils.SubjectTree
			subject.Level = 1
			subject.IsLeaf = true
			subject.Title = childTitle
			subject.SubjectNum = count

			children = append(children, subject)
		}

		if len(children) != 0 {
			subjectTree[index].IsLeaf = false
			subjectTree[index].Children = children
		}

		rows, err = db.Query("SELECT child.Subject, substrand.EducationLevel, strand.Title, substrand.Title, child.Code, child.Description, " +
			"child.CurriculumID, child.LearningArea, child.GeneralCapability " +
			"FROM Curriculum AS child INNER JOIN Curriculum AS substrand " +
			"ON child.StatementLabel = 'Content description' " +
			subjectCurriculumQuery + yearLevelCurriculumQuery + codeCurriculumQuery +
			"AND child.CurriculumID IN " +
			"(SELECT ChildCurriculumID FROM ChildrenCurriculum WHERE FatherCurriculumID = substrand.CurriculumID) " +
			"LEFT JOIN Curriculum AS strand ON strand.CurriculumID IN " +
			"(SELECT FatherCurriculumID FROM ChildrenCurriculum WHERE ChildCurriculumID = substrand.CurriculumID) " +
			"ORDER BY child.Subject, substrand.EducationLevel, strand.Title, substrand.Title, child.Code")
		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		var strandInfors []utils.StrandInfor
		var curriculumInfors []utils.CurriculumInfor
		subject := ""
		yearLevel := ""
		title := ""
		subTitle := ""

		totalNum := 0
		index = 0
		id := 0
		for rows.Next() {
			if index >= left && index <= right {
				subjectTemp := ""
				yearLevelTemp := ""
				titleTemp := ""
				subTitleTemp := ""
				var titleTempNull sql.NullString
				var curriculumInfor utils.CurriculumInfor

				err = rows.Scan(&subjectTemp, &yearLevelTemp, &titleTempNull,
					&subTitleTemp, &curriculumInfor.Code, &curriculumInfor.Description, &curriculumInfor.CurriculumID,
					&curriculumInfor.LearningArea, &curriculumInfor.GeneralCapability)

				if err != nil {
					c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
					return
				}

				titleTemp = titleTempNull.String

				if subject+yearLevel+title+subTitle != subjectTemp+yearLevelTemp+titleTemp+subTitleTemp {
					if len(curriculumInfors) != 0 {
						var strandInfor utils.StrandInfor
						strandInfor.Id = id
						strandInfor.Subject = subject
						strandInfor.YearLevel = yearLevel
						strandInfor.Title = title
						strandInfor.SubTitle = subTitle
						id++

						strandInfor.CurriculumInfors = curriculumInfors
						strandInfors = append(strandInfors, strandInfor)
						curriculumInfors = []utils.CurriculumInfor{}
						strandInfor = utils.StrandInfor{}
					}

					subject = subjectTemp
					yearLevel = yearLevelTemp
					title = titleTemp
					subTitle = subTitleTemp
				}

				curriculumInfors = append(curriculumInfors, curriculumInfor)
			}

			index++
			totalNum++
		}

		if len(curriculumInfors) != 0 {
			var strandInfor utils.StrandInfor
			strandInfor.Id = id
			strandInfor.Subject = subject
			strandInfor.YearLevel = yearLevel
			strandInfor.Title = title
			strandInfor.SubTitle = subTitle

			strandInfor.CurriculumInfors = curriculumInfors
			strandInfors = append(strandInfors, strandInfor)
		}

		getCurriculumReply.StrandInfors = strandInfors
		getCurriculumReply.TotalNum = totalNum
		getCurriculumReply.PageSize = pageSize
		getCurriculumReply.SubjectFilter = subjectTree

		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", getCurriculumReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}
}

// func GetBottomCurriculum(c *gin.Context) {
// 	var curriculumReply utils.CurriculumReply
// 	userId := c.GetHeader("userId")
// 	token := c.GetHeader("token")

// 	subject := c.Query("subject")
// 	subStrand := c.Query("subStrand")
// 	page := c.Query("page")
// 	pageLimit := c.Query("pageLimit")

// 	if authorization.CheckTokenBool(userId, token) {
// 		c.Header("userId", userId)
// 		c.Header("token", token)
// 		db := database.CheckAndGetMYSQL()

// 		pageSize, left, right := utils.CalculatePage(page, pageLimit)

// 		rows, err := db.Query("SELECT CurriculumID, EducationLevel, Description, Code, Subject, Title, StatementLabel, LearningArea FROM curriculum WHERE CurriculumID IN" +
// 			"(SELECT ChildCurriculumID FROM curriculum right join childrencurriculum on CurriculumID = FatherCurriculumID WHERE Subject = \"" +
// 			subject + "\" AND Title = \"" + subStrand + "\")")
// 		if err != nil {
// 			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
// 			return
// 		}

// 		index := 0
// 		totalNum := 0
// 		var curriculums []utils.CurriculumTable
// 		for rows.Next() {
// 			// in goal pages
// 			if index >= left && index <= right {
// 				var curriculum utils.CurriculumTable
// 				err = rows.Scan(&curriculum.CurriculumID, &curriculum.EducationLevel, &curriculum.Description,
// 					&curriculum.Code, &curriculum.Subject, &curriculum.Title, &curriculum.StatementLabel, &curriculum.LearningArea)

// 				if err != nil {
// 					c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
// 					return
// 				}
// 				curriculums = append(curriculums, curriculum)
// 			}

// 			index++
// 			totalNum++
// 		}
// 		curriculumReply.Curriculums = curriculums
// 		curriculumReply.TotalNum = totalNum
// 		curriculumReply.PageSize = pageSize

// 		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", curriculumReply))
// 	} else {
// 		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
// 	}
// }

// func FilterByCode(c *gin.Context) {
// 	var curriculumReply utils.CurriculumReply
// 	userId := c.GetHeader("userId")
// 	token := c.GetHeader("token")

// 	code := c.Query("code")
// 	page := c.Query("page")
// 	pageLimit := c.Query("pageLimit")

// 	if authorization.CheckTokenBool(userId, token) {
// 		c.Header("userId", userId)
// 		c.Header("token", token)
// 		db := database.CheckAndGetMYSQL()

// 		pageSize, left, right := utils.CalculatePage(page, pageLimit)

// 		rows, err := db.Query("SELECT CurriculumID, EducationLevel, Description, Code, Subject, Title, StatementLabel, LearningArea FROM curriculum " +
// 			"WHERE Code LIKE \"%" + code + "%\" ORDER BY Code")

// 		if err != nil {
// 			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
// 			return
// 		}

// 		index := 0
// 		totalNum := 0
// 		var curriculums []utils.CurriculumTable
// 		for rows.Next() {
// 			// in goal pages
// 			if index >= left && index <= right {
// 				var curriculum utils.CurriculumTable
// 				err = rows.Scan(&curriculum.CurriculumID, &curriculum.EducationLevel, &curriculum.Description,
// 					&curriculum.Code, &curriculum.Subject, &curriculum.Title, &curriculum.StatementLabel, &curriculum.LearningArea)

// 				if err != nil {
// 					c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
// 					return
// 				}
// 				curriculums = append(curriculums, curriculum)
// 			}

// 			index++
// 			totalNum++
// 		}
// 		curriculumReply.Curriculums = curriculums
// 		curriculumReply.TotalNum = totalNum
// 		curriculumReply.PageSize = pageSize

// 		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", curriculumReply))
// 	} else {
// 		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
// 	}
// }
