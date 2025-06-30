package prompt

import (
	"fmt"
	"os"

	"github.com/charmbracelet/bubbles/textinput"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

type dbURLModel struct {
	input  textinput.Model
	cancel bool
	err    error
}

func initialDBURLModel(dbType DbTypeResponse) dbURLModel {
	ti := textinput.New()
	switch dbType {
	case Postgres:
		ti.Placeholder = "postgresql://user:password@host:port/dbname"
	case MySQL:
		ti.Placeholder = "mysql://user:password@host:port/dbname"
	case MongoDB:
		ti.Placeholder = "mongodb://user:password@host:port/dbname"
	default:
		ti.Placeholder = "postgresql://user:password@host:port/dbname"
	}
	ti.Focus()
	ti.CharLimit = 256
	ti.Width = 50
	return dbURLModel{input: ti}
}

func (m dbURLModel) Init() tea.Cmd {
	return textinput.Blink
}

func (m dbURLModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "ctrl+c", "esc":
			m.cancel = true
			return m, tea.Quit
		case "enter":
			if m.input.Value() == "" {
				m.err = fmt.Errorf("Database URL cannot be empty")
				return m, nil
			}
			return m, tea.Quit
		}
	}

	var cmd tea.Cmd
	m.input, cmd = m.input.Update(msg)
	m.err = nil
	return m, cmd
}

func (m dbURLModel) View() string {
	title := lipgloss.NewStyle().Foreground(lipgloss.Color("#FFD700")).Bold(true).Render("🔗 Enter the Database URL")
	inputBox := lipgloss.NewStyle().Border(lipgloss.RoundedBorder()).Padding(0, 1).MarginBottom(1)

	if m.err != nil {
		errorStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#FF0000"))
		errorView := errorStyle.Render(m.err.Error())
		inputBox = inputBox.BorderForeground(lipgloss.Color("#FF0000"))
		return fmt.Sprintf("%s\n\n%s\n%s", title, inputBox.Render(m.input.View()), errorView)
	}

	inputBox = inputBox.BorderForeground(lipgloss.Color("#00FA9A"))

	return fmt.Sprintf("%s\n\n%s", title, inputBox.Render(m.input.View()))
}

func AskDatabaseURL(dbType DbTypeResponse) string {
	p := tea.NewProgram(initialDBURLModel(dbType))
	m, err := p.Run()
	if err != nil {
		fmt.Println("Prompt failed:", err)
		os.Exit(1)
	}

	model := m.(dbURLModel)

	if model.cancel {
		fmt.Println("here")
		os.Exit(1)
		return ""
	}

	return model.input.Value()
}
