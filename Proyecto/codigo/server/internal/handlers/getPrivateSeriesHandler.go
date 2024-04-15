package handlers

import "context"

type PrivateSeries = Series

type GetPrivateSerie struct {
	AccessToken string `query:"token" doc:"Token de acceso del usuario" required:"true" example:"AAAAAA"`
}

func (e *Env) GetPrivateSeriesHandler(ctx context.Context, g *GetPrivateSerie) (*PrivateSeries, error) {
	id, err := e.getUserId(ctx, &g.AccessToken)
	if err != nil {
		return nil, err
	}
	series, err := e.DB.GetSeries(ctx, *id)
	if err != nil {
		return nil, err
	}
	allSeries := &Series{}
	allSeries.Body.Series = *series
	return allSeries, nil
}
