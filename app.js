const express = require("express");
const path = require("path");
const bodyparser =  require("body-parser");
const app = express();
const mongoose = require("mongoose");

// mongoose.connect('mongodb://localhost:27017/myanime', {useNewUrlParser: true});
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended : true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("landing");
})

// let animeschema = new mongoose.Schema({
//     name: String,
//     imgurl: String,
//     desc: String
// })

// let Anime = mongoose.model("Anime",animeschema);

// Anime.create(
//     {
//     name: "Yahari",
//     imgurl: "https://cdn.myanimelist.net/images/anime/1910/106073.jpg",
//     desc:"sodeeeee"
//     }, function(error, anime){
//         if(error){
//             console.log("ERROR!");
//         }else{
//             console.log("ADDED");
//             console.log(anime);
//         }   
// });

// let = anime = [ 
//     {name: "Re-Zero",imgurl: "https://cdn.myanimelist.net/images/anime/1010/100084.jpg",value:"1"},
//     {name: "Yahari ",imgurl: "https://cdn.myanimelist.net/images/anime/1910/106073.jpg",value:"2"},
//     {name: "SAO",imgurl: "https://cdn.myanimelist.net/images/anime/1438/105106.jpg",value:"3"},
//     {name: "Maou Gakuin no Futekigousha",imgurl: "https://cdn.myanimelist.net/images/anime/1388/105332.jpg",value:"4"},
//     {name: "Princess Connect Re:Dive",imgurl: "https://cdn.myanimelist.net/images/anime/1810/106070.jpg",value:"5"},
//     {name: "Kanojo, Okarishimasu",imgurl: "https://cdn.myanimelist.net/images/anime/1920/104817.jpg",value:"6"},
//     {name: "Tonikaku Kawaii",imgurl: "https://cdn.myanimelist.net/images/anime/1279/106298.jpg",value:"7"},
//     {name: "Mahouka Koukou no Rettousei: Raihousha-hen",imgurl: "https://cdn.myanimelist.net/images/anime/1788/106668.jpg",value:"8"}
// ];

app.get("/Resume", function(req, res){
    res.render("Resume");
})

app.get("/Find_a_job", function(req, res){
    res.render("Find_a_job");
})

app.get("/History", function(req, res){
    res.render("History");
})

app.get("/Liked", function(req, res){
    res.render("Liked");
})

app.get("/login", function(req, res){
    res.render("login");
})

app.get("/register", function(req, res){
    res.render("register");
})

// app.get("/anime/new", function(req, res){
//     res.render("addnewanime");
// })

// app.get("/anime/:id", function(req,res){
//     Anime.findById(req.params.id, function(error, animedetail){
//         if(error){
//             console.log("ERROR1")
//         }else{
//             res.render("showdetail", {anime:animedetail});
//         }
//     });
// });

// app.get("/index", function(req, res){
//     Anime.find({},function(error, allAnime){
//         if(error){
//             console.log("ERROR2");
//         }else{
//             res.render("collection", {anime:allAnime});
//         }
//     })
    
// })

// app.post("/index", function(req, res){
//     let n_name = req.body.name;
//     let n_image = req.body.imgurl;
//     let n_anime = {name:n_name,imgurl:n_image}
//     Anime.create(n_anime, function(error, newanime){
//         if(error){
//             console.log("error")
//         }else{
//             console.log("NEW ANIME ADDED");
//             res.redirect("/index");
//         }
//     })
// })

app.listen(3000, function(res,req){
    console.log("MY COLLECTION")
})