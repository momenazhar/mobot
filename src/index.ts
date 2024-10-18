import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { evaluate } from "mathjs";
import { SlashCommandBuilder } from "@discordjs/builders";

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

const rest = new REST({ version: "10" }).setToken(token);

const mathCommand = new SlashCommandBuilder()
    .setName("math")
    .setDescription("Evaluate a math expression")
    .addStringOption((builder) =>
        builder.setName("expression").setDescription("The expression that needs to be evaluated")
    )
    .toJSON();

client.once("ready", async () => {
    console.log(`Logged in as ${client.user?.tag}!`);

    try {
        await rest.put(Routes.applicationCommands(clientId), { body: [mathCommand] });
        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    const expression = interaction.options.get("expression")?.value as string;
    let result;
    try {
        result = evaluate(expression);
    } catch (e) {
        interaction.reply(e + "").catch(() => undefined);
    }
    interaction.reply(`\`\`\`${result}\`\`\``).catch(() => undefined);
});

client.login(token);
