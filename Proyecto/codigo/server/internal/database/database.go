package database

import (
	"database/sql"
)

type DBClient struct {
	*sql.DB
}

func NewDBClient(dsn string) (*DBClient, error) {
	dbClient, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}
	err = dbClient.Ping()
	if err != nil {
		return nil, err
	}
	return &DBClient{dbClient}, nil

}
