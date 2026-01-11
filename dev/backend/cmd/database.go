package main

import (
	"fmt"
	"github.com/asragi/RinGo/database"
	"os"
	"time"
)

// getEnvOrError は環境変数を取得し、未設定の場合はエラーを返す
func getEnvOrError(key string) (string, error) {
	value := os.Getenv(key)
	if value == "" {
		return "", fmt.Errorf("環境変数 %s が設定されていません", key)
	}
	return value, nil
}

func CreateDB() (*database.DBAccessor, error) {
	// 環境変数から設定を取得
	dbHost, err := getEnvOrError("DB_HOST")
	if err != nil {
		return nil, err
	}
	dbPort, err := getEnvOrError("DB_PORT")
	if err != nil {
		return nil, err
	}
	dbUser, err := getEnvOrError("DB_USER")
	if err != nil {
		return nil, err
	}
	dbPassword, err := getEnvOrError("DB_PASSWORD")
	if err != nil {
		return nil, err
	}
	dbName, err := getEnvOrError("DB_NAME")
	if err != nil {
		return nil, err
	}

	dbSettings := &database.ConnectionSettings{
		UserName: dbUser,
		Password: dbPassword,
		Port:     dbPort,
		Protocol: "tcp",
		Host:     dbHost,
		Database: dbName,
	}
	db, err := database.ConnectDB(dbSettings)
	if err != nil {
		return nil, fmt.Errorf("connect DB: %w", err)
	}
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)
	db.SetConnMaxIdleTime(4 * time.Minute)
	return database.NewDBAccessor(db, db), nil
}
