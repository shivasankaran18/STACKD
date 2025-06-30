/*
Copyright © 2025 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"os"
	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "stackd",
	Short: "STACKD - Full Stack Project Generator",
	Long: "STACKD is a CLI tool to scaffold full stack projects with various configurations.It supports multiple front-end and back-end frameworks and  database configurations",
}

func Execute() {
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}

func init() {

	rootCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
