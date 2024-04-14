package database

import (
	"context"
	"fmt"
)

func (db *DBClient) CreateSerie(ctx context.Context, name string, description string, userId *int) error {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	var id int
	if userId == nil {
		id = 1
	} else {
		id = *userId
	}
	_, err = tx.ExecContext(
		ctx,
		"INSERT INTO serie (descr, name_serie, id_usr) VALUES ($1, $2, $3);",
		description, name, id,
	)
	if err != nil {
		return err
	}

	err = tx.Commit()
	return err
}

// Que cargue todas, ahora mismo no hay tiempo para implentar por rangos
func (db *DBClient) GetSeries(ctx context.Context) (*map[int]map[string]string, error) {
	row, err := db.QueryContext(ctx, "SELECT id_serie,name_serie, descr FROM serie")
	if err != nil {
		return nil, err
	}
	seriesMap := make(map[int]map[string]string)
	for row.Next() {
		var id int
		var name string
		var description string
		fmt.Println(row)
		err := row.Scan(&id, &name, &description)
		if err != nil {
			return nil, err
		}
		innerMap := make(map[string]string)
		innerMap["name"] = name
		innerMap["description"] = description
		seriesMap[id] = innerMap
	}
	return &seriesMap, nil
}
