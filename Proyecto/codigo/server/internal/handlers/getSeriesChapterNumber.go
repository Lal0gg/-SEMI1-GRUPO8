package handlers

import (
	"context"
)

type GetSeriesChapterNumber struct {
	IdSerie int `path:"idSerie" doc:"ID de la serie de la que se conseguirá el capítulo"`
}

type ChapterList struct {
	Body struct {
		ChapterNum int   `json:"chapterNumber" doc:"Número de capítulos de la serie" minimum:"1"`
		Chaps      []int `json:"chapters" doc:"Lista de capítulos"`
	}
}

func (e *Env) GetSeriesChapterNumberHandler(ctx context.Context, c *GetSeriesChapterNumber) (*ChapterList, error) {
	list, err := e.Store.GetSerieAllChapterNumber(c.IdSerie)
	if err != nil {
		return nil, err
	}
	chList := &ChapterList{}
	chList.Body.ChapterNum = len(*list)
	chList.Body.Chaps = *list
	return chList, nil
}
