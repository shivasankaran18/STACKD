package prompt_fb

import(
	"fmt"
	"os"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

type UIResponse string

const (
	TailwindCSS UIResponse = "TailwindCSS"
	ShadCN UIResponse = "TailwindCSS + ShadCN"
	UI_None UIResponse = "None"
)

type uiModel struct {
	cursor   int
	choices  []string
	selected bool
	result   string
	cancel   bool
}

func (m uiModel) Init() tea.Cmd {
	return nil
}

func (m uiModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
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

func (m uiModel) View() string {
	labelStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("13")).Bold(true).Background(lipgloss.Color("0")).Padding(0, 1)
	optionStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("7")).Padding(0, 2)
	selectedStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("15")).Background(lipgloss.Color("13")).Bold(true).Padding(0, 2).Border(lipgloss.RoundedBorder(), true).BorderForeground(lipgloss.Color("13"))
	borderStyle := lipgloss.NewStyle().Border(lipgloss.RoundedBorder()).BorderForeground(lipgloss.Color("13")).Padding(1, 2)
	bgStyle := lipgloss.NewStyle().Background(lipgloss.Color("0"))

	if m.selected {
		return labelStyle.Render("You chose:") + "\n" + selectedStyle.Render(m.result) + "\n"
	}
	out := labelStyle.Render("🎨 Choose a UI Framework") + "\n\n"
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

func AskUI() UIResponse {
	uiOptions := []string{
		string(TailwindCSS),
		string(ShadCN),
		string(UI_None),
	}
	m := uiModel{choices: uiOptions}
	p := tea.NewProgram(m)
	finalModel, err := p.Run()
	if err != nil {
		fmt.Printf("Prompt failed %v\n", err)
		os.Exit(1)
		return ""
	}
	mod := finalModel.(uiModel)
	if mod.cancel {
		os.Exit(1)
		return ""
	}
	if mod.selected {
		return UIResponse(mod.result)
	}
	return UI_None
}
