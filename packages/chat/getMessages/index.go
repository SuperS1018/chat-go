package main

import (
    "github.com/go-redis/redis"
    "crypto/tls"
    "encoding/json"
    "sort"
    "fmt"
)

func Main(args map[string]interface{}) map[string]interface{} {
    response := make(map[string]interface{})
    messageKey := args["messageKey"].(string)
    redisURL := args["redisURL"].(string)
    redisPassword := args["redisPassword"].(string)

    client := redis.NewClient(&redis.Options{
        TLSConfig: &tls.Config{
            MinVersion: tls.VersionTLS12,
        },
        Addr: redisURL,
        Password: redisPassword,
        DB: 0,
    })

    pong, err := client.Ping().Result()
    if err != nil {
        panic(err)
    }
    fmt.Println("pong", pong)

    len, err := client.LLen(messageKey).Result()
    if err != nil {
        panic(err)
    }
    fmt.Println("len", len)

    msgs, err := client.LRange(messageKey, 0, (len - 1)).Result()
    if err != nil {
        panic(err)
    }
    fmt.Println("messages", msgs)

    type Message struct {
        Username string
        Message string
        Timestamp int64
    }

    var newMsgs []Message
    var message Message
    for _, msg := range msgs {
        json.Unmarshal([]byte(msg), &message)
        newMsgs = append(newMsgs, message)
    }

    fmt.Println("m", newMsgs)
    sort.Slice(newMsgs[:], func(i, j int) bool {
        return newMsgs[i].Timestamp < newMsgs[j].Timestamp
    })
    response["body"] = newMsgs
    return response
}