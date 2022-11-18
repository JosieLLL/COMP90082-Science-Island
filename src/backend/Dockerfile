FROM golang


WORKDIR /app
COPY . .
RUN go build main.go
EXPOSE 8088
ENTRYPOINT ["./main"]