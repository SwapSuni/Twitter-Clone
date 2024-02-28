import express from 'express';
const app = express();
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import RazorPay from 'razorpay';
import postModel from './models/post-model.js';
import userModel from './models/user-model.js';
import moment from 'moment-timezone';

dotenv.config();

const uri = `mongodb+srv://swapnilsunil852hitece2020:${process.env.PASSWORD}@cluster1.funxgqj.mongodb.net/Twitter`;

async function run() {
  try {
    await mongoose.connect(uri,{}).then(() => console.log("Database connected"));
    const postCollection = postModel;
    const userCollection = userModel;

    app.get('/post', async (req, res) => {
      // const post = (await postCollection.find().toArray()).reverse();
      // res.send(post);
      await postCollection.find()
      .then(docs=>{
        const resultArray = docs.map(doc => doc.toObject());
        res.send(resultArray.reverse());
      })
    })

    app.get('/findUser', async(req, res)=>{
      const email= req.query.email;
      // console.log(email);
      const user= await userCollection.find({email : email});
      console.log(user);
      if(user.length > 0){
        res.status(200).json({msg: "exist"});
      }
      else res.status(200).json({msg: "fail"});
    })

    app.get('/user', async (req, res) => {
      await userCollection.find()
      .then(docs=>{
        const user= docs.map(docs=> docs.toObject());
        res.send(user);
      })
    })

    app.get('/loggedInUser', async (req, res) => {
      const email = req.query.email;
      await userCollection.find({ email: email })
      .then(docs=>{
        const user= docs.map(doc=> doc.toObject());
        // console.log(user);
        res.send(user);
      })
    })

    app.get('/userPost', async (req, res) => {
      const email = req.query.email;
      await postCollection.find({ email: email })
      .then(docs=>{
        const post= docs.map(doc=> doc.toObject());
        res.send(post.reverse());
      })
    })

    app.post('/post', async (req, res) => {
      const post = req.body;
      const result = await postCollection.create(post);
      res.send(result);
    })

    app.post('/register', async (req, res) => {
      const user = req.body;
      const result = await userCollection.create(user);
      res.send(result);
    })

    app.patch('/userUpdates/:email', async (req, res) => {
      const filter = req.params;
      const profile = req.body;
      const options = { upsert: true };
      const updateDoc = { $set: profile };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })

    app.get('/Isverified', async (req, res) => {
      const email= req.query.email;
      try {
        const user = await userCollection.findOne({ email });
        if (user && user.verified==true) {
          const expiresAt = user.expiresAt;
          const isExpired = new Date(expiresAt) < new Date();
          if (isExpired) {
            await userCollection.updateOne(
              { _id: user._id },
              { $set: { verified: false } }
            )
            res.json({ verified: false });
          }
          else {
            res.json({ verified: user.verified });
          }
        } else {
          res.status(400).json({ verified: false })
        }
      }
      catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }

    })

    app.get('/IsEligible', async(req, res)=>{
      const email=req.query.email;
      const currDate = moment.utc();
      const formattedDate = currDate.format('YYYY-MM-DD');
      const date= formattedDate.toString();
      try{
        const user= await userCollection.findOne({email});
        if(user){
          if(user.numberOfPosts==0){
            await userCollection.updateOne(
              {_id: user._id},
              {$set: {numberOfPosts: user.numberOfPosts+1, lastPost: date}},
            )
            res.json({status: "updated"});
          }
          else{
            const subs= user.subscription;
            if(subs==="regular"){
              if(user.lastPost === date){
                res.json({status: "Subscribe to a higher plan"})
              }
              else{
                await userCollection.updateOne(
                  {_id: user._id},
                  {$set: {numberOfPosts: 1, lastPost: date}},
                )
                res.json({status: "updated"});
              }
            }
            else if(subs==="silver"){
              if(user.subsExpAt < date){
                await userCollection.updateOne(
                  {_id: user._id},
                  {$set : {subscription: "regular", numberOfPosts: 1, lastPost: date}}
                )
                res.json({status:"Plan Expired"})
              }
              else{
                if(user.lastPost === date){
                  if(user.numberOfPosts < 5){
                    await userCollection.updateOne(
                      {_id: user._id},
                      {$set: {numberOfPosts: user.numberOfPosts+1}}
                    )
                    res.json({status:"updated"})
                  }
                  else{
                    res.json({status:"Subscribe to a higher plan"});
                  }
                }
                else{
                  await userCollection.updateOne(
                    {_id: user._id},
                    {$set: {numberOfPosts: 1, lastPost: date}}
                  )
                  res.json({status: "updated"});
                }
              }
            }
            else{
              if(user.subsExpAt < date){
                await userCollection.updateOne(
                  {_id: user._id},
                  {$set : {subscription: "regular", numberOfPosts: 1, lastPost: date}}
                )
                res.json({status:"Plan Expired"})
              }
              else{
                await userCollection.updateOne(
                  {_id: user._id},
                  {$set: {numberOfPosts: user.numberOfPosts+1, lastPost: date}}
                )
                res.json({status:"updated"});
              }
            }
          }
        }
      }
      catch(error){
        console.log(error);
        res.status(500).json({status: "error"});
      }
    })

    app.get('/hide', async(req, res)=>{
      const email= req.query.email;
      const user= await userCollection.findOne({email});
      if(user){
        if(user.hidden=== false){
          await userCollection.updateOne(
            {_id: user._id},
            {$set: {hidden: true}}
          )
          res.json({msg: "hidden"});
        }
        else{
          await userCollection.updateOne(
            {_id: user._id},
            {$set: {hidden: false}}
          )
          res.json({msg: "unhidden"});
        }
      }
    })
  }
  catch (error) {
    console.log(error);
  }
} run().catch(console.dir);

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.send('Hello World')
})

//RaZorPay Implementation

import { checkout, paymentVerification } from "./paymentController.js";

export const instance = new RazorPay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_APT_SECRET,
});

app.get("/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);

app.post("/checkout", checkout);
app.post("/paymentVerify", paymentVerification);

//email implementation
import {sendEmail} from "./emailController.js";
app.post("/sendEmail", sendEmail);

app.listen(port, () => {
  console.log(`App listening on ${port}`);
})