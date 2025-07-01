package promptmr
import (
	"fmt"
	"os"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

type MonoRepoResponse string

const (
	Turborepo MonoRepoResponse = "Turborepo"
	Monorepo_None MonoRepoResponse = "None"
)

type monorepoModel struct {
	cursor   int
	choices  []string
	selected bool
	result   string
	cancel   bool
}

func (m monorepoModel) Init() tea.Cmd {
	return nil
}

func (m monorepoModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "ctrl+c", "q":
			m.cancel = true
			return m, tea.Quit
		case "up", "k":
			m.cursor--
		case "down", "j":
			m.cursor++
		case "enter":
			m.selected = true
			m.result = m.choices[m.cursor]
			return m, tea.Quit
		}
	}
	return m, nil
}

func (m monorepoModel) View() string {
	labelStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("14")).Bold(true).Background(lipgloss.Color("0")).Padding(0, 1)
	optionStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("7")).Padding(0, 2)
	selectedStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("15")).Background(lipgloss.Color("12")).Bold(true).Padding(0, 2).Border(lipgloss.RoundedBorder(), true).BorderForeground(lipgloss.Color("12"))
	borderStyle := lipgloss.NewStyle().Border(lipgloss.RoundedBorder()).BorderForeground(lipgloss.Color("14")).Padding(1, 2)
	bgStyle := lipgloss.NewStyle().Background(lipgloss.Color("0"))

	if m.selected {
		return labelStyle.MarginTop(0).Render("You chose:") + "\n" + selectedStyle.Render(m.result) + "\n" + lipgloss.NewStyle().Foreground(lipgloss.Color("8")).Render("Press q to quit.")
	}
	out := labelStyle.Render("🎨 Choose a Monorepo Framework") + "\n\n"
	var options string
	for i, choice := range m.choices {
		cursor := "  "
		style := optionStyle
		if m.cursor==i {
			cursor = "> "
			style = selectedStyle
		}
		options += style.Render(cursor + choice) + "\n"
	}
	list := borderStyle.Render(options)
	out += bgStyle.Render(list)
out += "\n" + lipgloss.NewStyle().Foreground(lipgloss.Color("8")).Render("Press q to quit.")
	return out
}

func AskMonoRepo() MonoRepoResponse{
	monorepoOptions := []string{
		string(Turborepo),
		string(Monorepo_None),
	}
	m := monorepoModel{choices:monorepoOptions}
	p:=tea.NewProgram(m)
	finalModel, err := p.Run()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error running program: %v\n", err)
		os.Exit(1)
		return Monorepo_None

	}
	if m.cancel {
		os.Exit(1)
		return Monorepo_None
	}
	mod := finalModel.(monorepoModel)
	if mod.selected{
		return MonoRepoResponse(mod.result)
	}
	return Monorepo_None
}

