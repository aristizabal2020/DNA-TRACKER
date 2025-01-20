require('dotenv').config();
const axios = require('axios');
const { Client, GatewayIntentBits, Events } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

client.once(Events.ClientReady, readyClient => {
  console.log(`Connected as ${readyClient.user.tag}`);
  console.log(`Connected in ${readyClient.guilds.cache.size} Guild(s)`);
  readyClient.user.setPresence({ activities: [{ name: 'Updating price...' }], status: 'online' });
});

const updatePrice = async () => {
  try {
    // Petición a la API
    const response = await axios.get(
      "https://api.geckoterminal.com/api/v2/networks/world-chain/tokens/0xed49fe44fd4249a09843c2ba4bba7e50beca7113"
    );

    // fetching price DNA
    const price = response.data.data.attributes.price_usd;

    if (price) {
      // update status
      client.user.setPresence({ activities: [{ name: `$${price} USD` }]});
      
    } else {
      console.warn("Price not available.");
    }
  } catch (error) {
    console.error("Error updating price:", error.message);
  }
};

// Update every 10 seconds
setInterval(updatePrice, 10000);

// Log in Discord 
client.login(process.env.TOKEN_BOT);
