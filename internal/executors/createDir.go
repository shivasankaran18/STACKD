package executors

import(
	"os"
)

func CreateDirectories(dir string){
	if dir == "" {
		os.Exit(1)
		return
	}

	var arr []string = []string{"frontend", "backend"}
	var pos int = 0
	for pos < len(arr) {
		path := dir + "/" + arr[pos]

		err := os.MkdirAll(path, os.ModePerm)
		if err != nil {
			os.Exit(1)
			return
		}
		pos++
	}
}
