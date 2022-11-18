package utils

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

/**
	Read .env file and store in os.environment
 	this data can then be accessed through os.Getenv()
	reference from science island portal
*/
func ReadEnv(filename string) error {
	root, _ := os.Getwd()
	file, err := os.Open(root + "/" + filename)
	if err != nil {
		fmt.Println(err)
		return err
	}
	defer file.Close()

	bf := bufio.NewReader(file)
	line, err := bf.ReadString('\n')
	if err != nil {
		return err
	}

	for line != "" {
		if 1 == strings.Count(line, "=") {
			env := strings.SplitAfter(line, "=")
			env[0], env[1] = strings.Trim(env[0], " "),
				strings.Trim(env[1], " ")
			err = os.Setenv(strings.Trim(env[0], "="),
				strings.Trim(env[1], "\r\n"))
		}
		if nil != err {
			fmt.Println(err)
		}
		line, err = bf.ReadString('\n')
	}
	return nil
}
