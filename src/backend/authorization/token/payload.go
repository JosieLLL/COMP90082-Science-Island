package token

import (
	"errors"
	"time"
)

var (
	ErrInvalidToken = errors.New("token invalid")
	ErrExpiredToken = errors.New("token expired")
)

type Payload struct {
	Userid    string    `json:"userid"`
	IssuedAt  time.Time `json:"issued_at"`
	ExpiredAt time.Time `json:"expired_at"`
}

func NewPayload(userid string, duration time.Duration) (*Payload, error) {
	payload := &Payload{
		Userid:    userid,
		IssuedAt:  time.Now(),
		ExpiredAt: time.Now().Add(duration),
	}
	return payload, nil
}

func (payload *Payload) Valid() error {
	if time.Now().After(payload.ExpiredAt) {
		return ErrExpiredToken
	}
	return nil
}
