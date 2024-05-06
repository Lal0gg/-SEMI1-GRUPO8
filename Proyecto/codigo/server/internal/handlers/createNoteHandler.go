package handlers

import (
	"context"
)

type NewNote struct {
	Body struct {
<<<<<<< HEAD
		Value      int     `json:"value" example:"10" doc:"Puntuación de la serie"`
=======
		Value      int     `json:"value" example:"10" doc:"Puntuación de la serie" minimum:"1" maximum:"10"`
>>>>>>> Feature_Lalo
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
<<<<<<< HEAD
	err = e.Store.InsertNote(c.Body.Value, c.Body.SerieID, *id)
	if err != nil {
		return nil, err
	}
=======
>>>>>>> Feature_Lalo
	msg := &SuccessMessage{}
	msg.Body.Message = "Nota de puntuación creada exitosamente"
	return msg, nil
}
