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

	huma.Register(api, huma.Operation{
		OperationID: "HealthCheck",
		Method:      http.MethodGet,
		Path:        "/health",
		Summary:     "Health check",
	}, env.HealthHandler)

	huma.Register(api, huma.Operation{
		OperationID: "CreateSerie",
		Method:      http.MethodPost,
		Path:        "/createSerie",
		Summary:     "Crear serie",
		Description: "Crear una nueva serie, esta puede ser pública o privada dependiendo de si se le envía un token de acceso",
	}, env.CreateSerieHandler)

	huma.Register(api, huma.Operation{
		OperationID: "CreateChapter",
		Method:      http.MethodPost,
		Path:        "/createChapter",
		Summary:     "Crear capítulo",
		Description: "Crear un nuevo capítulo en una serie ya existente",
	}, env.CreateChaperHandler)

	huma.Register(api, huma.Operation{
		OperationID: "UploadImg",
		Method:      http.MethodPost,
		Path:        "/uploadImg",
		Summary:     "Subir imagen de capítulo",
		Description: "Subir una imagen que será parte de un capítulo",
	}, env.UploadImageHandler)

	huma.Register(api, huma.Operation{
		OperationID: "GetSeriesChapterNumber",
		Method:      http.MethodGet,
		Path:        "/serie/{idSerie}",
		Summary:     "Obtener número de capítulos de una serie",
		Description: "Obtener el número de capítulos que tiene una serie",
	}, env.GetSeriesChapterNumberHandler)

	huma.Register(api, huma.Operation{
		OperationID: "GetChapter",
		Method:      http.MethodGet,
		Path:        "/serie/{idSerie}/ch/{chaptNum}",
		Summary:     "Obtener capítulo",
		Description: "Obtener un capítulo específico de una serie",
	}, env.GetChapterHandler)

	huma.Register(api, huma.Operation{
		OperationID: "GetSeries",
		Method:      http.MethodGet,
		Path:        "/getSeries",
		Summary:     "Obtener series",
		Description: "Obtener todas las series públicas que existen en la base de datos",
	}, env.GetAllSeriesHandler)

	huma.Register(api, huma.Operation{
		OperationID: "GetPrivateSeries",
		Method:      http.MethodGet,
		Path:        "/getPrivateSerie",
		Summary:     "Obtener series privadas",
		Description: "Obtener las series privadas que pertenecen a un usuario específico",
	}, env.GetPrivateSeriesHandler)

	huma.Register(api, huma.Operation{
		OperationID: "GetTranscription",
		Method:      http.MethodPost,
		Path:        "/GetTranscription",
		Summary:     "Obtener transcripción",
		Description: "Obtiene la transcripción de el texto en una imágen",
	}, env.TransciptPageHandler)

	huma.Register(api, huma.Operation{
		OperationID: "Translate",
		Method:      http.MethodPost,
		Path:        "/translate",
		Summary:     "Traducción y Audio",
		Description: "Traducción de un texto e generación de audio con un lenguaje específicado",
	}, env.TranslateHandler)

	huma.Register(api, huma.Operation{
		OperationID: "FollowSerie",
		Method:      http.MethodPost,
		Path:        "/followSerie",
		Summary:     "Seguir Serie",
		Description: "Seguir serie para recibir notificaciones de nuevos capítulos por correo",
	}, env.FollowSerieHandler)

	huma.Register(api, huma.Operation{
		OperationID: "UploadCover",
		Method:      http.MethodPost,
		Path:        "/uploadCover",
		Summary:     "Subir/Actualizar portada",
		Description: "Subir o actualizar una portada para una serie ya existente (no revisa que dicha serie exista, simplemente sube la imagen)",
	}, env.UploadCoverHandler)

	stack := middleware.CreateStack(middleware.AllowCors, middleware.Logging)
	server := &http.Server{
		Addr:         ":8080",
		Handler:      stack(router),
		ReadTimeout:  time.Second * 30,
		WriteTimeout: time.Second * 10,
	}

	server.ListenAndServe()
}
