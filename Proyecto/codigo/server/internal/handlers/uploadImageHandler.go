package handlers

import (
	"bytes"
	"context"
	"encoding/base64"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gabriel-vasile/mimetype"
)

type ImageUpload struct {
	Body struct {
		SerieID       int    `json:"serieId" example:"1" doc:"ID de la serie a la que pertenece la imágen"`
		ChapterNumber int    `json:"chapterNumber" example:"1" doc:"Número del capítulo a la que pertenece la imágen"`
		PageNumber    int    `json:"pageNumber" example:"1" doc:"Número de página"`
		ImageB64      string `json:"imageB64" doc:"Imágen en base64"`
	}
}

type ImageLink struct {
	Body struct {
		S3Url string `json:"s3Url" example:"" doc:"Enlace hacia imágen en S3"`
	}
}

func (e *Env) UploadImageHandler(ctx context.Context, i *ImageUpload) (*ImageLink, error) {
	resp := &ImageLink{}
	dec, err := base64.StdEncoding.DecodeString(i.Body.ImageB64)
	if err != nil {
		return nil, fmt.Errorf("Error al decodificar base64: %v", err)
	}
	mtype := mimetype.Detect(dec)
	keyname := fmt.Sprintf(
		"series/%v/ch-%v/%v%s",
		i.Body.SerieID, i.Body.ChapterNumber, i.Body.PageNumber, mtype.Extension(),
	)
	_, err = e.S3Client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String("proyecto-semi-g8"),
		Key:         aws.String(keyname),
		Body:        bytes.NewReader(dec),
		ContentType: aws.String(mtype.String()),
	})
	if err != nil {
		return nil, fmt.Errorf("Error al subir imagen a S3: %v", err)
	}
	s3Url := fmt.Sprintf("https://proyecto-semi-g8.s3.us-east-2.amazonaws.com/%s", keyname)
	err = e.Store.AddPageToChapter(
		i.Body.SerieID, i.Body.ChapterNumber, i.Body.PageNumber, s3Url,
	)
	if err != nil {
		return nil, fmt.Errorf("Error al agregar página a capítulo: %v", err)
	}
	resp.Body.S3Url = s3Url
	return resp, nil
}
