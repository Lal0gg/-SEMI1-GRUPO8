package handlers

import (
	"context"
	"proj/server/internal/database"
)

type GetNotes struct {
	Body struct {
		Average float64               `json:"average" doc:"Promedio de las notas de la serie" minimum:"1" maximum:"10" `
		Notes   []database.SingleNote `json:"notes" doc:"arreglo que contiene las notas dadas a una serie"`
	}
}

type GetSeriesNotes struct {
	IdSerie int `path:"idSerie" doc:"ID de la serie de la que se conseguirán las notas"`
}

func (e *Env) GetNotesHandler(ctx context.Context, g *GetSeriesNotes) (*GetNotes, error) {
	notes, average, err := e.DB.GetNotes(g.IdSerie)
	if err != nil {
		return nil, err
	}
	allNotes := &GetNotes{}
	allNotes.Body.Notes = notes
	allNotes.Body.Average = *average
	return allNotes, nil
}
