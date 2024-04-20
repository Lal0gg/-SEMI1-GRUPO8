package handlers

import (
	"context"
	"fmt"
)

type CoverUpload struct {
	Body struct {
		ImageB64 string `json:"imageB64" doc:"Imágen en base64"`
		SerieId  int    `json:"serieId" doc:"Id de la serie"`
	}
}

type CoverLink struct {
	Body struct {
		Url string `json:"url" doc:"Enlace hacia imágen en S3"`
	}
}

func (e *Env) UploadCoverHandler(ctx context.Context, c *CoverUpload) (*CoverLink, error) {
	url, err := e.uploadGeneric(ctx, &c.Body.ImageB64, fmt.Sprintf("series/%v/cover", c.Body.SerieId))
	if err != nil {
		return nil, err
	}
	cLink := &CoverLink{}
	cLink.Body.Url = *url
	return cLink, nil
}
