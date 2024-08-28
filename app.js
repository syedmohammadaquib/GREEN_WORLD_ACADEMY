
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const { Template } = require('ejs');
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
app.use(express.urlencoded({ extended: true }));
const dbURL = process.env.ATLAS_URL;
const ID = process.env.ID;
const author_id = process.env.author_id;
const password = process.env.password;


//mongoDB
const mongoose = require('mongoose');
const { Script } = require('vm');
async function main() {
    mongoose.connect(dbURL);

}
main()
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

const schema = new mongoose.Schema({
    title: String,
    description: String
});


const edit = mongoose.model("Gwa", schema);


//static files
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'img')));
app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'lib')));
app.use(express.static(path.join(__dirname, 'scss')));
app.use(express.static(path.join(__dirname, 'node_modules')));

// ejs Template
app.set('view engine', 'ejs');




//routes
app.get('/', (req, res) => {
    res.render('index.ejs');
});
app.get('/about', (req, res) => {
    res.render('about.ejs');
});
app.get('/notice', (req, res) => {
    edit.findById(ID)
        .then((data) => {

            let title_final = data.title;
            let description_final = data.description;
            res.render('notice.ejs', { title: title_final, description: description_final });


        })

});
app.get('/edit', (req, res) => {
    res.render('authentication.ejs');
});
app.get('/contact', (req, res) => {

    res.render('contact.ejs');
});
app.post('/authentication', (req, res) => {

    let { id, password } = req.body;
    if (id == author_id && password == password) {
        res.render('edit.ejs');
    } else {

        edit.findById(ID)
            .then((data) => {

                let title_final = data.title;
                let description_final = data.description;
                res.render('notice.ejs', { title: title_final, description: description_final });


            })


    }


});

app.post('/edit', async (req, res) => {

    let { title, description } = req.body;

    edit.updateOne({}, { title: title, description: description })
        .then()

    edit.findById(ID)
        .then((data) => {

            let title_final = data.title;
            let description_final = data.description;



            res.render('notice.ejs', { title: title_final, description: description_final });


        })
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});