package oauth

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

const (
	googleTokenEndpoint     = "https://oauth2.googleapis.com/token"
	googleTokenInfoEndpoint = "https://oauth2.googleapis.com/tokeninfo"
)

type GoogleClient struct {
	clientID     string
	clientSecret string
	redirectURI  string
	httpClient   *http.Client
}

func NewGoogleClient(clientID, clientSecret, redirectURI string) *GoogleClient {
	return &GoogleClient{
		clientID:     clientID,
		clientSecret: clientSecret,
		redirectURI:  redirectURI,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (c *GoogleClient) ExchangeCode(ctx context.Context, code, codeVerifier string) (*TokenResponse, error) {
	handleError := func(err error) (*TokenResponse, error) {
		return nil, fmt.Errorf("exchange code: %w", err)
	}
	if code == "" || codeVerifier == "" {
		return handleError(errors.New("code or code_verifier is empty"))
	}
	form := url.Values{}
	form.Set("code", code)
	form.Set("client_id", c.clientID)
	form.Set("client_secret", c.clientSecret)
	form.Set("redirect_uri", c.redirectURI)
	form.Set("grant_type", "authorization_code")
	form.Set("code_verifier", codeVerifier)

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, googleTokenEndpoint, strings.NewReader(form.Encode()))
	if err != nil {
		return handleError(err)
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return handleError(err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return handleError(err)
	}
	if resp.StatusCode != http.StatusOK {
		return handleError(fmt.Errorf("google token exchange failed: status=%d body=%s", resp.StatusCode, string(body)))
	}

	var tokenResp TokenResponse
	if err := json.Unmarshal(body, &tokenResp); err != nil {
		return handleError(err)
	}
	if tokenResp.IDToken == "" {
		return handleError(errors.New("id_token is empty"))
	}
	return &tokenResp, nil
}

func (c *GoogleClient) VerifyIDToken(ctx context.Context, idToken string) (*GoogleClaims, error) {
	handleError := func(err error) (*GoogleClaims, error) {
		return nil, fmt.Errorf("verify id token: %w", err)
	}
	if idToken == "" {
		return handleError(errors.New("id_token is empty"))
	}
	endpoint := fmt.Sprintf("%s?id_token=%s", googleTokenInfoEndpoint, url.QueryEscape(idToken))
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return handleError(err)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return handleError(err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return handleError(err)
	}
	if resp.StatusCode != http.StatusOK {
		return handleError(fmt.Errorf("google tokeninfo failed: status=%d body=%s", resp.StatusCode, string(body)))
	}

	var info GoogleTokenInfo
	if err := json.Unmarshal(body, &info); err != nil {
		return handleError(err)
	}
	if info.Sub == "" {
		return handleError(errors.New("sub is empty"))
	}
	if info.Aud != c.clientID {
		return handleError(fmt.Errorf("aud mismatch: %s", info.Aud))
	}
	if info.Iss != "accounts.google.com" && info.Iss != "https://accounts.google.com" {
		return handleError(fmt.Errorf("iss mismatch: %s", info.Iss))
	}

	return &GoogleClaims{
		GoogleId: info.Sub,
		Email:    info.Email,
	}, nil
}
