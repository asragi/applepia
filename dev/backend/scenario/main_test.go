package scenario

import (
	"context"
	"fmt"
	"github.com/asragi/RinGo/auth"
	"github.com/asragi/RinGo/core"
	"github.com/asragi/RinGo/core/game/shelf"
	"github.com/asragi/RinGo/database"
	"github.com/asragi/RinGo/debug"
	"github.com/asragi/RinGo/initialize"
	"github.com/asragi/RinGo/server"
	"github.com/asragi/RinGo/test"
	"log"
	"os"
	"testing"
	"time"
)

var port = 4445

func TestMain(m *testing.M) {
	secretKey := auth.SecretHashKey("secret-for-test")
	constants := &initialize.Constants{
		InitialFund:        core.Fund(100000),
		InitialMaxStamina:  core.MaxStamina(6000),
		InitialPopularity:  shelf.ShopPopularity(0),
		UserIdChallengeNum: 3,
	}
	db, purge, err := test.CreateTestDB("ringo-mysql-scenario-test-image", "../test/db_for_test/Dockerfile")
	if err != nil {
		log.Printf("Could not create test DB: %s", err)
		os.Exit(1)
	}
	dba := database.NewDBAccessor(db, db)
	endpoints := initialize.CreateEndpoints(secretKey, constants, dba.Exec, dba.Query)
	tools := initialize.CreateTools(dba.Exec)
	serve, stopDB, err := server.SetUpServer(port, endpoints)
	if err != nil {
		log.Printf("Could not set up server: %s", err)
		if purgeErr := purge(); purgeErr != nil {
			log.Printf("Could not purge resource: %s", purgeErr)
		}
		os.Exit(1)
	}
	go func() {
		err = serve()
		if err != nil {
			log.Printf("Http Server Error: %v", err)
			return
		}
	}()
	time.Sleep(1 * time.Second)
	ctx := context.Background()
	err = tools.RegisterAdmin(ctx, "admin", "admin")
	if err != nil {
		log.Printf("Could not register admin: %s", err)
		stopDB()
		if purgeErr := purge(); purgeErr != nil {
			log.Printf("Could not purge resource: %s", purgeErr)
		}
		os.Exit(1)
	}
	err = debug.CreateAddInitialPeriod(dba.Exec)(ctx)
	if err != nil {
		log.Printf("Could not add initial period: %s", err)
		stopDB()
		if purgeErr := purge(); purgeErr != nil {
			log.Printf("Could not purge resource: %s", purgeErr)
		}
		os.Exit(1)
	}
	exitCode := m.Run()
	stopDB()
	if err = purge(); err != nil {
		log.Printf("Could not purge resource: %s", err)
	}
	os.Exit(exitCode)
}

func TestE2E(t *testing.T) {
	address := fmt.Sprintf("localhost:%d", port)
	ctx := context.Background()
	result := parallelScenario(ctx, 1, address)
	for _, r := range result {
		if r.err != nil {
			t.Errorf("error: %+v", r.err)
		}
	}
}
