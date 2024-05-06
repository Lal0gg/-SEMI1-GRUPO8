package handlers

import (
	"context"
)

type HealthOutput struct {
	Body struct {
		Message string `json:"message" example:"OK" doc:"Health check"`
	}
}

func (e *Env) HealthHandler(ctx context.Context, i *struct{}) (*HealthOutput, error) {
	resp := &HealthOutput{}
	resp.Body.Message = "OK"
	return resp, nil
}
