package database

import "github.com/aws/aws-sdk-go-v2/aws"

type SingleNote struct {
	Username string `json:"username" doc:"Nombre del usuario que puso la nota"`
	Value    int    `json:"value" doc:"Nota puesta por el usuario" minimum:"1" maximum:"10"`
}

func (db *DBClient) GetNotes(serieID int) ([]SingleNote, *float64, error) {
	rows, err := db.Query(`
	SELECT usr.username, note.value 
	FROM note 
	JOIN usr ON note.id_usr = usr.id_usr
	WHERE note.id_serie = $1;`, serieID)
	if err != nil {
		return nil, nil, err
	}
	defer rows.Close()
	notes := []SingleNote{}
	var value float64
	for rows.Next() {
		note := SingleNote{}
		err := rows.Scan(&note.Username, &note.Value)
		if err != nil {
			return nil, nil, err
		}
		notes = append(notes, note)
		value += float64(note.Value)
	}
	average := aws.Float64(value / float64(len(notes)))
	return notes, average, nil
}
