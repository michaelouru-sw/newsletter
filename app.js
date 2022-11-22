const bodyParser = require("body-parser");
const express = require("express");
const  https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    var fName = req.body.firstName;
    var lName = req.body.lastName;
    var email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/3a567f7a30";
    const options = {
        method: "POST",
        auth: "tony:ea77d067227266db058aec857dab562f-us14"
    }

    const response = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", (data) => {
            JSON.parse(data);
        });
        console.log(response);
    });

    response.write(jsonData);
    response.end();

});

app.post("/failure", (req, res) => {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, (req, res) => {
    console.log("Server rinning on port 3000");
});

