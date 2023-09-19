
require('dotenv').config();
const express =require('express');
const app = express();
const port = 3000;
const axios = require('axios');

app.use(express.static(__dirname + "/views"));
app.set("view engine", 'ejs');
app.use(express.urlencoded({extended:true}));

async function getTranslate(text) {
    const client_id = process.env.Client_ID; 
    const client_secret = process.env.Client_Secret;
  
    const data = {
      text: text,
      source: 'en',
      target: 'ko'
    };

    const url = "https://openapi.naver.com/v1/papago/n2mt";

    const headers = {
        "X-Naver-Client-Id": client_id,
        "X-Naver-Client-Secret": client_secret
    };
    try {
        const response = await axios.post(url, data, { headers });
        
        if (response.status === 200) {
          const send_data = response.data;
          const trans_data = send_data.message.result.translatedText;
          return trans_data;
        } else {
          console.error("Error Code:", response.status);
          return null;
        }
      } catch (error) {
        console.error("Error:", error);
        return null;
      }
}
app.get('/', async(req,res) => {

    res.render('index', { translatedText : ''});
 })
app.post('/', async (req, res) => {
    const text = req.body.text;
    const translatedText = await getTranslate(text);
    res.render('index', { translatedText });
  });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
