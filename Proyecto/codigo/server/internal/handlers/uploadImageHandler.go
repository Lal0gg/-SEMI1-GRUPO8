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
		return nil, err
	}
	mtype := mimetype.Detect(dec)
	if !mtype.Is("image") {
		return nil, fmt.Errorf("%s no es tipo de imagen", mtype.String())
	}
	keyname := fmt.Sprintf(
		"series/%v/ch-%v/%v%s",
		i.Body.SerieID, i.Body.ChapterNumber, i.Body.PageNumber, mtype.Extension(),
	)
	_, err = e.S3Client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String("proyecto-semi1-g8"),
		Key:         aws.String(keyname),
		Body:        bytes.NewReader(dec),
		ContentType: aws.String(mtype.String()),
	})
	if err != nil {
		return nil, err
	}
	resp.Body.S3Url = fmt.Sprintf("https://proyecto-semi1-g8.s3.amazonaws.com/%s", keyname)
	return resp, nil
}
