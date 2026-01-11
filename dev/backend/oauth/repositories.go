package oauth

import (
	"context"
	"github.com/asragi/RinGo/core"
)

type FindUserByGoogleIdFunc func(context.Context, string) (core.UserId, error)

type InsertOAuthLinkFunc func(context.Context, OAuthLink) error

type FindOAuthLinkByUserIdFunc func(context.Context, core.UserId) (*OAuthLink, error)
