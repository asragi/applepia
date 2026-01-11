package server

import (
	"fmt"
	"net/http"

	"github.com/asragi/RinGo/oauth"
)

type HTTPServe func() error

func NewHTTPServer(port int, handler *oauth.Handler) (HTTPServe, error) {
	handleError := func(err error) (HTTPServe, error) {
		return nil, fmt.Errorf("new http server: %w", err)
	}
	mux := http.NewServeMux()
	mux.HandleFunc("POST /auth/google/callback", handler.Callback)
	mux.HandleFunc("POST /auth/google/link", handler.LinkAccount)

	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", port),
		Handler: withCORS(mux),
	}

	serve := func() error {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			return err
		}
		return nil
	}
	return serve, nil
}

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
