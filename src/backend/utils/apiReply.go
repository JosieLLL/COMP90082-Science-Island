package utils

import "strconv"

type Reply struct {
	Code int
	Msg  string
	Data interface{}
}

type ActivityPoolReply struct {
	TotalNum   int
	PageSize   int
	Activities []AcitivityOverview
}

type ActivityReply struct {
	ActivityID          int
	QuestName           string
	QuestTypes          []string
	ResourceUrl         string
	Link                string
	CreateDate          string
	QuestionSpoken      string
	RealmName           string
	TopicName           string
	KeyConceptName      string
	ContentDescription  string
	Outcomes            string
	AgeRangeName        string
	ScientistName       string
	FieldName           string
	MappingPersonName   string
	MappingPersonEmail  string
	FolderName          string
	RealWorldConnection string
	PurposeName         string
	AuthorTitle         string
	InstitutionName     string
	AuthorEmail         string
	AuthorPhone         string
	CountryName         string
	MappingPersonPhone  string
	MapDate             string
	MapStatus           string
	Curriculums         []CurriculumTable
	AudienceRoles       []AudienceRoleTable
	Files               []FileTable
	YearLevels          []YearLevelTable
}

type ExistFolderReply struct {
	Folders []FolderTable
}

type NewFolderReply struct {
	FolderID   string
	FolderName string
}

type ExistRealmReply struct {
	Realms []RealmTable
}

type NewRealmReply struct {
	RealmID   string
	RealmName string
}

type ExistTopicReply struct {
	Topics []TopicTable
}

type NewTopicReply struct {
	TopicID   string
	TopicName string
}

type ExistKeyConceptReply struct {
	KeyConcepts []KeyConceptTable
}

type NewKeyConceptReply struct {
	KeyConceptID   string
	KeyConceptName string
}

type ExistPurposeReply struct {
	Purposes []PurposeTable
}

type NewPurposeReply struct {
	PurposeID   string
	PurposeName string
}

type ExistAgeRangeReply struct {
	AgeRanges []AgeRangeTable
}

type NewAgeRangeReply struct {
	AgeRangeID   string
	AgeRangeName string
}

type ExistScientistReply struct {
	Scientists []ScientistTable
}

type NewScientistReply struct {
	ScientistID   string
	ScientistName string
}

type ExistInstitutionReply struct {
	Institutions []InstitutionTable
}

type NewInstitutionReply struct {
	InstitutionID   string
	InstitutionName string
}

type ExistFieldReply struct {
	Fields []FieldTable
}

type NewFieldReply struct {
	FieldID   string
	FieldName string
}

type ExistCountryReply struct {
	Countries []CountryTable
}

type NewCountryReply struct {
	CountryID   string
	CountryName string
}

type GetCurriculumReply struct {
	TotalNum      int
	PageSize      int
	StrandInfors  []StrandInfor
	SubjectFilter []SubjectTree
}

type StrandInfor struct {
	Id               int
	Subject          string
	YearLevel        string
	Title            string
	SubTitle         string
	CurriculumInfors []CurriculumInfor
}

type CurriculumInfor struct {
	CurriculumID      string
	LearningArea      string
	GeneralCapability string
	Code              string
	Description       string
}

type SubjectTree struct {
	Title      string
	SubjectNum int
	Level      int
	IsLeaf     bool
	Children   []SubjectTree
}

type UploadReply struct {
	FileID   int
	FileName string
}

type AttachFileReply struct {
	FileIDs    string
	ActivityID int
}

func ConstructReply(code int, msg string, data interface{}) Reply {
	var reply Reply
	reply.Code = code
	reply.Msg = msg
	reply.Data = data
	return reply
}

func CalculatePage(page string, pageLimit string) (int, int, int) {
	if page == "" {
		page = "1"
	}

	if pageLimit == "" {
		pageLimit = "10"
	}

	pageInt, _ := strconv.Atoi(page)
	pageLimitInt, _ := strconv.Atoi(pageLimit)

	offset := (pageInt - 1) * pageLimitInt

	return pageLimitInt, offset, offset + pageLimitInt - 1
}
