package main

import (
	"context"
	"fmt"
	"time"
)

func track(ctx context.Context, id int, delay time.Duration, results chan<- string) {
	select {
	case <-time.After(delay):
		results <- fmt.Sprintf("พัสดุ %d ตรวจแล้ว", id)
	case <-ctx.Done():
		results <- fmt.Sprintf("พัสดุ %d ยกเลิก", id)
	}
}
func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 150*time.Millisecond)
	defer cancel()
	delays := []time.Duration{20 * time.Millisecond, 400 * time.Millisecond}
	results := make(chan string, len(delays))
	for i, delay := range delays {
		go track(ctx, i+1, delay, results)
	}
	for range delays {
		fmt.Println(<-results)
	}
}
