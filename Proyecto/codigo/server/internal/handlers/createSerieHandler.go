package handlers

import (
	"context"
)

type NewSerie struct {
	Body struct {
		Name        string  `json:"name" example:"Franken Fran" doc:"Nombre de la serie"`
		Description string  `json:"description" example:"Serie de humor oscuro sobre los experimentos de Fran Madaraki" doc:"Descripción de la serie"`
		OwnerToken  *string `json:"ownerToken"  doc:"Token del usuario dueño, si no se envía la serie es pública" required:"false"`
	}
}

func (e *Env) CreateSerieHandler(ctx context.Context, s *NewSerie) (*SuccessMessage, error) {
	id, err := e.getUserId(ctx, s.Body.OwnerToken)
	if err != nil {
		return nil, err
	}
	err = e.DB.CreateSerie(ctx, s.Body.Name, s.Body.Description, id)
	if err != nil {
		return nil, err
	}
	msg := &SuccessMessage{}
	msg.Body.Message = "La serie se ha creado exitosamente"
	return msg, nil
}
