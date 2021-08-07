
## Database setup
we are using cloud version of mongodb to make things smooth 
 - https://account.mongodb.com/
  - get the URl and past it .env file same as below

## Google Thing
https://console.cloud.google.com/home/dashboard?project=dev-access-318110

## .env 
make .env file in root folder
MONGODB_URL= YOUR_MONGODB_URL
OPENAI_API_KEY=YOUR_OPENAI_KEY
- Google signup
  -GOOGLE_CLIENT_SECRET 
  -GOOGLE_CLIENT_ID


## instal packages
- cd saas101
- npm install

## Start
- npm start

## Updates
we are building complete SAAS101 using nodejs,stripe, mongodb Atlas and yes GPT3 
so code I implemented is still not working but I try my best to buid it as soon as possible


##Completed
- social logins adn normal login auths
- calculate tokens used + times user   use this API calling openai



## TODOs
inside ideasAPI
- prompt design  + verification
- Payment system via (Stripe)
