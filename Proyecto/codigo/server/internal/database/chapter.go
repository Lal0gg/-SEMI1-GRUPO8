package database

import "context"

func (db *DBClient) InsertChapter(ctx context.Context, serieId int, chapN int) error {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	_, err = tx.ExecContext(
		ctx,
		`
		INSERT INTO chapter (chapter_number, id_serie)
		VALUES ($1, $2);
		`,
		chapN, serieId,
	)
	if err != nil {
		return err
	}

	err = tx.Commit()
	return err
}
