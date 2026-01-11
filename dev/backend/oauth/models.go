package oauth

import "github.com/asragi/RinGo/core"

type Provider string

const (
	ProviderGoogle Provider = "google"
)

type OAuthLink struct {
	UserId     core.UserId
	Provider   Provider
	ProviderId string
	Email      string
}

type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	ExpiresIn    int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
	Scope        string `json:"scope"`
	TokenType    string `json:"token_type"`
	IDToken      string `json:"id_token"`
}

type GoogleTokenInfo struct {
	Sub           string `json:"sub"`
	Email         string `json:"email"`
	EmailVerified string `json:"email_verified"`
	Aud           string `json:"aud"`
	Iss           string `json:"iss"`
}

type GoogleClaims struct {
	GoogleId string
	Email    string
}
