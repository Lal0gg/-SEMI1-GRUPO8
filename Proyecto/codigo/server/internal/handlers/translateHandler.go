package handlers

import (
	"bytes"
	"context"
	"fmt"
	"io"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/polly"
	pt "github.com/aws/aws-sdk-go-v2/service/polly/types"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	tr "github.com/aws/aws-sdk-go-v2/service/translate"
)

type TranslateInput struct {
	Body struct {
		Input      string  `json:"input" example:"Hello" doc:"Texto a traducir"`
		VoiceLang  string  `json:"voiceLang" doc:"Lenguaje de la voz a usar en la traducción (no puede inferirse)" required:"true" example:"en-US" enum:"en-US,es-ES,ja-JP"`
		SourceLang *string `json:"sourceLang" example:"en" doc:"Lenguaje original del texto a traducir, si no se envía se detecta automáticamente" required:"false"`
	}
}

type TranslateOutput struct {
	Body struct {
		OriginalText  string `json:"originalText" doc:"Texto Original" example:"Hello"`
		AudioURL      string `json:"audioURL" doc:"Enlace al audio con el texto original" example:"https://proyecto-semi-g8.s3.us-east-2.amazonaws.com/audios/en-US-Hola.mp3"`
		TranlatedText string `json:"translatedText" doc:"Traducción del texto" example:"Hola"`
	}
}

func (e *Env) TranslateHandler(ctx context.Context, i *TranslateInput) (*TranslateOutput, error) {
	// generar traducción
	if i.Body.SourceLang == nil {
		i.Body.SourceLang = aws.String("auto")
	}
	tout, err := e.TranslateClient.TranslateText(ctx, &tr.TranslateTextInput{
		SourceLanguageCode: i.Body.SourceLang,
		TargetLanguageCode: aws.String("es"),
		Text:               aws.String(i.Body.Input),
	})
	if err != nil {
		return nil, err
	}
	translation := tout.TranslatedText
	audioLink, err := e.PollyKV.Get(fmt.Sprintf("%s~%s", i.Body.VoiceLang, *translation))
	if err != nil {
		var voiceId pt.VoiceId
		switch i.Body.VoiceLang {
		case "es-ES":
			voiceId = pt.VoiceIdConchita
			break
		case "en-US":
			voiceId = pt.VoiceIdJoanna
			break
		case "ja-JP":
			voiceId = pt.VoiceIdMizuki
			break
		default:
			return nil, fmt.Errorf("Lenguaje de voz no soportado")
		}
		auout, err := e.PollyClient.SynthesizeSpeech(ctx, &polly.SynthesizeSpeechInput{
			VoiceId:      voiceId,
			Text:         &i.Body.Input,
			OutputFormat: pt.OutputFormatMp3,
		})
		if err != nil {
			return nil, err
		}
		keyname := fmt.Sprintf("audios/%s-%s.mp3", i.Body.VoiceLang, *translation)
		var buf bytes.Buffer
		_, err = io.Copy(&buf, auout.AudioStream)
		if err != nil {
			return nil, err
		}
		_, err = e.S3Client.PutObject(ctx, &s3.PutObjectInput{
			Bucket:      aws.String("proyecto-semi-g8"),
			Key:         aws.String(keyname),
			Body:        bytes.NewReader(buf.Bytes()),
			ContentType: aws.String("audio/mp3"),
		})
		if err != nil {
			return nil, err
		}
		audioLink = aws.String(fmt.Sprintf("https://proyecto-semi-g8.s3.us-east-2.amazonaws.com/%s", keyname))
		e.PollyKV.Set(fmt.Sprintf("%s~%s", i.Body.VoiceLang, *translation), *audioLink)
	}
	out := &TranslateOutput{}
	out.Body.OriginalText = i.Body.Input
	out.Body.AudioURL = *audioLink
	out.Body.TranlatedText = *translation
	return out, nil
}
