import express from 'express';
import cors from 'cors';
import  bodyParser  from 'body-parser'
import { sample_foods, sample_users } from './data';
import jwt from "jsonwebtoken";

const app = express();
app.use(cors({
    credentials:true,
    origin:["http://localhost:4200"]
}));

// create application/json parser
var jsonParser = bodyParser.json()

app.get("/api/foods",(req,res)=>{
    res.send(sample_foods);
});

app.get("/api/foods/search/:searchTerm", (req, res) => {
    const searchTerm = req.params.searchTerm;
    const foods =  sample_foods
    .filter((food) =>food.name.toLowerCase()
    .includes(searchTerm.toLowerCase()));
    res.send(foods);
});

app.get("/api/foods/tags", (req, res) => {
    res.send(sample_foods);
});

app.get("/api/foods/tag/:tagName", (req, res) => {
    const tagName = req.params.tagName;
    const foods = sample_foods
    .filter(food => food.tags?.includes(tagName));
  res.send(foods);
});

app.get("/api/foods/:foodId", (req, res) => {
    console.log('001')
    const foodId = req.params.foodId;
    const food = sample_foods.filter(food => food.id == foodId);
  res.send(food);
});

app.post("/api/users/login",jsonParser,(req,res)=>{
    const {email,password} = req.body; // Destructuring Assignment
    const user = sample_users.find(user => user.email == email 
        && user.password == password)
    if (user){
        let token = generateTokenResponse(user);
        console.log(token);
        user.token = token;
        res.send(user);
    }
    else{
        res.status(400).send('User name or password is not valid!')
    }
});


const jwtKey = "my_secret_key"
const jwtExpirySeconds = 300
const generateTokenResponse = (user:any)=>{
    let email = user.email;
    const token = jwt.sign({email }, jwtKey, {
		algorithm: "HS256",
		expiresIn: jwtExpirySeconds,
	})
    return token;
}


const port = 5000;
app.listen(port,()=>{
    console.log('Website served on http://localhost:'+port);
});