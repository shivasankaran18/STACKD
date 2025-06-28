/*
Copyright © 2025 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"
	"os"

	"github.com/charmbracelet/lipgloss"
	"github.com/common-nighthawk/go-figure"
	"github.com/spf13/cobra"
	"github.com/shivasankaran18/STACKD/internal"
)

var rootCmd = &cobra.Command{
	Use:   "STACKD",
	Short: "A brief description of your application",
	Long: `A longer description that spans multiple lines and likely contains
examples and usage of using your application. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	Run: func(cmd *cobra.Command, args []string) {
		printBanner()
		internal.Scaffold()
	},
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

func printBanner() {
	fig := figure.NewFigure("STACKD", "", true)
	banner := fig.String()

	bannerStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#00FA9A")).Bold(true).Align(lipgloss.Center).Padding(1, 2)
	styledBanner := bannerStyle.Render(banner)

	descStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#FFD700")).Bold(true)
	desc := descStyle.Render("🚀 Full Stack Project Generator")

	dividerStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#00CED1")).Bold(true)
	divider := dividerStyle.Render("\n" + "="+string(make([]rune, 50))+"=" + "\n")
	divider = dividerStyle.Render("\n==================================================\n")

	promptStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#A9A9F5")).Bold(true)
	prompt := promptStyle.Render("\u2714\ufe0f Choose your preferred interface: ") + lipgloss.NewStyle().Foreground(lipgloss.Color("#4682B4")).Bold(true).Render("CLI Interface")

	fmt.Println(styledBanner)
	fmt.Println(desc)
	fmt.Println(divider)
	fmt.Println(prompt)
}
