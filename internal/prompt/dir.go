

package prompt

import (
	"fmt"
	"os"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/bubbles/textinput"
	"github.com/charmbracelet/lipgloss"
)

type dirModel struct {
	input textinput.Model
	cancel  bool
}

func initialDirModel() dirModel {
	ti := textinput.New()
	ti.Placeholder = "./my-app"
	ti.Focus()
	ti.CharLimit = 64
	ti.Width = 30
	return dirModel{input: ti}
}

func (m dirModel) Init() tea.Cmd {
	return textinput.Blink
}

func (m dirModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "ctrl+c", "esc":
			m.cancel = true
			return m, tea.Quit
		case "enter":
			m.cancel = false
			return m, tea.Quit
		}
	}
	var cmd tea.Cmd
	m.input, cmd = m.input.Update(msg)
	return m, cmd
}

func (m dirModel) View() string {
	title := lipgloss.NewStyle().Foreground(lipgloss.Color("#FFD700")).Bold(true).Render("📁 Enter project directory")
	inputBox := lipgloss.NewStyle().Foreground(lipgloss.Color("#00FA9A")).Border(lipgloss.RoundedBorder()).Padding(0, 1).Render(m.input.View())
	return fmt.Sprintf("%s\n\n%s", title, inputBox)
}

func AskDirectory() string {
	p := tea.NewProgram(initialDirModel())
	m, err := p.Run()
	if err != nil {
		fmt.Println("Prompt failed:", err)
		os.Exit(1)
	}
	if m.(dirModel).cancel {
		os.Exit(1)
		return ""
	}
	return m.(dirModel).input.Value()
}
