package handlers

import "context"

type AllSeries struct {
	Body struct {
		Series map[int]map[string]string `json:"series" doc:"Mapa con clave id de la serie y valor un mapa con la información de la serie"`
	}
}

func (e *Env) GetAllSeriesHandler(ctx context.Context, i *struct{}) (*AllSeries, error) {
	series, err := e.DB.GetSeries(ctx)
	if err != nil {
		return nil, err
	}
	allSeries := &AllSeries{}
	allSeries.Body.Series = *series
	return allSeries, nil
}
