# Cryptostats Application
![Conversation example](https://i.imgur.com/MMqCLRh.png)

This is the Cryptostats Application project that I have built from the
ground up. This application allows you to
check your transactions list from the Coinbase. In the future I will add more widgets and different features.

Technologies used in the project:
<br>
Frontend:
  * React.js
  * Chakra UI 
  * Redux Toolkit.

Backend:
  + Nest.js
  + MongoDB
  + Mongoose
  + Redis
  + Coinbase API

For authentication i used sessions, they saved in the redis database in order to decrease latency and impove user experience. I used Docker compose to up docker container with redis database.
