package handlers

import (
	"context"
)

type GetSerieComments struct {
	Body struct {
		SerieId int `json:"serieId" doc:"ID de la serie"`
		ChapNum int `json:"chapNum" doc:"Número del capítulo"`
	}
}

type Comments struct {
	Body struct {
		Comments *[]map[string]string `json:"comments" doc:"Lista de mapas con los comentarios del capítulo, con las llaves 'content' y 'username"`
	}
}

func (e *Env) GetCommentsHandler(ctx context.Context, c *GetSerieComments) (*Comments, error) {
	comments, err := e.DB.GetComments(ctx, c.Body.SerieId, c.Body.ChapNum)
	if err != nil {
		return nil, err
	}
	retval := &Comments{}
	retval.Body.Comments = comments
	return retval, nil
}
