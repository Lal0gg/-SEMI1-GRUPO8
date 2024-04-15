package handlers

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/rekognition"
	"github.com/aws/aws-sdk-go-v2/service/rekognition/types"
)

type PageUrl struct {
	Body struct {
		Url string `json:"url" doc:"URL de la página a traducir" example:"https://proyecto-semi-g8.s3.us-east-2.amazonaws.com/series/1/ch-1/1.png"`
	}
}

type Transcription struct {
	Body struct {
		Lines []*Line `json:"lines"`
	}
}

type Polygon struct {
	X float32 `json:"x"`
	Y float32 `json:"y"`
}

type Line struct {
	Text        string     `json:"text" doc:"Línea de texto transcrito"`
	Polygons    []*Polygon `json:"polygon" doc:"Puntos que forman un polígono"`
	BoundingBox struct {
		Height float32 `json:"height"`
		Width  float32 `json:"width"`
		Left   float32 `json:"left"`
		Top    float32 `json:"top"`
	} `doc:"Dimensiones de la línea"`
}

func (e *Env) TransciptPageHandler(ctx context.Context, p *PageUrl) (*Transcription, error) {
	text, err := e.RekogClient.DetectText(
		ctx,
		&rekognition.DetectTextInput{
			Image: &types.Image{
				S3Object: &types.S3Object{
					Bucket: aws.String("proyecto-semi-g8"),
					Name:   aws.String(p.Body.Url[52:]),
				},
			},
		},
	)
	if err != nil {
		return nil, err
	}
	trscr := &Transcription{}
	trscr.Body.Lines = make([]*Line, 0)
	for _, detection := range text.TextDetections {
		if detection.Type == types.TextTypesLine {
			line := new(Line)
			line.Text = *detection.DetectedText
			line.Polygons = make([]*Polygon, 0)
			line.BoundingBox.Height = *detection.Geometry.BoundingBox.Height
			line.BoundingBox.Width = *detection.Geometry.BoundingBox.Width
			line.BoundingBox.Left = *detection.Geometry.BoundingBox.Left
			line.BoundingBox.Top = *detection.Geometry.BoundingBox.Top
			for _, point := range detection.Geometry.Polygon {
				line.Polygons = append(line.Polygons, &Polygon{X: *point.X, Y: *point.Y})
			}
			trscr.Body.Lines = append(trscr.Body.Lines, line)
		}
	}
	return trscr, nil
}
