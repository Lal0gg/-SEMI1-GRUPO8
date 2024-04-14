package main

import (
	"context"
	"net/http"
	"proj/server/internal/handlers"
	"proj/server/internal/middleware"
	"time"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humago"
)

func main() {

	router := http.NewServeMux()

	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion("us-east-2"))
	if err != nil {
		panic(err)
	}

	api := humago.New(router, huma.DefaultConfig("Proyecto Semi1", "0.1"))
	env, err := handlers.NewEnv(cfg)
	if err != nil {
		panic(err)
	}

	huma.Get(api, "/health", env.HealthHandler)
	huma.Post(api, "/createSerie", env.CreateSerieHandler)
	huma.Post(api, "/createChapter", env.CreateChaperHandler)
	huma.Post(api, "/uploadImg", env.UploadImageHandler)

	huma.Get(api, "/serie/{idSerie}", env.GetSeriesChapterNumberHandler)
	huma.Get(api, "/serie/{idSerie}/ch/{chaptNum}", env.GetChapterHandler)
	huma.Get(api, "/getSeries", env.GetAllSeriesHandler)

	stack := middleware.CreateStack(middleware.Logging)
	server := &http.Server{
		Addr:         ":8080",
		Handler:      stack(router),
		ReadTimeout:  time.Second * 30,
		WriteTimeout: time.Second * 10,
	}

	server.ListenAndServe()
}
