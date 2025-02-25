require('dotenv').config();
const axios = require('axios');
const { Client, GatewayIntentBits, Events, ActivityType } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

client.once(Events.ClientReady, readyClient => {
  console.log(`Connected as ${readyClient.user.tag}`);
  console.log(`Connected in ${readyClient.guilds.cache.size} Guild(s)`);
  readyClient.user.setPresence({ activities: [{ name: 'Updating price...', type: ActivityType.Custom  }], status: 'online' });
});

const updatePrice = async () => {
  try {
    
    // Request API
    const response = await axios.get(
      "https://api.geckoterminal.com/api/v2/networks/world-chain/tokens/0xed49fe44fd4249a09843c2ba4bba7e50beca7113"
    );

    if (response) {

      // fetching price DNA
      const price = response.data.data.attributes.price_usd;
  
      if (price) {
        // update status
        client.user.setPresence({ activities: [{ name: `PRICE $${price} USD`, type: ActivityType.Custom  }], status: 'online' });
        
      } else {
        console.warn("Price not available.");
      }
      
    } else {

      client.user.setPresence({ activities: [{ name: 'Error fetching price...' }], status: 'online' });

    }

  } catch (error) {
    console.error("Error updating price:", error.message);
  }
};

// Update every 10 seconds
setInterval(updatePrice, 10000);

// Log in Discord 
client.login(process.env.TOKEN_BOT);
