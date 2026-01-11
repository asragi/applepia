package oauth

import "errors"

var (
	ErrOAuthLinkNotFound   = errors.New("oauth link not found")
	ErrGoogleIdAlreadyLink = errors.New("google id already linked")
	ErrAccountAlreadyLink  = errors.New("account already linked")
)
