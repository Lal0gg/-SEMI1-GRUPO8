package handlers

import "context"

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
	msg := &SuccessMessage{}
	msg.Body.Message = "Chapter created"
	return msg, nil
}
