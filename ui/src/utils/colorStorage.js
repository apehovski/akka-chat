function generateColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}

//username - color
let colorsMap = new Map();

export function generateAllColors(messages) {
  const usernames = messages.map(msg => msg.username)
  const uniqueUsernames = [...new Set(usernames)]
  uniqueUsernames
    .forEach(nick => {
      if (!colorsMap.has(nick)) {
        colorsMap.set(nick, generateColor())
      }
    })
}

export function getColor(username) {
  if (!colorsMap.has(username)) {
    colorsMap.set(username, generateColor())
  }

  return colorsMap.get(username)
}

