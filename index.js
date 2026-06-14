const {
  Client,
  GatewayIntentBits,
  Partials
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

const TOKEN = process.env.TOKEN;

const messageId = '1515820566119055470';

const teams = {
  '🟣': {
    name: 'Knight',
    users: []
  },
  '🟠': {
    name: 'Shooters',
    users: []
  },
  '🔵': {
    name: 'Druid',
    users: []
  }
};

async function updateMessage(message) {
  let content = '';

  for (const emoji in teams) {
    const team = teams[emoji];

    content += `${emoji} ${team.name}\n`;

    if (team.users.length === 0) {
      content += 'Brak osób\n\n';
    } else {
      team.users.forEach((user, index) => {
        content += `${index + 1}. ${user}\n`;
      });

      content += '\n';
    }
  }

  await message.edit(content);
}

client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;

  if (reaction.message.id !== messageId) return;

  const emoji = reaction.emoji.name;

  if (!teams[emoji]) return;

  const username = user.username;

  for (const key in teams) {
    teams[key].users = teams[key].users.filter(u => u !== username);
  }

  teams[emoji].users.push(username);

  await updateMessage(reaction.message);
});

client.on('messageReactionRemove', async (reaction, user) => {
  if (user.bot) return;

  if (reaction.message.id !== messageId) return;

  const emoji = reaction.emoji.name;

  if (!teams[emoji]) return;

  const username = user.username;

  teams[emoji].users =
    teams[emoji].users.filter(u => u !== username);

  await updateMessage(reaction.message);
});

client.once('ready', () => {
  console.log(`Zalogowano jako ${client.user.tag}`);
});

client.login(TOKEN);
