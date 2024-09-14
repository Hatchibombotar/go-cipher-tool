package main

import (
	"errors"
	"fmt"
	"time"

	"syscall/js"

	"github.com/Hatchibombotar/go-cipher/analysis"
	"github.com/Hatchibombotar/go-cipher/cipher"
	"github.com/Hatchibombotar/go-cipher/format"
)

func CreatePromiseFunc(name string, f func(js.Value, []js.Value) (js.Value, error)) {
	oncall := func(this js.Value, p []js.Value) interface{} {
		handler := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
			resolve := args[0]
			reject := args[1]

			go func() {
				result, err := f(this, p)

				if err == nil {
					resolve.Invoke(result)
				} else {
					reject.Invoke(err)
				}
			}()

			return nil
		})

		promiseConstructor := js.Global().Get("Promise")
		return promiseConstructor.New(handler)
	}

	js.Global().Set(name, js.FuncOf(oncall))
}

func ReadRuneMapValue(v js.Value) (map[rune]rune, error) {
	newMap := make(map[rune]rune)

	if v.Type() != js.TypeObject {
		return nil, errors.New("Type is not an object.")
	}

	keys := js.Global().Get("Object").Call("keys", v)

	for i := range keys.Length() {
		key := keys.Index(i)

		keyRune := rune(js.Global().Call("Number", key).Int())
		valRune := rune(js.Global().Call("Number", v.Get(key.String())).Int())

		newMap[keyRune] = valRune
	}

	return newMap, nil
}

func main() {

	c := make(chan struct{}, 0)

	CreatePromiseFunc("MonogramIndexOfCoincidence", func(this js.Value, args []js.Value) (js.Value, error) {
		text := args[0].String()
		ioc, err := analysis.MonogramIndexOfCoincidence(text)
		return js.ValueOf(ioc), err
	})

	CreatePromiseFunc("CountMonograms", func(this js.Value, args []js.Value) (js.Value, error) {
		text := args[0].String()
		monograms := analysis.CountMonograms(text)

		convertedMonograms := make(map[string]interface{})

		for key, value := range monograms {
			convertedMonograms[key] = value
		}

		return js.ValueOf(convertedMonograms), nil
	})

	CreatePromiseFunc("DecodeCaesarCipher", func(this js.Value, args []js.Value) (js.Value, error) {
		text := args[0].String()
		steps := args[1].Int()

		decoded := cipher.DecodeCaesarCipher(text, steps)

		return js.ValueOf(decoded), nil
	})
	CreatePromiseFunc("DecodeSubsitutionCipher", func(this js.Value, args []js.Value) (js.Value, error) {
		text := args[0].String()
		substitutions, _ := ReadRuneMapValue(args[1])

		decoded := cipher.SubstitutionCipher(text, substitutions)
		return js.ValueOf(decoded), nil
	})

	CreatePromiseFunc("MonogramIndexOfCoincidence", func(this js.Value, args []js.Value) (js.Value, error) {
		text := args[0].String()
		ioc, err := analysis.MonogramIndexOfCoincidence(text)
		return js.ValueOf(ioc), err
	})

	CreatePromiseFunc("Format", func(this js.Value, args []js.Value) (js.Value, error) {
		text := args[0].String()

		CaseMode := format.FormattingMode(args[1].Get("CaseMode").Int())
		RemoveUnknown := args[1].Get("RemoveUnknown").Bool()

		formatted := format.FormatString(text, &format.FormatOptions{
			CaseMode:      CaseMode,
			RemoveUnknown: RemoveUnknown,
		})
		return js.ValueOf(formatted), nil
	})

	CreatePromiseFunc("InferSpaces", func(this js.Value, args []js.Value) (js.Value, error) {
		text := args[0].String()
		return js.ValueOf(format.InferSpaces(text)), nil
	})

	CreatePromiseFunc("ColumnarTransposition", func(this js.Value, args []js.Value) (js.Value, error) {
		text := args[0].String()
		columns := args[1].Int()
		// key := args[2]

		result, err := cipher.ColumnarTransposition(text, columns, []int{})

		return js.ValueOf(result), err
	})

	CreatePromiseFunc("DecodePolybiusCipher", func(this js.Value, args []js.Value) (js.Value, error) {
		encoded := args[0].String()
		key := args[1].String()
		plaintext, err := cipher.DecodePolybiusCipher(encoded, key)
		if err != nil {
			return js.ValueOf(""), err
		}
		return js.ValueOf(plaintext), nil
	})

	CreatePromiseFunc("Wait", func(v1 js.Value, v2 []js.Value) (js.Value, error) {
		time.Sleep(3 * time.Second)
		fmt.Println("Finished!")
		return js.Null(), nil
	})

	<-c
}