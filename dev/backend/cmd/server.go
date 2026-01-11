package main

import (
	"github.com/asragi/RinGo/auth"
	"github.com/asragi/RinGo/core"
	"github.com/asragi/RinGo/core/game/shelf"
	"github.com/asragi/RinGo/initialize"
	"github.com/asragi/RinGo/oauth"
	"github.com/asragi/RinGo/server"
	"log"
	"strconv"
)

func main() {
	handleError := func(err error) {
		log.Fatal(err.Error())
	}

	// 環境変数からSECRET_KEYを取得
	secretKeyStr, err := getEnvOrError("SECRET_KEY")
	if err != nil {
		handleError(err)
		return
	}
	secretKey := auth.SecretHashKey(secretKeyStr)

	// 環境変数からSERVER_PORTを取得
	serverPortStr, err := getEnvOrError("SERVER_PORT")
	if err != nil {
		handleError(err)
		return
	}
	serverPort, err := strconv.Atoi(serverPortStr)
	if err != nil {
		log.Fatalf("SERVER_PORT の値が不正です: %v", err)
		return
	}

	// 環境変数からHTTP_PORTを取得
	httpPortStr, err := getEnvOrError("HTTP_PORT")
	if err != nil {
		handleError(err)
		return
	}
	httpPort, err := strconv.Atoi(httpPortStr)
	if err != nil {
		log.Fatalf("HTTP_PORT の値が不正です: %v", err)
		return
	}

	googleClientId, err := getEnvOrError("GOOGLE_CLIENT_ID")
	if err != nil {
		handleError(err)
		return
	}
	googleClientSecret, err := getEnvOrError("GOOGLE_CLIENT_SECRET")
	if err != nil {
		handleError(err)
		return
	}
	googleRedirectURI, err := getEnvOrError("GOOGLE_REDIRECT_URI")
	if err != nil {
		handleError(err)
		return
	}

	constants := &initialize.Constants{
		InitialFund:        core.Fund(100000),
		InitialMaxStamina:  core.MaxStamina(6000),
		InitialPopularity:  shelf.ShopPopularity(0),
		UserIdChallengeNum: 3,
	}

	db, err := CreateDB()
	if err != nil {
		handleError(err)
		return
	}

	endpoints := initialize.CreateEndpoints(secretKey, constants, db.Exec, db.Query)
	googleClient := oauth.NewGoogleClient(googleClientId, googleClientSecret, googleRedirectURI)
	oauthHandler := initialize.CreateOAuthHandler(googleClient, secretKey, constants, db.Exec, db.Query)
	log.Printf("Starting gRPC server on port %d...", serverPort)
	serve, stopDB, err := server.SetUpServer(serverPort, endpoints)
	if err != nil {
		handleError(err)
		return
	}
	defer stopDB()

	log.Printf("Starting HTTP server on port %d...", httpPort)
	httpServe, err := server.NewHTTPServer(httpPort, oauthHandler)
	if err != nil {
		handleError(err)
		return
	}
	go func() {
		if err := httpServe(); err != nil {
			log.Printf("HTTP Server Error: %v", err)
		}
	}()

	log.Printf("gRPC server is listening on port %d", serverPort)
	err = serve()
	if err != nil {
		log.Printf("gRPC Server Error: %v", err)
		return
	}
}
