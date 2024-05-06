package database

import (
	"context"
	"fmt"
)

func (db *DBClient) InsertComment(ctx context.Context, text string, idSerie int, chapNum int, userId *int) error {
	tx, err := db.BeginTx(ctx, nil)
	fmt.Println("InsertComment")
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
	chapId, err := db.GetChapterIDFromSerie(ctx, idSerie, chapNum)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	_, err = tx.ExecContext(
		ctx,
		`INSERT INTO comment (content,id_usr,id_chapter) VALUES ($1, $2, $3);`,
		text, id, *chapId,
	)
	if err != nil {
		return err
	}
	err = tx.Commit()
	return err
}

func (db *DBClient) GetComments(ctx context.Context, idSerie int, chapNum int) (*[]map[string]string, error) {
	chapId, err := db.GetChapterIDFromSerie(ctx, idSerie, chapNum)
	if err != nil {
		return nil, err
	}
	rows, err := db.QueryContext(ctx, `
	SELECT comment.content, usr.username 
	FROM comment JOIN usr ON comment.id_usr = usr.id_usr
	WHERE  id_chapter = $1;`,
		*chapId,
	)
	if err != nil {
		return nil, err
	}
	response := make([]map[string]string, 0)
	for rows.Next() {
		var content string
		var username string
		err = rows.Scan(&content, &username)
		if err != nil {
			return nil, err
		}
		response = append(response, map[string]string{"content": content, "username": username})
	}
	return &response, nil
}
