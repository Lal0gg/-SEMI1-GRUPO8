package database

import (
	"context"
)

func (db *DBClient) GetUserID(ctx context.Context, username string) (*int, error) {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()
	resp, err := tx.QueryContext(
		ctx, `
			INSERT INTO 
				usr(username)
			VALUES
				($1)
			ON CONFLICT (username) DO UPDATE
				SET id_usr = usr.id_usr
			RETURNING id_usr;
		`,
		username,
	)
	if err != nil {
		return nil, err
	}
	id := new(int)
	for resp.Next() {
		err = resp.Scan(&id)
		if err != nil {
			return nil, err
		}
	}

	if tx.Commit() != nil {
		return nil, err
	}
	return id, nil
}
