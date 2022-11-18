package database

import (
	"SC-Redback/src/backend/utils"
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path"
	"strings"
	"sync"

	"github.com/PuerkitoBio/goquery"
	"github.com/bitly/go-simplejson"
	_ "github.com/go-sql-driver/mysql"
)

func InputCurriculumData() {
	jsonList, learningAreas := getJSON()
	downloadFile(jsonList, utils.CurriculumPath, learningAreas)
	inputData(utils.CurriculumPath, learningAreas)
}

func inputData(dir string, learningAreas []string) {
	db := CheckAndGetMYSQL()
	files, err := ioutil.ReadDir(dir)
	if err != nil {
		log.Fatal(err)
	}

	for _, f := range files {
		fmt.Println(f.Name())
		learningArea := f.Name()[0 : len(f.Name())-len(path.Ext(f.Name()))]
		jsonFile, err := os.Open(dir + f.Name())
		if err != nil {
			return
		}

		js, err := simplejson.NewFromReader(jsonFile)
		if err != nil {
			panic(err.Error())
		}

		defer jsonFile.Close()
		length := 0
		for {
			if js.GetIndex(length).MustMap() == nil {
				break
			}
			length++
		}

		for i := 0; i < length; i++ {
			var stack Stack
			stack.Push(js.GetIndex(i))

			for {
				if stack.IsEmpty() {
					break
				}
				tmp := stack.Pop()
				statementLabel := tmp.Get("asn_statementLabel").Get("literal").MustString()

				if statementLabel == "Curriculum band" || statementLabel == "Depth study elective" {
					statementLabel = "Year level sub-strand"
				}

				if statementLabel == "Depth study" {
					statementLabel = "Year level strand"
				}

				if statementLabel == "Year level strand" || statementLabel == "Year level sub-strand" ||
					statementLabel == "Content description" {
					educationLevel := tmp.Get("dcterms_educationLevel").Get("prefLabel").MustString()

					if len(tmp.Get("dcterms_educationLevel").MustArray()) != 0 {
						educationLength := len(tmp.Get("dcterms_educationLevel").MustArray())
						education_children := tmp.Get("dcterms_educationLevel")
						educationLevel = ""

						for j := 0; j < educationLength; j++ {
							if j == 0 {
								educationLevel += education_children.GetIndex(j).Get("prefLabel").MustString()
							} else {
								educationLevel += "," + education_children.GetIndex(j).Get("prefLabel").MustString()
							}
						}
					}

					if statementLabel == "Curriculum band" {
						statementLabel = "Year level sub-strand"
					}

					id := tmp.Get("Id").MustString()
					subject := tmp.Get("dcterms_subject").Get("prefLabel").MustString()
					title := tmp.Get("dcterms_title").Get("literal").MustString()

					if statementLabel == "Year level strand" || statementLabel == "Year level sub-strand" ||
						statementLabel == "Curriculum band" {
						_, err = db.Exec("INSERT IGNORE INTO Curriculum(CurriculumID, EducationLevel, Subject, "+
							"StatementLabel, Title, LearningArea) VALUES(?, ?, ?, ?, ?, ?);",
							id, educationLevel, subject, statementLabel, title, learningArea)
						if err != nil {
							log.Fatal(err.Error())
							return
						}
					} else if statementLabel == "Content description" {
						description := tmp.Get("dcterms_description").Get("literal").MustString()
						description = strings.Replace(description, "<p>", "\n", -1)
						description = strings.Replace(description, "</p>", "", -1)

						code := tmp.Get("asn_statementNotation").Get("literal").MustString()
						generalCapability := ""

						if len(tmp.Get("asn_skillEmbodied").MustArray()) != 0 {
							generalCapabilityLength := len(tmp.Get("asn_skillEmbodied").MustArray())
							generalCapability_children := tmp.Get("asn_skillEmbodied")

							for j := 0; j < generalCapabilityLength; j++ {
								if j == 0 {
									generalCapability += generalCapability_children.GetIndex(j).Get("prefLabel").MustString()
								} else {
									generalCapability += "," + generalCapability_children.GetIndex(j).Get("prefLabel").MustString()
								}
							}
						}

						_, err = db.Exec("INSERT IGNORE INTO Curriculum(CurriculumID, EducationLevel, Description, Code, "+
							"Subject, StatementLabel, Title, LearningArea, GeneralCapability) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);",
							id, educationLevel, description, code, subject, statementLabel, title, learningArea, generalCapability)
						if err != nil {
							log.Fatal(err.Error())
							return
						}
					}

					if len(tmp.Get("children").MustArray()) != 0 {
						childrenNum := len(tmp.Get("children").MustArray())
						tmp_children := tmp.Get("children")

						for j := 0; j < childrenNum; j++ {
							_, err = db.Exec("INSERT IGNORE INTO ChildrenCurriculum(FatherCurriculumID, ChildCurriculumID) "+
								"VALUES(?, ?);", id, tmp_children.GetIndex(j).Get("Id").MustString())
							if err != nil {
								log.Fatal(err.Error())
								return
							}
						}
					}
				}

				if len(tmp.Get("children").MustArray()) != 0 {
					childrenNum := len(tmp.Get("children").MustArray())
					tmp_children := tmp.Get("children")

					for j := 0; j < childrenNum; j++ {
						stack.Push(tmp_children.GetIndex(j))
					}
				}
			}
		}
	}

}

func downloadFile(jsonList []string, path string, learningAreas []string) {
	for _, f := range jsonList {
		var url = "https://australiancurriculum.edu.au/static" + f
		var temp = strings.Split(f, "/")
		var fileName = temp[len(temp)-1]

		var outInfo bytes.Buffer
		cmd := exec.Command("wget", url, "-O", path+fileName)
		cmd.Stdout = &outInfo
		cmd.Run()
		fmt.Println(outInfo.String())
	}

	for i := 0; i < len(jsonList); i++ {
		var temp = strings.Split(jsonList[i], "/")
		var fileName = temp[len(temp)-1]
		err := os.Rename(path+fileName, path+learningAreas[i]+".json")
		if err != nil {
			print(err)
		}
	}
}

func getJSON() ([]string, []string) {
	res, err := http.Get("https://rdf.australiancurriculum.edu.au/")
	if err != nil {
		log.Fatal(err)
	}
	defer res.Body.Close()
	if res.StatusCode != 200 {
		log.Fatalf("status code error: %d %s", res.StatusCode, res.Status)
	}

	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		log.Fatal(err)
	}

	var txt = []string{}
	var learningAreas = []string{}
	length := doc.Find("li").Length()
	for i := 0; i < length; i++ {
		temp := strings.TrimSpace(doc.Find("li").Eq(i).Text())
		temp_arr := strings.Split(temp, "\n")
		split_arr := strings.Split(temp_arr[0], " ")
		var learningArea string
		for j := 0; j < len(split_arr); j++ {
			if strings.Contains(split_arr[j], "Download") {
				continue
			} else if strings.Contains(split_arr[j], "(") || strings.Contains(split_arr[j], "F-10") {
				break
			}
			if learningArea == "" {
				learningArea = split_arr[j]
			} else {
				learningArea = learningArea + " " + split_arr[j]
			}
		}
		learningAreas = append(learningAreas, learningArea)
	}
	doc.Find("li").Each(func(i int, s *goquery.Selection) {
		a := s.Find("a")
		a = a.Last()
		href, IsExist := a.Attr("href")
		if IsExist == true {

			href = strings.TrimSpace(href)
			txt = append(txt, href)
		}

	})
	return txt, learningAreas

}

//stack structure
type Item interface{}

type Stack struct {
	items []*simplejson.Json
	mutex sync.Mutex
}

func (stack *Stack) Push(item *simplejson.Json) {
	stack.mutex.Lock()
	defer stack.mutex.Unlock()

	stack.items = append(stack.items, item)
}

func (stack *Stack) Pop() *simplejson.Json {
	stack.mutex.Lock()
	defer stack.mutex.Unlock()

	if len(stack.items) == 0 {
		return nil
	}

	lastItem := stack.items[len(stack.items)-1]
	stack.items = stack.items[:len(stack.items)-1]

	return lastItem
}

func (stack *Stack) IsEmpty() bool {
	stack.mutex.Lock()
	defer stack.mutex.Unlock()

	return len(stack.items) == 0
}

func (stack *Stack) Reset() {
	stack.mutex.Lock()
	defer stack.mutex.Unlock()

	stack.items = nil
}

func (stack *Stack) Peek() Item {
	stack.mutex.Lock()
	defer stack.mutex.Unlock()

	if len(stack.items) == 0 {
		return nil
	}

	return stack.items[len(stack.items)-1]
}
