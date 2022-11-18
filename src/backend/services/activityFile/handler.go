package activityFile

import (
	"SC-Redback/src/backend/database"
	"SC-Redback/src/backend/services/authorization"
	"SC-Redback/src/backend/utils"
	"net/http"
	"path"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func UploadFile(c *gin.Context) {
	var uploadReply utils.UploadReply

	userId := c.GetHeader("userId")
	token := c.GetHeader("token")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)

		mySQLDB := database.CheckAndGetMYSQL()

		file, _ := c.FormFile("file")
		if file == nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "File is not uploaded", nil))
			return
		}

		// get new file name for avoiding duplicate name
		diskName := utils.NewUUID() + path.Ext(file.Filename)
		duplicateCount := 0
		for {
			rows, err := mySQLDB.Query("SELECT FileID, FileName FROM Files WHERE DiskName = \"" + diskName + "\" LIMIT 1")
			if err == nil && !rows.Next() {
				break
			} else if err != nil {
				c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
				return
			}

			duplicateCount++
			if duplicateCount > 5 {
				break
			}

			diskName = utils.NewUUID() + path.Ext(file.Filename)
		}

		_, err := mySQLDB.Exec("INSERT INTO Files (FileName, DiskName) VALUES(?, ?);", file.Filename, diskName)
		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		// get fileid
		rows, err := mySQLDB.Query("SELECT FileID, FileName FROM Files WHERE DiskName = \"" + diskName + "\" LIMIT 1")
		if err != nil || (err == nil && !rows.Next()) {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		c.SaveUploadedFile(file, utils.FilePath+diskName) // save file in server

		var fileTable utils.FileTable
		err = rows.Scan(&fileTable.FileID, &fileTable.FileName)
		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		uploadReply.FileID = fileTable.FileID
		uploadReply.FileName = fileTable.FileName
		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", uploadReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}
}

func AttachFiles(c *gin.Context) {
	var attachFileReply utils.AttachFileReply

	userId := c.GetHeader("userId")
	token := c.GetHeader("token")

	activityId := c.PostForm("activityId")
	fileIds := c.PostForm("fileIds")
	folderId := c.PostForm("folderId")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)

		mySQLDB := database.CheckAndGetMYSQL()

		if fileIds == "" {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "fileIds is empty", nil))
			return
		}

		trx, err := mySQLDB.Begin()
		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		if folderId != "" {
			_, err = trx.Exec("UPDATE Quest SET FolderID = " + folderId + " WHERE QuestID = " + activityId)
			if err != nil {
				c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Activity or Folder Not Exist", nil))
				return
			}
		}

		fileIdSlice := strings.Split(fileIds, ",")
		for _, fileid := range fileIdSlice {
			rows, err := trx.Query("SELECT * FROM FilesInQuest WHERE QuestID = " + activityId + " AND FileID = " + fileid + " LIMIT 1")
			if err != nil {
				trx.Rollback()
				c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
				return
			} else if err == nil && rows.Next() {
				// combination already exist, successful
				attachFileReply.FileIDs = fileIds
				activityid_int, _ := strconv.Atoi(activityId)
				attachFileReply.ActivityID = activityid_int
				c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", attachFileReply))
				return
			}

			_, err = trx.Exec("INSERT INTO FilesInQuest (FileID, QuestID) VALUES(?, ?);", fileid, activityId)

			if err != nil {
				trx.Rollback()
				c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
				return
			}
		}

		err = trx.Commit()
		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		attachFileReply.FileIDs = fileIds
		activityid_int, _ := strconv.Atoi(activityId)
		attachFileReply.ActivityID = activityid_int
		c.JSON(http.StatusOK, utils.ConstructReply(http.StatusOK, "Successful", attachFileReply))
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}
}

func DownloadFile(c *gin.Context) {
	userId := c.GetHeader("userId")
	token := c.GetHeader("token")

	fileId := c.Query("fileId")
	activityId := c.Query("activityId")

	if authorization.CheckTokenBool(userId, token) {
		c.Header("userId", userId)
		c.Header("token", token)
		mySQLDB := database.CheckAndGetMYSQL()

		rows, err := mySQLDB.Query("SELECT FileName, DiskName FROM Files, FilesInQuest WHERE QuestID = " + activityId +
			" AND FilesInQuest.FileID = Files.FileID AND Files.FileID = " + fileId + " LIMIT 1")

		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		} else if err == nil && !rows.Next() {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "File or Activity not exist", nil))
			return
		}

		var fileName string
		var diskName string
		err = rows.Scan(&fileName, &diskName)
		if err != nil {
			c.JSON(http.StatusBadRequest, utils.ConstructReply(http.StatusBadRequest, "Database Error", nil))
			return
		}

		filePath := utils.FilePath + diskName
		c.Header("Content-Description", "File Transfer")
		c.Header("Content-Transfer-Encoding", "binary")
		c.Header("Content-Disposition", "attachment; filename="+fileName)
		c.Header("Content-Type", "Out-Stream")
		// c.Header("Content-Type", "application/octet-stream")
		c.File(filePath)
	} else {
		c.JSON(http.StatusUnauthorized, utils.ConstructReply(http.StatusUnauthorized, "Unauthorized", nil))
	}
}
