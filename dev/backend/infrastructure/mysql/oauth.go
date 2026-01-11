package mysql

import (
	"context"
	"fmt"

	"github.com/asragi/RinGo/core"
	"github.com/asragi/RinGo/database"
	"github.com/asragi/RinGo/oauth"
)

func CreateFindUserByGoogleId(q database.QueryFunc) oauth.FindUserByGoogleIdFunc {
	return func(ctx context.Context, googleId string) (core.UserId, error) {
		handleError := func(err error) (core.UserId, error) {
			return "", fmt.Errorf("find user by google id: %w", err)
		}
		query := `SELECT user_id FROM ringo.user_oauth_links WHERE provider = :provider AND provider_id = :provider_id`
		type req struct {
			Provider   string `db:"provider"`
			ProviderId string `db:"provider_id"`
		}
		rows, err := q(ctx, query, req{Provider: string(oauth.ProviderGoogle), ProviderId: googleId})
		if err != nil {
			return handleError(err)
		}
		defer rows.Close()
		if !rows.Next() {
			return "", oauth.ErrOAuthLinkNotFound
		}
		var userId core.UserId
		if err := rows.Scan(&userId); err != nil {
			return handleError(err)
		}
		return userId, nil
	}
}

func CreateInsertOAuthLink(exec database.ExecFunc) oauth.InsertOAuthLinkFunc {
	return func(ctx context.Context, link oauth.OAuthLink) error {
		handleError := func(err error) error {
			return fmt.Errorf("insert oauth link: %w", err)
		}
		query := `INSERT INTO ringo.user_oauth_links (user_id, provider, provider_id, email) VALUES (:user_id, :provider, :provider_id, :email)`
		type req struct {
			UserId     core.UserId `db:"user_id"`
			Provider   string      `db:"provider"`
			ProviderId string      `db:"provider_id"`
			Email      string      `db:"email"`
		}
		_, err := exec(ctx, query, req{
			UserId:     link.UserId,
			Provider:   string(link.Provider),
			ProviderId: link.ProviderId,
			Email:      link.Email,
		})
		if err != nil {
			return handleError(err)
		}
		return nil
	}
}

func CreateFindOAuthLinkByUserId(q database.QueryFunc) oauth.FindOAuthLinkByUserIdFunc {
	return func(ctx context.Context, userId core.UserId) (*oauth.OAuthLink, error) {
		handleError := func(err error) (*oauth.OAuthLink, error) {
			return nil, fmt.Errorf("find oauth link by user id: %w", err)
		}
		query := `SELECT user_id, provider, provider_id, email FROM ringo.user_oauth_links WHERE user_id = :user_id AND provider = :provider`
		type req struct {
			UserId   core.UserId `db:"user_id"`
			Provider string      `db:"provider"`
		}
		rows, err := q(ctx, query, req{UserId: userId, Provider: string(oauth.ProviderGoogle)})
		if err != nil {
			return handleError(err)
		}
		defer rows.Close()
		if !rows.Next() {
			return nil, oauth.ErrOAuthLinkNotFound
		}
		var link oauth.OAuthLink
		var provider string
		if err := rows.Scan(&link.UserId, &provider, &link.ProviderId, &link.Email); err != nil {
			return handleError(err)
		}
		link.Provider = oauth.Provider(provider)
		if err := rows.Err(); err != nil {
			return handleError(err)
		}
		return &link, nil
	}
}
