package handlers

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
)

func (e *Env) getUserId(ctx context.Context, token *string) (*int, error) {
	if token == nil {
		return aws.Int(1), nil
	}
	username, err := e.CognitooIdClient.GetUser(
		ctx,
		&cognitoidentityprovider.GetUserInput{
			AccessToken: token,
		},
	)
	if err != nil {
		return nil, err
	}
	usr, err := e.DB.GetUserID(ctx, *username.Username)
	if err != nil {
		return nil, err
	}
	return usr, nil
}
