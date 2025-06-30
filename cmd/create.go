package cmd
import (
	"fmt"
	"github.com/charmbracelet/lipgloss"
	"github.com/spf13/cobra"
	"github.com/shivasankaran18/STACKD/internal"
)

var createCmd = &cobra.Command{
	Use:   "create",
	Short: "Create a new full stack project",
	Long: "Create a new full stack project with the specified configuration.",
	Run: func(cmd *cobra.Command, args []string) {
		printBanner()
		internal.Scaffold()
	},

}

func init() {
	rootCmd.AddCommand(createCmd)
}

func printBanner() {
	banner := `
     ██████╗████████╗ █████╗  ██████╗██╗  ██╗'██████╗ 
    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝██╔══██╗
    ╚█████╗    ██║   ███████║██║     █████═╝ ██║  ██║
     ╚═══██╗   ██║   ██╔══██║██║     ██╔═██╗ ██║  ██║
    ██████╔╝   ██║   ██║  ██║╚██████╗██║  ██╗██████╔╝
    ╚═════╝    ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═════╝ 
`	

	bannerStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#00FA9A")).Bold(true).Align(lipgloss.Center).Padding(1, 2)
	styledBanner := bannerStyle.Render(banner)

	descStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#FFD700")).Bold(true)
	desc := descStyle.Render("🚀 Full Stack Project Generator")

	dividerStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#00CED1")).Bold(true)
	divider := dividerStyle.Render("\n" + "="+string(make([]rune, 50))+"=" + "\n")
	divider = dividerStyle.Render("\n==================================================\n")


	fmt.Println(styledBanner)
	fmt.Println(desc)
	fmt.Println(divider)
}
