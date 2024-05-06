package handlers

import (
	"fmt"
	"os"
	"proj/server/internal/database"
	"proj/server/internal/store"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	"github.com/aws/aws-sdk-go-v2/service/polly"
	"github.com/aws/aws-sdk-go-v2/service/rekognition"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/sns"
	"github.com/aws/aws-sdk-go-v2/service/translate"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type Env struct {
	EnvVar           map[string]string
	S3Client         *s3.Client
	CognitooIdClient *cognitoidentityprovider.Client
	RekogClient      *rekognition.Client
	TranslateClient  *translate.Client
	PollyClient      *polly.Client
	SNSClient        *sns.Client
	DB               *database.DBClient
	Store            *store.Store
	PollyKV          *store.KVStore
	TopicsKV         *store.KVStore
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

	st, err := store.OpenCloverDB("clover.db")
	err = st.Init()
	if err != nil {
		return nil, err
	}

	pollyStore, err := store.OpenKVStore("polly.db")
	if err != nil {
		return nil, err
	}

	topicStore, err := store.OpenKVStore("topics.db")
	if err != nil {
		return nil, err
	}

	return &Env{
		EnvVar:           make(map[string]string),
		S3Client:         s3.NewFromConfig(cfg),
		CognitooIdClient: cognitoidentityprovider.NewFromConfig(cfg),
		RekogClient:      rekognition.NewFromConfig(cfg),
		TranslateClient:  translate.NewFromConfig(cfg),
		PollyClient:      polly.NewFromConfig(cfg),
		SNSClient:        sns.NewFromConfig(cfg),
		DB:               dbClient,
		Store:            st,
		PollyKV:          pollyStore,
		TopicsKV:         topicStore,
	}, nil
}

type SuccessMessage struct {
	Body struct {
		Message string `json:"message" example:"La serie se ha creado exitosamente" doc:"Mensaje de éxito"`
	}
}
