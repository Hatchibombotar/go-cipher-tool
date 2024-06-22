package main

import (
	"context"
	"fmt"

	"github.com/Hatchibombotar/go-cipher/analysis"
	"github.com/Hatchibombotar/go-cipher/cipher"
	"github.com/Hatchibombotar/go-cipher/format"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (a *App) startup(ctx context.Context) {
	// Perform your setup here
	a.ctx = ctx
}

// domReady is called after front-end resources have been loaded
func (a App) domReady(ctx context.Context) {
	// Add your action here
}

// beforeClose is called when the application is about to quit,
// either by clicking the window close button or calling runtime.Quit.
// Returning true will cause the application to continue, false will continue shutdown as normal.
func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	return false
}

// shutdown is called at application termination
func (a *App) shutdown(ctx context.Context) {
	// Perform your teardown here
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) CountMonograms(text string) map[string]int {
	mongrams := analysis.CountMonograms(text)
	return mongrams
}

func (a *App) DecodeCaesarCipher(text string, steps int) string {
	decoded := cipher.DecodeCaesarCipher(text, steps)
	return decoded
}
func (a *App) DecodeSubsitutionCipher(text string, substitutions map[rune]rune) string {
	decoded := cipher.SubstitutionCipher(text, substitutions)
	return decoded
}

func (a *App) MonogramIndexOfCoincidence(text string) float64 {
	ioc := analysis.MonogramIndexOfCoincidence(text)
	return ioc
}

func (a *App) Format(str string, options format.FormatOptions) string {
	formatted := format.FormatString(str, &options)
	return formatted
}
