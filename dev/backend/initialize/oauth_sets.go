package initialize

import (
	"github.com/asragi/RinGo/infrastructure/mysql"
	"github.com/asragi/RinGo/oauth"
	"github.com/google/wire"
)

var oauthSet = wire.NewSet(
	mysql.CreateFindUserByGoogleId,
	mysql.CreateInsertOAuthLink,
	mysql.CreateFindOAuthLinkByUserId,
	oauth.NewHandler,
)
