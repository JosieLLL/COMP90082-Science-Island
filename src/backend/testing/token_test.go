package testing

import (
	token "SC-Redback/src/backend/authorization/token"
	"SC-Redback/src/backend/utils"

	"github.com/stretchr/testify/assert"

	"testing"
	"time"
)

func TestExpiredPasetoToken(t *testing.T) {
	pasetokey := utils.RandomString(32)
	userid := utils.RandomString(32)

	// wrong key length
	_, err := token.NewPasetoMaker("")
	assert.Error(t, err)

	maker, err := token.NewPasetoMaker(pasetokey)
	assert.NoError(t, err)

	// invalid token
	wrong_token, err := maker.CreateToken(userid, -time.Minute)
	assert.NoError(t, err)
	assert.NotEmpty(t, wrong_token)

	wrong_payload, err := maker.VerifyToken(wrong_token)
	assert.Error(t, err)
	assert.EqualError(t, err, token.ErrExpiredToken.Error())
	assert.Nil(t, wrong_payload)

	token, err := maker.CreateToken(userid, time.Minute)
	assert.NoError(t, err)
	assert.NotEmpty(t, token)

	payload, err := maker.VerifyToken(token)
	assert.NoError(t, err)
	assert.NotEmpty(t, payload)
}
