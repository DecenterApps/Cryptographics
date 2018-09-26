package main

import (
	"log"
	"net/http"

	"github.com/joho/godotenv"
	m "github.com/keighl/mandrill"
	"os"
	"encoding/json"
	"strconv"
	"github.com/go-bongo/bongo"
	"path/filepath"
)

const (
	Address = "127.0.0.1:8888"

	MongoConnectionString = "127.0.0.1:27017"
	MongoDatabase         = "cryptographics"
)

type Print struct {
	bongo.DocumentBase   `bson:",inline"`
	Quantity      int    `json:"quantity"`
	Email         string `json:"email"`
	FirstName     string `json:"firstName"`
	LastName      string `json:"lastName"`
	StreetAddress string `json:"streetAddress"`
	Apartment     string `json:"apartment"`
	City          string `json:"city"`
	Country       string `json:"country"`
	PostalCode    string `json:"postalCode"`
	Phone         string `json:"phone"`
}

func (p Print) String() string {
	return "Quantity: " + strconv.Itoa(p.Quantity) +
		"\n" + "Email: " + p.Email +
		"\n" + "FirstName: " + p.FirstName +
		"\n" + "LastName: " + p.LastName +
		"\n" + "StreetAddress: " + p.StreetAddress +
		"\n" + "Apartment: " + p.Apartment +
		"\n" + "City: " + p.City +
		"\n" + "Country: " + p.Country +
		"\n" + "PostalCode: " + p.PostalCode +
		"\n" + "Phone: " + p.Phone
}

type Response struct {
	Ok      bool   `json:"ok"`
	Message string `json:"message"`
}

var connection *bongo.Connection

func main() {
	envAbsPath, _ := filepath.Abs("../.env")
	err := godotenv.Load(envAbsPath)
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	bongoConfig := &bongo.Config{
		ConnectionString: MongoConnectionString,
		Database:         MongoDatabase,
	}

	connection, err = bongo.Connect(bongoConfig)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Server started on: http://" + Address)
	http.HandleFunc("/print-form", form)
	http.ListenAndServe(Address, nil)
}

func form(w http.ResponseWriter, r *http.Request) {
	var p Print

	err := json.NewDecoder(r.Body).Decode(&p)
	if err != nil {
		res, _ := json.Marshal(Response{Ok: false, Message: "unable to decode input"})
		w.Write(res)
		return
	}

	sendMail(p)
	connection.Collection("form").Save(&p)

	res, _ := json.Marshal(Response{Ok: true})
	w.Write(res)
}

func sendMail(p Print) (response []*m.Response, err error) {
	client := m.ClientWithKey(os.Getenv("API_KEY"))

	message := &m.Message{}
	message.AddRecipient("print@decenter.com", "Decenter", "to")
	message.FromEmail = "contact@decenter.com"
	message.FromName = p.FirstName + " " + p.LastName
	message.Subject = "Cryptographics print form"
	message.Headers = map[string]string{"Reply-To": p.Email}
	message.Text = p.String()

	return client.MessagesSend(message)
}
