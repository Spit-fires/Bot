'use strict';

module.exports = {
    channels: require("./data/channels"),
    colors: require("./data/colors"),
    config: require("./data/config"),
    emojis: require("./data/emojis"),
    ingredients: require("./data/ingredients"),
    level: require("./data/level"),
    menu: require('./data/menu'),
    questions: require("./data/questions"),
    roles: require("./data/roles"),
    rules: require("./data/rules"),
    webhooks: require("./data/webhooks"),
    PPClient: require("./classes/PPClient"),
    addRole: require("./functions/addRole"),
    capitalize: require("./functions/capitalize"),
    checkNoiceBoard: require("./functions/checkNoiceBoard"),
    createEmbed: require("./functions/createEmbed"),
    editEmbed: require("./functions/editEmbed"),
    getGuild: require("./functions/getGuild"),
    getUser: require("./functions/getUser"),
    hasRole: require("./functions/hasRole"),
    inBotGuild: require("./functions/inBotGuild"),
    isImage: require("./functions/isImage"),
    isVip: require("./functions/isVip"),
    removeRole: require("./functions/removeRole"),
    request: require("./functions/request"),
    sendEmbed: require("./functions/sendEmbed"),
    sendGuildLog: require("./functions/sendGuildLog"),
    setCooldown: require("./functions/setCooldown"),
    timestampToDate: require('./functions/timestampToDate'),
    updateGuildAmount: require("./functions/updateGuildAmount"),
    updateMemberSize: require("./functions/updateMemberSize"),
    wait: require("./functions/wait"),
    makeRankImg: require("./functions/canvas/makeRankImage"),
    clear: require("./functions/console/clear"),
    count: require("./functions/console/count"),
    error: require("./functions/console/error"),
    fatal: require("./functions/console/fatal"),
    info: require("./functions/console/info"),
    log: require("./functions/console/log"),
    notice: require("./functions/console/notice"),
    resetCount: require("./functions/console/resetCount"),
    sendServerLog: require("./functions/console/sendServerLog"),
    success: require("./functions/console/success"),
    warn: require("./functions/console/warn")
}