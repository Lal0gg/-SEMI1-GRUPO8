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

func (db *DBClient) GetChapter(ctx context.Context, chapterID int) (*int, error) {

	row := db.QueryRowContext(ctx, "SELECT id_chapter FROM chapter WHERE id_serie = $1", chapterID)
	var idc *int
	err := row.Scan(&idc)
	return idc, err
}

func (db *DBClient) GetChapterIDFromSerie(ctx context.Context, serieId int, chapNum int) (*int, error) {
	row := db.QueryRowContext(ctx, "SELECT id_chapter FROM chapter WHERE id_serie = $1 AND chapter_number = $2", serieId, chapNum)
	var idc *int
	err := row.Scan(&idc)
	return idc, err
}
