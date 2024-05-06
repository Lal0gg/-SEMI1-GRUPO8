package database

import (
	"context"
)

func (db *DBClient) InsertNote(ctx context.Context, value int, idSerie int, userId *int) error {
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
		`INSERT INTO note (value,id_usr,id_serie) VALUES ($1, $2, $3);`,
		value, id, idSerie,
	)
	if err != nil {
		return err
	}
	err = tx.Commit()
	return err
}
