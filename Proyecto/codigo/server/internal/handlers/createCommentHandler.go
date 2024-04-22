package handlers

import (
	"context"
)

type NewComment struct {
	Body struct {
		Text       string  `json:"text" example:"Comparte tu opinión sobre el manga o capítulo." doc:"Commentario de la serie"`
		OwnerToken *string `json:"ownerToken" doc:"Token del usuario"`
		ChapterID  int     `json:"chapterID" doc:"ID del capítulo"`
	}
}

func (e *Env) CreateCommentHandler(ctx context.Context, c *NewComment) (*SuccessMessage, error) {
	id, err := e.getUserId(ctx, c.Body.OwnerToken)
	if err != nil {
		return nil, err
	}
	//idcapitulo, err := e.DB.GetChapter(ctx, c.Body.ChapterID)
	//if err != nil {
	//	return nil, err
	//}
	err = e.DB.InsertComment(ctx, c.Body.Text, c.Body.ChapterID, id)
	if err != nil {
		return nil, err
	}
	err = e.Store.InsertComment(c.Body.Text, c.Body.ChapterID, *id)
	if err != nil {
		return nil, err
	}
	msg := &SuccessMessage{}
	msg.Body.Message = "Commentario creado exitosamente"
	return msg, nil
}
