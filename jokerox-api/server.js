const express = require("express")
const fetch = require("node-fetch")

const app = express()

app.use(express.json())

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REFRESH_TOKEN = process.env.REFRESH_TOKEN


async function getAccessToken(){

const auth = Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64")

const res = await fetch("https://accounts.spotify.com/api/token",{
method:"POST",
headers:{
Authorization:"Basic "+auth,
"Content-Type":"application/x-www-form-urlencoded"
},
body:"grant_type=refresh_token&refresh_token="+REFRESH_TOKEN
})

const data = await res.json()

return data.access_token
}


app.post("/queue", async (req,res)=>{

try{

const trackId = req.body.track_id

if(!trackId){
return res.status(400).send({error:"track_id missing"})
}

const token = await getAccessToken()

await fetch(`https://api.spotify.com/v1/me/player/queue?uri=spotify:track:${trackId}`,{
method:"POST",
headers:{
Authorization:"Bearer "+token
}
})

res.send({status:"queued", track:trackId})

}catch(e){

res.status(500).send({error:e.toString()})

}

})


app.get("/",(req,res)=>{
res.send("Jukerox API running")
})


app.listen(process.env.PORT || 3000,()=>{
console.log("Server started")
})