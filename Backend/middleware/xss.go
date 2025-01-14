package middleware

import "github.com/microcosm-cc/bluemonday"

func SanitizeHTML(input string) string {
	p := bluemonday.UGCPolicy()
	return p.Sanitize(input)
}
