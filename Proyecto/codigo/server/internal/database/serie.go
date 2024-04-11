package database

import (
	"context"
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
