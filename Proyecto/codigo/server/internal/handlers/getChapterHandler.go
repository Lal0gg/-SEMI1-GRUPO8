package handlers

import (
	"context"
	"fmt"
	"strconv"
)

type GetChaper struct {
	IdSerie  int `path:"idSerie" doc:"ID de la serie de la que se conseguirá el capítulo"`
	ChaptNum int `path:"chaptNum" doc:"Número del capítulo a obtener"`
}

type Chapter struct {
	Body struct {
		NumPages int    `json:"numPages" doc:"Número de páginas del capítulo" minimum:"1"`
		Pages    []Page `json:"pages"`
	}
}

type Page struct {
	PageNumber int    `json:"index" doc:"Número de página" minimum:"1"`
	Url        string `json:"url" doc:"Url de la imágen"`
}

func (e *Env) GetChapterHandler(ctx context.Context, c *GetChaper) (*Chapter, error) {
	doc, err := e.Store.GetSeriesChapter(c.IdSerie, c.ChaptNum)
	if err != nil {
		return nil, err
	}
	ch := &Chapter{}
	ch.Body.Pages = make([]Page, 0)
	for k, v := range *doc {
		kInt, err := strconv.Atoi(k)
		if err != nil {
			return nil, err
		}
		ch.Body.Pages = append(ch.Body.Pages, Page{PageNumber: kInt, Url: v.(string)})
	}
	ch.Body.NumPages = len(ch.Body.Pages)
	if ch.Body.NumPages == 0 {
		return nil, fmt.Errorf("No pages found")
	}
	return ch, nil
}
