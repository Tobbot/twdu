// initialize and track the threat level for the game.
// this will be tracked via a flag on the game object
// we will implement a button in the base select UI to increment and decrement the threat level

export async function increaseThreatLevel(amount) {
  let threatLevel = getThreatLevel();
  if (threatLevel === undefined) {
    threatLevel = 0;
    await setThreatLevel(threatLevel);
    return;
  }

  if (threatLevel >= 6) {
    await setThreatLevel(6);
    return;
  }

  console.log("TWDU | increaseThreatLevel: ", threatLevel);
  threatLevel += amount;
  console.log("TWDU | increaseThreatLevel: ", threatLevel);
  await setThreatLevel(threatLevel);
}

export async function decreaseThreatLevel(amount) {
  let threatLevel = getThreatLevel();
  if (threatLevel === undefined) {
    threatLevel = 0;
    await setThreatLevel(threatLevel);
    return;
  }

  if (threatLevel <= 0) {
    await setThreatLevel(0);
    return;
  }

  console.log("TWDU | decreaseThreatLevel: ", threatLevel);
  threatLevel -= amount;
  console.log("TWDU | decreaseThreatLevel: ", threatLevel);
  await setThreatLevel(threatLevel);
}

export async function setThreatLevel(threatLevel) {
  await game.settings.set("twdu", "threatLevel", threatLevel);
}

export function getThreatLevel() {
  return game.settings.get("twdu", "threatLevel");
}

// display the treat level in the chat
export async function displayThreatLevel() {
  let threatLevel = getThreatLevel();

  let messageData = {
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
  };

  messageData.content = await renderTemplate(
    "systems/twdu/templates/ui/threat-level.html",
    { threatLevel: threatLevel }
  );

  await ChatMessage.create(messageData);
}

// show a UI dialog to allow the GM to set the threat level
export async function threatLevelDialog() {
    console.log("TWDU | threatLevelDialog: ", game.user.isGM);
    ThreatLevel.render(true);
}

export class ThreatLevel extends Application {
  static initialize() {
    this.threatLevel = new ThreatLevel();
  }

  static update() {
    this.threatLevel.update();
  }

  static render() {
    this.threatLevel.render(true);
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "threat-level-display",
      template: "systems/twdu/templates/ui/threat-level-display.html",
      top: 100,
      left: 100,
      height: 120,
      popOut: false,
      resizable: false,
      title: "Threat Level",
      background: "none",
    });
  }

  constructor() {
    super();
  }

  // activateListeners(html)

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".threat-level-up").click((event) => increaseThreatLevel(1));
    html.find(".threat-level-down").click((event) => decreaseThreatLevel(1));
  }

  getData() {
    return {
      threatLevel: getThreatLevel(),
      gm: game.user.isGM,
    };
  }

  update() {
    if (this.rendered) {
      this.render(true);
    }
  }
}