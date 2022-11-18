package utils

import (
	"database/sql"
)

var Connection ConnectionObject

type UserToken struct {
	UserId    string
	PasetoKey string
	Token     string
}

type ConnectionObject struct {
	username string
	password string
	dbName   string
	port     string
	host     string
}

type UserTable struct {
	Userid       int
	Email        string
	Passwordhash string
	Status       string
}

type AcitivityOverview struct {
	ActivityID  int
	QuestName   string
	FolderName  string
	MapStatus   string
	QuestTypes  []string
	CreateDate  string
	ResourceUrl string
	YearLevels  []YearLevelTable
	ImageSrc    string
	Realm       RealmTable
}

type YearLevelTable struct {
	YearLevelID   int
	YearLevelName string
}

type AudienceRoleTable struct {
	AudienceRoleID   int
	AudienceRoleName string
}

type AcitivityTable struct {
	ActivityID          int
	QuestName           string
	QuestType           string
	ResourceUrl         sql.NullString
	Link                sql.NullString
	CreateDate          string
	QuestionSpoken      sql.NullString
	RealmName           sql.NullString
	TopicName           sql.NullString
	KeyConceptName      sql.NullString
	ContentDescription  sql.NullString
	Outcomes            sql.NullString
	AgeRangeName        sql.NullString
	ScientistName       sql.NullString
	FieldName           sql.NullString
	MappingPersonName   sql.NullString
	MappingPersonEmail  sql.NullString
	FolderName          sql.NullString
	RealWorldConnection sql.NullString
	PurposeName         sql.NullString
	AuthorTitle         sql.NullString
	InstitutionName     sql.NullString
	AuthorEmail         sql.NullString
	AuthorPhone         sql.NullString
	CountryName         sql.NullString
	MappingPersonPhone  sql.NullString
	MapDate             string
	MapStatus           string
}

type FolderTable struct {
	FolderID   int
	FolderName string
}

type RealmTable struct {
	RealmID   int
	RealmName string
}

type TopicTable struct {
	TopicID   int
	TopicName string
}

type KeyConceptTable struct {
	KeyConceptID   int
	KeyConceptName string
}

type PurposeTable struct {
	PurposeID   int
	PurposeName string
}

type AgeRangeTable struct {
	AgeRangeID   int
	AgeRangeName string
}

type CountryTable struct {
	CountryID   int
	CountryName string
}

type ScientistTable struct {
	ScientistID   int
	ScientistName string
}

type InstitutionTable struct {
	InstitutionID   int
	InstitutionName string
}

type FieldTable struct {
	FieldID   int
	FieldName string
}

type CurriculumTable struct {
	CurriculumID        string
	EducationLevel      string
	Description         string
	Code                string
	Subject             string
	Title               string
	StatementLabel      string
	LearningArea        string
	GeneralCapabilities string
}

type TitleTable struct {
	Title string
}

type FileTable struct {
	FileID   int
	FileName string
	DiskName string
}

func GetDSN() string {
	return Connection.username + ":" + Connection.password + "@(" +
		Connection.host + ":" + Connection.port + ")/" +
		Connection.dbName
}
