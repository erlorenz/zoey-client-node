const { Client } = require("../../dist/index");

const config = {
  siteUrl: process.env.ZOEY_SITE_URL,
  auth: {
    consumerKey: process.env.ZOEY_CONSUMER_KEY,
    consumerSecret: process.env.ZOEY_CONSUMER_SECRET,
    accessToken: process.env.ZOEY_ACCESS_TOKEN,
    tokenSecret: process.env.ZOEY_TOKEN_SECRET,
  },
};

new Client(config);

async function run() {
  console.log(
    await Client.makeRequest("http://jsonplaceholder.typicode.com/posts/1")
  );
}

run();
