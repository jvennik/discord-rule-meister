// Utils
import { guildCreate } from "./utils/guildcreate";
import { isMod } from "./utils/permissions";
import { purge } from "./utils/purge";
import { rebind } from "./utils/rebind";

// DB imports
import { DBCreate } from "./utils/dbcreate";
import { dbget } from "./utils/dbget";
import { run } from "./utils/dbrun";

// Emoji collectors
import { setupAddEmojiCollector } from "./collectors/setup-add-emoji-collector.js";
import { setupRemoveEmojiCollector } from "./collectors/setup-remove-emoji-collector.js";

// Setup config & Discord client
const config = require("config");
const Discord = require("discord.js");

const client = new Discord.Client();
const prefix = config.general.commandPrefix;

client.on("ready", async () => {
  client.user.setUsername(config.general.botUsername);
  await DBCreate();

  // Find existing message & rebind
  client.guilds.forEach(guild => {
    rebind(client, guild);
  });

  console.log("Ready");
});

client.on("error", async () => {
  // Add error logging
});

client.on("guildCreate", async guild => {
  console.log("Creating guild: " + guild.name);
  await guildCreate(guild.id);
});

client.on("guildDelete", async guild => {
  console.log("Deleting guild: " + guild.name);
  await guildDelete(guild.id);
});

client.on("guildMemberAdd", async member => {
  // Add `initial_role` to new members if it exists
  console.log("Member joined:" + member);
  const sql = `
  SELECT initial_role FROM settings
  WHERE guild = ?
  `;

  const settings = await dbget(sql, [member.guild.id]);
  if (settings.initial_role) {
    const role = member.guild.roles.find(
      role => role.id === settings.initial_role
    );

    member.addRole(role).catch(err => {
      console.error(err);
      console.error("Failed to add initial_role to: " + member);
    });
  }
});

client.on("message", async msg => {
  const isAuthorized = isMod(msg);

  if (msg.content.startsWith(`${prefix}rules`) && isAuthorized) {
    if (msg.content.indexOf("set channel") > 0) {
      // Fetch channel name from message
      const displayChannelName = msg.content.split(" ")[3];
      const channelId = displayChannelName.split("<#")[1].split(">")[0];

      const channels = [];
      msg.guild.channels.forEach(chan => {
        channels.push(chan.id);
      });

      if (channels.indexOf(channelId) < 0) {
        msg.channel.send("Channel does not exist");
        return;
      }

      // Update channel on guild record
      const sql = `
      UPDATE settings SET channel = ?
      WHERE guild = ?
      `;

      run(sql, [channelId, msg.guild.id]);
      msg.channel.send("Updated channel to: " + displayChannelName);
    }

    if (msg.content.indexOf("set initial_role") > 0) {
      // Fetch role name from message
      const displayRoleName = msg.content.split(" ")[3];
      const roleName = displayRoleName.split("<@&")[1].split(">")[0];

      // Fetch all roles and confirm the selected role exists
      const roles = [];
      msg.guild.roles.forEach(role => {
        roles.push(role.id);
      });

      if (roles.indexOf(roleName) < 0) {
        msg.channel.send("Role does not exist");
        return;
      }

      // Update the initial_role on guild record
      const sql = `
      UPDATE settings SET initial_role = ?
      WHERE guild = ?
      `;

      run(sql, [roleName, msg.guild.id]);
      msg.channel.send("Updated initial_role to: " + displayRoleName);
    }

    if (msg.content.indexOf("set grant_role") > 0) {
      // Fetch role name from message
      const displayRoleName = msg.content.split(" ")[3];
      const roleName = displayRoleName.split("<@&")[1].split(">")[0];

      // Fetch all roles and confirm the selected role exists
      const roles = [];
      msg.guild.roles.forEach(role => {
        roles.push(role.id);
      });

      if (roles.indexOf(roleName) < 0) {
        msg.channel.send("Role does not exist");
        return;
      }

      // Update the initial_role on guild record
      const sql = `
      UPDATE settings SET grant_role = ?
      WHERE guild = ?
      `;

      run(sql, [roleName, msg.guild.id]);
      msg.channel.send("Updated grant_role to: " + displayRoleName);
    }

    if (msg.content.indexOf("set message") > 0) {
      // Fetch message from message
      const message = msg.content.split("!rules set message ")[1];

      const sql = `
      UPDATE settings SET message = ?
      WHERE guild = ?
      `;

      run(sql, [message, msg.guild.id]);

      msg.channel.send("Updated message");
    }

    if (msg.content.indexOf("check settings") > 0) {
      const sql = `
      SELECT * FROM settings WHERE guild = ?
      `;

      const settings = await dbget(sql, [msg.guild.id]);
      let message = "The following settings are set:\n";

      if (settings.channel) {
        message += `**Channel**: <#${settings.channel}>\n`;
      } else {
        message += "**channel**: MISSING\n";
      }

      if (settings.initial_role) {
        message += `**initial_role**: <@&${settings.initial_role}>\n`;
      } else {
        message += `**initial_role**: MISSING\n`;
      }

      if (settings.grant_role) {
        message += `**grant_role**: <@&${settings.grant_role}>\n`;
      } else {
        message += `**grant_role**: MISSING\n`;
      }

      if (settings.message) {
        message +=
          "**message**: has been set (potentially too long to display)";
      } else {
        message += "**message**: MISSING";
      }

      msg.channel.send(message);
    }

    if (msg.content.indexOf("post") > 0) {
      const sql = `
      SELECT * FROM settings
      WHERE guild = ?
      `;

      const settings = await dbget(sql, [msg.guild.id]);

      for (const property in settings) {
        if (!settings[property]) {
          msg.channel.send(`**Missing property**: ${property}`);
        }
      }

      const channel = msg.guild.channels.find(
        channel => channel.id === settings.channel
      );

      purge(channel);
      const posted = await channel.send(settings.message);
      posted.react("✅");

      setupAddEmojiCollector(posted);
      setupRemoveEmojiCollector(client, msg);
    }
  }
});

client.login(config.general.botToken);
console.log("Logged in");
