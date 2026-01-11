package oauth

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/asragi/RinGo/auth"
)

type Handler struct {
	googleClient          *GoogleClient
	findUserByGoogleId    FindUserByGoogleIdFunc
	insertOAuthLink       InsertOAuthLinkFunc
	findOAuthLinkByUserId FindOAuthLinkByUserIdFunc
	registerUser          auth.RegisterUserFunc
	createToken           auth.CreateTokenFunc
	validateToken         auth.ValidateTokenFunc
}

func NewHandler(
	googleClient *GoogleClient,
	findUserByGoogleId FindUserByGoogleIdFunc,
	insertOAuthLink InsertOAuthLinkFunc,
	findOAuthLinkByUserId FindOAuthLinkByUserIdFunc,
	registerUser auth.RegisterUserFunc,
	createToken auth.CreateTokenFunc,
	validateToken auth.ValidateTokenFunc,
) *Handler {
	return &Handler{
		googleClient:          googleClient,
		findUserByGoogleId:    findUserByGoogleId,
		insertOAuthLink:       insertOAuthLink,
		findOAuthLinkByUserId: findOAuthLinkByUserId,
		registerUser:          registerUser,
		createToken:           createToken,
		validateToken:         validateToken,
	}
}

type callbackRequest struct {
	Code         string `json:"code"`
	CodeVerifier string `json:"code_verifier"`
}

type callbackResponse struct {
	Token string `json:"token"`
}

type linkAccountRequest struct {
	Token        string `json:"token"`
	Code         string `json:"code"`
	CodeVerifier string `json:"code_verifier"`
}

type statusResponse struct {
	Status string `json:"status"`
}

type errorResponse struct {
	Error string `json:"error"`
}

func (h *Handler) Callback(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var req callbackRequest
	if err := decodeJSON(r, &req); err != nil {
		writeJSON(w, http.StatusBadRequest, errorResponse{Error: err.Error()})
		return
	}
	if req.Code == "" || req.CodeVerifier == "" {
		writeJSON(w, http.StatusBadRequest, errorResponse{Error: "code or code_verifier is empty"})
		return
	}

	tokenResp, err := h.googleClient.ExchangeCode(ctx, req.Code, req.CodeVerifier)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, errorResponse{Error: err.Error()})
		return
	}
	claims, err := h.googleClient.VerifyIDToken(ctx, tokenResp.IDToken)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, errorResponse{Error: err.Error()})
		return
	}

	userId, err := h.findUserByGoogleId(ctx, claims.GoogleId)
	if err != nil {
		if !errors.Is(err, ErrOAuthLinkNotFound) {
			writeJSON(w, http.StatusInternalServerError, errorResponse{Error: err.Error()})
			return
		}
		registerResult, err := h.registerUser(ctx)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, errorResponse{Error: err.Error()})
			return
		}
		userId = registerResult.UserId
		link := OAuthLink{
			UserId:     userId,
			Provider:   ProviderGoogle,
			ProviderId: claims.GoogleId,
			Email:      claims.Email,
		}
		if err := h.insertOAuthLink(ctx, link); err != nil {
			writeJSON(w, http.StatusInternalServerError, errorResponse{Error: err.Error()})
			return
		}
	}

	jwt, err := h.createToken(userId)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, errorResponse{Error: err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, callbackResponse{Token: string(jwt)})
}

func (h *Handler) LinkAccount(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var req linkAccountRequest
	if err := decodeJSON(r, &req); err != nil {
		writeJSON(w, http.StatusBadRequest, errorResponse{Error: err.Error()})
		return
	}
	if req.Token == "" || req.Code == "" || req.CodeVerifier == "" {
		writeJSON(w, http.StatusBadRequest, errorResponse{Error: "token or code or code_verifier is empty"})
		return
	}

	accessToken, err := auth.NewAccessToken(req.Token)
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, errorResponse{Error: err.Error()})
		return
	}
	info, err := h.validateToken(&accessToken)
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, errorResponse{Error: err.Error()})
		return
	}

	tokenResp, err := h.googleClient.ExchangeCode(ctx, req.Code, req.CodeVerifier)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, errorResponse{Error: err.Error()})
		return
	}
	claims, err := h.googleClient.VerifyIDToken(ctx, tokenResp.IDToken)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, errorResponse{Error: err.Error()})
		return
	}

	linkedUserId, err := h.findUserByGoogleId(ctx, claims.GoogleId)
	if err == nil {
		if linkedUserId != info.UserId {
			writeJSON(w, http.StatusConflict, errorResponse{Error: ErrGoogleIdAlreadyLink.Error()})
			return
		}
		writeJSON(w, http.StatusOK, statusResponse{Status: "ok"})
		return
	}
	if err != nil && !errors.Is(err, ErrOAuthLinkNotFound) {
		writeJSON(w, http.StatusInternalServerError, errorResponse{Error: err.Error()})
		return
	}

	existingLink, err := h.findOAuthLinkByUserId(ctx, info.UserId)
	if err == nil {
		if existingLink.ProviderId == claims.GoogleId {
			writeJSON(w, http.StatusOK, statusResponse{Status: "ok"})
			return
		}
		writeJSON(w, http.StatusConflict, errorResponse{Error: ErrAccountAlreadyLink.Error()})
		return
	}
	if err != nil && !errors.Is(err, ErrOAuthLinkNotFound) {
		writeJSON(w, http.StatusInternalServerError, errorResponse{Error: err.Error()})
		return
	}

	link := OAuthLink{
		UserId:     info.UserId,
		Provider:   ProviderGoogle,
		ProviderId: claims.GoogleId,
		Email:      claims.Email,
	}
	if err := h.insertOAuthLink(ctx, link); err != nil {
		writeJSON(w, http.StatusInternalServerError, errorResponse{Error: err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, statusResponse{Status: "ok"})
}

func decodeJSON(r *http.Request, v interface{}) error {
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	return decoder.Decode(v)
}

func writeJSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}
