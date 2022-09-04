const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const moment = require("moment");

const { response } = require('express');
const port = process.env.PORT || 3000;
var axios = require("axios").default;
const server = require('http').createServer(app)

const currentDate = moment().format("YYYY[-]MM[-]DD")


const User = require('./models/userModel');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken')

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const PromoModel = require('./models/MegaPromos');
const PopUpAdModel = require('./models/PopUpAds');
const Control = require('./models/Production');


app.use(bodyParser.json())


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

const connectDB = async () => {
    try {
      await mongoose.connect('mongodb+srv://db-travel-blog:7JMCcvz0SSuvm6MA@cluster0.5ekbc.mongodb.net/ads_db?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MONGODB: Default Connection Established");
    } catch (error) {
      console.log(error);
    }   
 }

connectDB()

app.get('/production', async(request, response) => {

    try{
        const control = await Control.find()

        response.json(control)
        
    }catch(e){
        response.json({message: e})
    }
})

app.get('/get-schedule', async (request, response) => {

    var schedules = []

    try{

        const promo = await PromoModel.find()
        const pop_up_ads = await PopUpAdModel.find()
        const tips = await axios.post(`https://sleepy-turing-6de1dd.netlify.app/.netlify/functions/api/horse-news/tips?page=1&video_categories=9`)
        const data = await axios.get('https://www.3wehorse.com/wp-json/wp/v2/h_schedule?per_page=50')
    
        data.data.forEach((e) => {
            // var d = new Date(e['ACF'].date)
            var cards = e['ACF'].horse_race_card ? e['ACF'].horse_race_card : []  
            // if(d >= new Date(currentDate)){
                schedules.push({
                    date_gmt: e['date_gmt'],
                    date: e['ACF'].date,
                    country: e['ACF'].country,
                    datetime_option: e['ACF'].datetime_option,
                    horse_race_card: cards
                })
            // }
        });

        response.json({
            scheds: schedules,
            promos: promo,
            tips: tips.data,
            pop_ads: pop_up_ads
        })

    }catch (e){
        response.json({message:e})
    }

})

app.get('/get-promos', async (request, response) => {

    try{
        const promo = await PromoModel.find()
        response.json(promo)

      }catch(err){
   
           response.json({message: err})
       }
})

app.get('/get-post', async (request, response) => {

    var posts = []

    try{
        const data = await axios.get('https://www.3wehorse.com/wp-json/wp/v2/posts')

        data.data.forEach((e) => {
            posts.push({
                title: e['yoast_head_json'].og_title,
                description: e['yoast_head_json'].og_description,
                imgUrl: e['yoast_head_json'].og_image[0].url,
                published_time: e['yoast_head_json'].article_published_time
            })
        })

        response.json(posts)
    }
    catch (e){
        response.json({message: e})
    }
})


//TODO: LOGIN==REGISTER HERE-------------
app.post('/register', async (req, res) => {
    try{
       var newUser = new User(req.body);
       newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
       newUser.save(function(err, user) {
         if (err) {
           return res.status(400).json({ message: 'User email already exist or not valid'});
         } else {
           user.hash_password = undefined;
           return res.json(user);
         }
       });
    }catch(err){
       res.json(err)
    }
    
 });
 
 app.post('/login', async (req, res) => {
    try{
       User.findOne({
          email: req.body.email
       }, function(err, user) {
          if (err) throw err;
          if (!user || !user.comparePassword(req.body.password)) {
             return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
          }
          return res.json({ 
            token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id}, 'RESTFULAPIs'),
            user: user });
       });
    }catch(err){
       res.json(err)
    } 
 });



server.listen(port,'0.0.0.0', () => console.log(`${port}'app is running'`));


// var entemp = [];
// var zhtemp = [];

// const postsEn = await axios
// .get('https://weibosports.com/wp-json/wp/v2/posts?per_page=5')
// const postsZh = await axios
// .get('https://weibofootball.com/wp-json/wp/v2/posts?per_page=5&categories=5,6,7,8,9,10')


// console.log('hello')

// postsEn.data.forEach((itemPost) => {
//     entemp.push({
//       id: itemPost['id'],
//       imageUrl: itemPost['yoast_head_json'].og_image[0].url,
//       title: itemPost['title'].rendered,
//       description: itemPost['content'].rendered + itemPost['excerpt'].rendered,
//       category: itemPost['categories'],
//       date: itemPost['date'] 
// })
