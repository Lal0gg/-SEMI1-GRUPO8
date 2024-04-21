package database

import (
	"context"
)

func (db *DBClient) InsertComment(ctx context.Context, text string, idchap *int, userId *int) error {
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
	defer tx.Rollback()
	_, err = tx.ExecContext(
		ctx,
		`INSERT INTO comment (content, id_usr, id_chapter) VALUES ($1, $2, $3) returning id_comment;`,
		text, idchap, id,
	)
	if err != nil {
		return err
	}
	err = tx.Commit()
	return err
}
