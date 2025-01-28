import "dotenv/config"
import { DiscordMenu } from "../src"
import { Client } from "discord.js"
import { CommandClient } from "@pikokr/command.ts"
import * as path from "path"

const client = new Client({ intents: ["Guilds", "DirectMessages"] })

const cts = new CommandClient(client)

console.log(DiscordMenu)

const run = async () => {
  await cts.enableApplicationCommandsExtension({
    guilds: ["617210258493800468"],
  })
  await cts.registry.loadAllModulesInDirectory(path.join(__dirname, "modules"))
  await client.login(process.env.BOT_TOKEN)
  await cts.fetchOwners()
  await cts.getApplicationCommandsExtension()!.sync()
}

run().then()
