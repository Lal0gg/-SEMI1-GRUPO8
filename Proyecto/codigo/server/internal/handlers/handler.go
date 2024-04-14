package handlers

import (
	"fmt"
	"os"
	"proj/server/internal/database"
	"proj/server/internal/store"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type Env struct {
	EnvVar           map[string]string
	S3Client         *s3.Client
	CognitooIdClient *cognitoidentityprovider.Client
	DB               *database.DBClient
	Store            *store.Store
}

func NewEnv(cfg aws.Config) (*Env, error) {

	err := godotenv.Load()
	if err != nil {
		return nil, err
	}
	dbUser := os.Getenv("DB_USER")
	dbHost := os.Getenv("DB_HOST")
	dbPass := os.Getenv("DB_PASS")
	dbName := os.Getenv("DB_NAME")
	dbPort := os.Getenv("DB_PORT")
	dsn := fmt.Sprintf(
		"user=%s password=%s host=%s dbname=%s port=%s sslmode=disable",
		dbUser, dbPass, dbHost, dbName, dbPort,
	)

	dbClient, err := database.NewDBClient(dsn)
	if err != nil {
		return nil, err
	}

	store, err := store.OpenCloverDB("clover.db")
	err = store.Init()
	if err != nil {
		return nil, err
	}

	return &Env{
		EnvVar:           make(map[string]string),
		S3Client:         s3.NewFromConfig(cfg),
		CognitooIdClient: cognitoidentityprovider.NewFromConfig(cfg),
		DB:               dbClient,
		Store:            store,
	}, nil
}

type SuccessMessage struct {
	Body struct {
		Message string `json:"message" example:"La serie se ha creado exitosamente" doc:"Mensaje de éxito"`
	}
}
