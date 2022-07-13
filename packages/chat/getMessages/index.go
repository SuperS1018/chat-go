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

    fmt.Println("messageKey", messageKey)
    fmt.Println("redisURL", redisURL)
    fmt.Println("redisPassword", redisPassword)

    // connection
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

    // get user list
    len, err := client.LLen(messageKey).Result()
    if err != nil {
        panic(err)
    }

    messageList, err := client.LRange(messageKey, 0, (len - 1)).Result()
    if err != nil {
        panic(err)
    }

    fmt.Println("messageList", messageList)

    // parse json
    type Message struct {
        Username string
        Message string
        Timestamp int64
    }

    var newMessageList []Message
    var message Message
    for _, msg := range messageList {
        json.Unmarshal([]byte(msg), &message)
        newMessageList = append(newMessageList, message)
    }

    // sort list
    sort.Slice(newMessageList[:], func(i, j int) bool {
        return newMessageList[i].Timestamp < newMessageList[j].Timestamp
    })
    
    response["body"] = messageKey
    return response
}
