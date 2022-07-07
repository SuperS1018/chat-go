package main

import (
    "github.com/go-redis/redis"
    "crypto/tls"
    "encoding/json"
    "time"
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

    // connection
    client := redis.NewClient(&redis.Options{
        TLSConfig: &tls.Config{
            MinVersion: tls.VersionTLS12,
        },
        Addr: redisURL,
        Password: redisPassword,
        DB: 0,
    })

    _, err := client.Ping().Result()
    if err != nil {
        panic(err)
    }

    // check user existed
    len, err := client.LLen(userKey).Result()
    if err != nil {
        panic(err)
    }

    userList, err := client.LRange(userKey, 0, (len - 1)).Result()
    if err != nil {
        panic(err)
    }

    // add new message
    type Message struct {
        Username string
        Message string
        Timestamp int64
    }

    for _, user := range userList {
        if user == username {
            newMessage := Message{
                Username: username,
                Message: message,
                Timestamp: time.Now().UnixNano(),
            }

            stringified, err := json.Marshal(newMessage)
            if err != nil {
                panic(err)
            }

            client.LPush(messageKey, stringified)

            response["body"] = "message is successfully added"
            response["statusCode"] = 200
            return response
        }
    }

    response["body"] = "user is not existed"
    response["statusCode"] = 400
    return response
}