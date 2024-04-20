package handlers

import (
	"context"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/sns"
)

type FollowSerie struct {
	Body struct {
		AccesToken string `json:"accesToken" doc:"Token de acceso del usuario"`
		SerieId    int    `json:"serieId" doc:"ID de la serie a la que se desea seguir"`
	}
}

func (e *Env) FollowSerieHandler(ctx context.Context, f *FollowSerie) (*SuccessMessage, error) {
	mail, err := e.getUserMail(ctx, f.Body.AccesToken)
	if err != nil {
		return nil, err
	}
	arn, err := e.TopicsKV.Get(fmt.Sprintf("%v", f.Body.SerieId))
	if err != nil {
		return nil, err
	}
	_, err = e.SNSClient.Subscribe(ctx, &sns.SubscribeInput{
		Protocol: aws.String("email"),
		TopicArn: arn,
		Endpoint: mail,
	})
	if err != nil {
		return nil, err
	}
	return &SuccessMessage{}, nil
}
