module.exports.config = {
        name: "language",
        version: "1.0.0",
        permission: 2,
        prefix: true,
        credits: "ryuko",
        description: "Changer la langue du bot",
        premium: false,
        category: "admin",
        usages: "[français] [english]",
        cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    let operator = global.config.operators;
    if (!operator.includes(event.senderID)) return api.sendMessage(`Seuls les administrateurs peuvent utiliser cette commande.`, event.threadID, event.messageID);
    const { threadID, messageID } = event;

    switch (args[0]) {
        case "français":
        case "francais":
        case "fr":
            {
                return api.sendMessage(`Le bot est déjà configuré en français !`, threadID, () => global.config.language = "fr"); 
            }
            break;

        case "english":
        case "en":
            {
                return api.sendMessage(`Language has been converted to english`, threadID, () => global.config.language = "english"); 
            }
            break;

        default:
            {
                return api.sendMessage("Erreur de syntaxe. Utilisez : language fr ou language english", threadID, messageID);
            }   
            break; 
    }        
}
