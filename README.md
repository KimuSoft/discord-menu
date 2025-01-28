## Discord Menu Library
> Use Discord components without unnecessarily long codes.
* Typescript
* discord.js v14.17.3

## Features
* Sample discord button component menus
* Simple discord select menu component menus
* Simple pagination component

## Examples
### Yes or No Button
```typescript
async function yesNoTest(i: ChatInputCommandInteraction) {
  // Send a message with buttons with Yes and No.
  const resI = await i.sendMenu({
    content: "Do you know Gangnam Style?",
    menu: new YesNoMenu(),
  })

  // Returns void if the response time limit has been exceeded.
  if (!resI) return i.editReply({ content: "Timeout!" })

  // You can check which button the user pressed through 'resI.customId'
  switch (resI.customId) {
    case CustomId.YesButton:
      return i.editReply({ content: "You choose Yes!" })
    case CustomId.NoButton:
      return i.editReply({ content: "You choose No!" })
  }
}
```
