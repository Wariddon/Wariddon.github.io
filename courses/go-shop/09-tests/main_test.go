package main

import "testing"

func TestShipping(t *testing.T) {
	for _, tc := range []struct{ subtotal, want int }{{0, 0}, {999, 50}, {1000, 0}, {1001, 0}} {
		if got := shippingFee(tc.subtotal); got != tc.want {
			t.Errorf("subtotal %d: got %d, want %d", tc.subtotal, got, tc.want)
		}
	}
}
