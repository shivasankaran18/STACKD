package prompt

import (
	"fmt"
	"os"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

type BackendResponse string

const (
	ExpressJS    BackendResponse = "ExpressJS"
	ExpressTS    BackendResponse = "ExpressTS"
	Backend_None BackendResponse = "None"
)

type backendModel struct {
	cursor   int
	choices  []string
	selected bool
	result   string
	cancel   bool
}

func (m backendModel) Init() tea.Cmd {
	return nil
}

func (m backendModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "ctrl+c", "q", "esc":
			m.cancel = true
			return m, tea.Quit
		case "up", "k":
			if m.cursor > 0 {
				m.cursor--
			}
		case "down", "j":
			if m.cursor < len(m.choices)-1 {
				m.cursor++
			}
		case "enter":
			m.selected = true
			m.result = m.choices[m.cursor]
			return m, tea.Quit
		}
	}
	return m, nil
}

func (m backendModel) View() string {
	labelStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("11")).Bold(true).Background(lipgloss.Color("0")).Padding(0, 1)
	optionStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("7")).Padding(0, 2)
	selectedStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("0")).Background(lipgloss.Color("11")).Bold(true).Padding(0, 2).Border(lipgloss.RoundedBorder(), true).BorderForeground(lipgloss.Color("11"))
	borderStyle := lipgloss.NewStyle().Border(lipgloss.RoundedBorder()).BorderForeground(lipgloss.Color("11")).Padding(1, 2)
	bgStyle := lipgloss.NewStyle().Background(lipgloss.Color("0"))

	if m.selected {
		return labelStyle.Render("You chose:") + "\n" + selectedStyle.Render(m.result) + "\n"
	}
	out := labelStyle.Render("🖥️ Choose a Backend Framework") + "\n\n"
	var options string
	for i, choice := range m.choices {
		cursor := "  "
		style := optionStyle
		if m.cursor == i {
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

func AskBackend() BackendResponse {
	backendOptions := []string{
		string(ExpressJS),
		string(ExpressTS),
		string(Backend_None),
	}
	m := backendModel{choices: backendOptions}
	p := tea.NewProgram(m)
	finalModel, err := p.Run()
	if err != nil {
		fmt.Printf("Prompt failed %v\n", err)
		os.Exit(1)
		return ""
	}
	mod := finalModel.(backendModel)
	if mod.cancel {
		os.Exit(1)
		return ""
	}
	if mod.selected {
		return BackendResponse(mod.result)
	}
	return Backend_None
}
