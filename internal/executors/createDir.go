package executors

import(
	"os"
)

func CreateDirectories(dir string){
	if dir == "" {
		os.Exit(1)
		return
	}

	err:= os.MkdirAll(dir, os.ModePerm)
	if err != nil {
		os.Exit(1)
		return
	}

	
}
