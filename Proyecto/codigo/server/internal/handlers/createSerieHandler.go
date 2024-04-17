package handlers

import (
	"context"
	"fmt"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/sns"
)

type NewSerie struct {
	Body struct {
		Name        string  `json:"name" example:"Franken Fran" doc:"Nombre de la serie"`
		Description string  `json:"description" example:"Serie de humor oscuro sobre los experimentos de Fran Madaraki" doc:"Descripción de la serie"`
		OwnerToken  *string `json:"ownerToken"  doc:"Token del usuario dueño, si no se envía la serie es pública" required:"false" example:"AAAAAA"`
	}
}

func (e *Env) CreateSerieHandler(ctx context.Context, s *NewSerie) (*SuccessMessage, error) {
	id, err := e.getUserId(ctx, s.Body.OwnerToken)
	if err != nil {
		return nil, err
	}
	idSerie, err := e.DB.CreateSerie(ctx, s.Body.Name, s.Body.Description, id)
	if err != nil {
		return nil, err
	}
	topic, err := e.SNSClient.CreateTopic(ctx, &sns.CreateTopicInput{Name: aws.String(fmt.Sprintf("%v", *idSerie))})
	if err != nil {
		log.Println("Error al crear el topic", err)
	} else {
		err := e.TopicsKV.Set(fmt.Sprintf("%v", *idSerie), *topic.TopicArn)
		if err != nil {
			log.Println("Error al guardar el topic", err)
		}
	}
	msg := &SuccessMessage{}
	msg.Body.Message = "La serie se ha creado exitosamente"
	return msg, nil
}
