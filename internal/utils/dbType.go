package utils
import (
	"fmt"
	"os"

	"github.com/charmbracelet/bubbles/textinput"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

type DbTypeResponse string

const (
	Postgres DbTypeResponse = "postgresql"
	MySQL    DbTypeResponse = "mysql"
	MongoDB  DbTypeResponse = "mongodb"
	DB_None  DbTypeResponse = "NoDB"
)
type dbTypeModel struct {
	input textinput.Model
	cancel bool
	cursor int
	choices []string
	selected bool
	result string
}



func (m dbTypeModel) Init() tea.Cmd {
	return nil
}

func (m dbTypeModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "ctrl+c", "q", "esc":
			m.cancel = true
			return m, tea.Quit
		case "enter":
			m.selected = true
			m.result = m.choices[m.cursor]
			return m, tea.Quit
		
		case "up", "k":
			if m.cursor > 0 {
				m.cursor--
			}
		case "down", 	"j":
			if m.cursor < len(m.choices)-1 {
				m.cursor++
			}
		}

	}

	return m, nil
}

func (m dbTypeModel) View() string {
	labelStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("14")).Bold(true).Background(lipgloss.Color("0")).Padding(0, 1)
	optionStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("7")).Padding(0, 2)
	selectedStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("15")).Background(lipgloss.Color("12")).Bold(true).Padding(0, 2).Border(lipgloss.RoundedBorder(), true).BorderForeground(lipgloss.Color("12"))
	borderStyle := lipgloss.NewStyle().Border(lipgloss.RoundedBorder()).BorderForeground(lipgloss.Color("14")).Padding(1, 2)
	bgStyle := lipgloss.NewStyle().Background(lipgloss.Color("0"))

	if m.selected {
		return labelStyle.Render("You chose:") + "\n" + selectedStyle.Render(m.result) + "\n"
	}
	out := labelStyle.Render("💾 Choose a Database Type") + "\n\n"

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

func AskDatabaseType() DbTypeResponse {
	dbTypeOptions := []string{
		string(Postgres),
		string(MySQL),
		string(MongoDB),
		string(DB_None),
	}
	m := dbTypeModel{choices: dbTypeOptions}
	p := tea.NewProgram(m)
	finalModel, err := p.Run()
	if err != nil {
		fmt.Printf("Prompt failed %v\n", err)
		os.Exit(1)
		return ""
	}
	mod := finalModel.(dbTypeModel)
	if mod.selected {
		return DbTypeResponse(mod.result)
	}
	return DB_None
}
