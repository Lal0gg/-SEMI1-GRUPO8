package database

import (
	"context"
	"fmt"
)

func (db *DBClient) CreateSerie(ctx context.Context, name string, description string, userId *int) (*int, error) {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()
	var id int
	if userId == nil {
		id = 1
	} else {
		id = *userId
	}
	res, err := tx.QueryContext(
		ctx,
		"INSERT INTO serie (descr, name_serie, id_usr) VALUES ($1, $2, $3) returning id_serie;",
		description, name, id,
	)
	if err != nil {
		return nil, err
	}
	var createdId *int
	for res.Next() {
		err = res.Scan(&createdId)
		break
	}

	if err != nil {
		return nil, err
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}
	return createdId, err
}

// Que cargue todas, ahora mismo no hay tiempo para implentar por rangos
func (db *DBClient) GetSeries(ctx context.Context, userID int) (*map[int]map[string]string, error) {
	row, err := db.QueryContext(ctx, "SELECT id_serie,name_serie, descr FROM serie WHERE id_usr = $1", userID)
	if err != nil {
		return nil, err
	}
	seriesMap := make(map[int]map[string]string)
	for row.Next() {
		var id int
		var name string
		var description string
		err := row.Scan(&id, &name, &description)
		if err != nil {
			return nil, err
		}
		innerMap := make(map[string]string)
		innerMap["name"] = name
		innerMap["description"] = description
		innerMap["coverUrl"] = fmt.Sprintf("https://proyecto-semi-g8.s3.us-east-2.amazonaws.com/series/%v/cover", id)
		seriesMap[id] = innerMap
	}
	return &seriesMap, nil
}

func (db *DBClient) GetSerie(ctx context.Context, serieID int) (*string, error) {

	row := db.QueryRowContext(ctx, "SELECT name_serie FROM serie WHERE id_serie = $1", serieID)
	var name *string
	err := row.Scan(&name)
	return name, err
}
