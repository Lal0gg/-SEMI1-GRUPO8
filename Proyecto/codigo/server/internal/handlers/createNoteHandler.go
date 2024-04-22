package handlers

import (
	"context"
)

type NewNote struct {
	Body struct {
		Value      int     `json:"value" example:"10" doc:"Puntuación de la serie"`
		OwnerToken *string `json:"ownerToken" doc:"Token del usuario"`
		SerieID    int     `json:"serieID" doc:"ID de la serie"`
	}
}

func (e *Env) CreateNoteHandler(ctx context.Context, c *NewNote) (*SuccessMessage, error) {
	id, err := e.getUserId(ctx, c.Body.OwnerToken)
	if err != nil {
		return nil, err
	}
	err = e.DB.InsertNote(ctx, c.Body.Value, c.Body.SerieID, id)
	if err != nil {
		return nil, err
	}
	err = e.Store.InsertNote(c.Body.Value, c.Body.SerieID, *id)
	if err != nil {
		return nil, err
	}
	msg := &SuccessMessage{}
	msg.Body.Message = "Nota de puntuación creada exitosamente"
	return msg, nil
}
