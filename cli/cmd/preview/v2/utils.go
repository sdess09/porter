package v2

import "crypto/rand"

func boolean(v bool) *bool {
	copy := v
	return &copy
}

func randomString(length uint, charset string) string {
	ll := len(charset)
	b := make([]byte, length)
	rand.Read(b) // generates len(b) random bytes
	for i := uint(0); i < length; i++ {
		b[i] = charset[int(b[i])%ll]
	}
	return string(b)
}

func oneOf[T string](elem T, vals ...T) bool {
	found := false

	for _, v := range vals {
		if v == elem {
			found = true
			break
		}
	}

	return found
}
