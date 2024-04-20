package handlers

import (
	"context"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/sns"
)

type CreateChapter struct {
	Body struct {
		SerieID       int `json:"serieId" doc:"ID de la serie a la que pertenece el capítulo"`
		ChapterNumber int `json:"chapterNumber" doc:"Número de capítulo"`
	}
}

func (e *Env) CreateChaperHandler(ctx context.Context, c *CreateChapter) (*SuccessMessage, error) {
	err := e.DB.InsertChapter(ctx, c.Body.SerieID, c.Body.ChapterNumber)
	if err != nil {
		return nil, err
	}
	err = e.Store.InsertChapter(c.Body.SerieID, c.Body.ChapterNumber)
	if err != nil {
		return nil, err
	}
	arn, err := e.TopicsKV.Get(fmt.Sprintf("%v", c.Body.SerieID))
	if err != nil {
		return nil, err
	}
	serie, err := e.DB.GetSerie(ctx, c.Body.SerieID)
	if err != nil {
		return nil, err
	}
	err = e.sendNotification(ctx, *arn, *serie, c.Body.ChapterNumber)
	if err != nil {
		return nil, err
	}
	msg := &SuccessMessage{}
	msg.Body.Message = "Chapter created"
	return msg, nil
}

func (e *Env) sendNotification(ctx context.Context, arn string, serie string, chapNum int) error {
	e.SNSClient.Publish(ctx, &sns.PublishInput{
		TopicArn: aws.String(arn),
		Subject:  aws.String(fmt.Sprintf("Nuevo capítulo de %v", serie)),
		Message:  aws.String(fmt.Sprintf("Se ha publicado el capítulo %v de %v", chapNum, serie)),
	})
	return nil
}
