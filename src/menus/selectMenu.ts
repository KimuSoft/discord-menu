import { DiscordMenu } from "./menu"
import {
  ActionRowBuilder,
  AwaitMessageCollectorOptionsParams,
  CommandInteraction,
  ComponentType,
  InteractionReplyOptions,
  Message,
  MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction
} from "discord.js"
import { AfterReact } from "../types"

export class SelectMenu extends DiscordMenu {
  select = new StringSelectMenuBuilder()
  options: any = []
  filter:
    | AwaitMessageCollectorOptionsParams<ComponentType.SelectMenu>["filter"]
    | undefined

  /**
   * Sets the custom id for this select menu
   *
   * @param customId - The custom id to use for this select menu
   */
  setCustomId(customId: string) {
    this.select.setCustomId(customId)
    return this
  }
  /**
   * Sets the placeholder for this select menu
   *
   * @param placeholder - The placeholder to use for this select menu
   */
  setPlaceholder(placeholder: string) {
    this.select.setPlaceholder(placeholder)
    return this
  }
  /**
   * Sets the minimum values that must be selected in the select menu
   *
   * @param minValues - The minimum values that must be selected
   */
  setMinValues(minValues: number) {
    this.select.setMinValues(minValues)
    return this
  }
  /**
   * Sets the maximum values that must be selected in the select menu
   *
   * @param maxValues - The maximum values that must be selected
   */
  setMaxValues(maxValues: number) {
    this.select.setMaxValues(maxValues)
    return this
  }

  toJSON() {
    return this.select.toJSON()
  }

  addOptions(options: any) {
    this.options.push(...options)
    return this
  }

  async awaitFor(
    i: CommandInteraction,
    options: InteractionReplyOptions
  ): Promise<StringSelectMenuInteraction | void> {
    options.components = [
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        this.select
      ),
      ...(options.components || []),
    ]

    let message: Message
    if (this.followUp) {
      message = await i.followUp(options)
    } else if (i.replied || i.deferred) {
      await i.editReply(options)
      message = await i.fetchReply()
    } else {
      await i.reply(options)
      message = await i.fetchReply()
    }

    while (true) {
      const resI = await message
        .awaitMessageComponent({
          time: this.timeout,
          filter: this.filter,
          componentType: ComponentType.StringSelect,
        })
        .catch((e) => {
          if (e.message === "InteractionCollectorError") return
          throw e
        })

      if (!resI) return

      switch (this.afterReact) {
        case AfterReact.ResetComponents:
          await i.editReply({
            ...options,
            components: [],
          })
          return resI

        case AfterReact.DisableComponents:
          return resI

        case AfterReact.DoNotAnything:
          return resI
      }
    }
  }
}
