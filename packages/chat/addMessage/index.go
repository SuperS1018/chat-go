package main

import (
    "github.com/go-redis/redis"
    "crypto/tls"
    "encoding/json"
    "time"
    "fmt"
)

func Main(args map[string]interface{}) map[string]interface{} {
    response := make(map[string]interface{})
    userKey := args["userKey"].(string)
    messageKey := args["messageKey"].(string)
    redisURL := args["redisURL"].(string)
    redisPassword := args["redisPassword"].(string)
    username, usernameOk := args["username"].(string)
    message, messageOk := args["message"].(string)

    if usernameOk == false {
        response["body"] = "username is required"
        response["statusCode"] = 400
        return response
    }

    if messageOk == false {
        response["body"] = "message is required"
        response["statusCode"] = 400
        return response
    }

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

    len, err := client.LLen(userKey).Result()
    if err != nil {
        panic(err)
    }
    fmt.Println("len", len)

    userList, err := client.LRange(userKey, 0, (len - 1)).Result()
    if err != nil {
        panic(err)
    }
    fmt.Println("userList", userList)

    type Message struct {
        Username string
        Message string
        Timestamp int64
    }

    for _, user := range userList {
        if user == username {
            m := Message{
                Username: username,
                Message: message,
                Timestamp: time.Now().UnixNano(),
            }
            fmt.Println("m", m)
            b, err := json.Marshal(m)
            if err != nil {
                panic(err)
            }
            fmt.Println("b", b)
            client.LPush(messageKey, b)
            response["body"] = "message is successfully added"
            response["statusCode"] = 200
            return response
        }
    }

    response["body"] = "user is not existed"
    response["statusCode"] = 400
    return response
}