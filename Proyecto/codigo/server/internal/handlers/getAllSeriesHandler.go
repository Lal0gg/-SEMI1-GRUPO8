package handlers

import "context"

type Series struct {
	Body struct {
		Series map[int]map[string]string `json:"series" doc:"Mapa con clave id de la serie y valor un mapa con la información de la serie"`
	}
}

func (e *Env) GetAllSeriesHandler(ctx context.Context, i *struct{}) (*Series, error) {
	series, err := e.DB.GetSeries(ctx, 1)
	if err != nil {
		return nil, err
	}
	allSeries := &Series{}
	allSeries.Body.Series = *series
	return allSeries, nil
}
