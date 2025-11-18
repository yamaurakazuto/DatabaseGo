package main

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

type Todo struct {
	ID        int64
	Title     string
	Done      bool
	CreatedAt int64
}

func main() {
	dsn := "root:Yamakazu510@tcp(127.0.0.1:3306)/testdb?parseTime=true"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal("mysqlへ接続できません", err)
	}

	log.Println("接続成功")
}
