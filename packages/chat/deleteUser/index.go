package main

import (
    "github.com/go-redis/redis"
    "crypto/tls"
    "fmt"
)

func Main(args map[string]interface{}) map[string]interface{} {
    response := make(map[string]interface{})
    userKey := args["userKey"].(string)
    redisURL := args["redisURL"].(string)
    redisPassword := args["redisPassword"].(string)
    username, ok := args["username"].(string)

    if ok == false {
        response["body"] = "username is required"
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

    for _, user := range userList {
        if user == username {
            del, err := client.LRem(userKey, 1, username).Result()
            if err != nil {
                panic(err)
            }
            fmt.Println("del", del)
            response["body"] = "The user is successfully deleted"
            response["statusCode"] = 200
            return response
        }
    }

    response["body"] = "username is not matched"
    response["statusCode"] = 400
    return response
}