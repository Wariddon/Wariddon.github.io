package main

import (
	"fmt"
	"os"
)

type Store interface{ Save(string) error }
type Memory struct{ Orders []string }

func (m *Memory) Save(order string) error { m.Orders = append(m.Orders, order); return nil }

type File string

func (f File) Save(order string) error { return os.WriteFile(string(f), []byte(order), 0600) }
func checkout(s Store) error           { return s.Save("order-101") }
func main() {
	m := &Memory{}
	if err := checkout(m); err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(m.Orders)
	if err := checkout(File("practice-latest.txt")); err != nil {
		fmt.Println(err)
	}
}
