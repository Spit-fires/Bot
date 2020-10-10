const{createEmbed, sendEmbed}=require("../functions");
const{blue,red}=require('../colors.json');

module.exports={
    name:"toggle",
    description:"toggle a setting on or off",
    args:true,
    minArgs:1,
    maxArgs:1,
    usage:"<toggle>",
    cooldown:0,
    userType:"staff",
    neededPerms:[],
    pponly:true,
    removeExp:false,
    execute(message,args,client){
        let embedMsg=createEmbed(red,`**${this.name}**`,null,null,`Toggle ${args[0]} does not exist`);
        const toggles=[];
        for(let toggle in client.toggles){
            toggles.push(toggle);
        }
        if(!toggles.includes(args[0])){
            return sendEmbed(embedMsg,message);
        }
        client.toggles[args[0]]!=client.toggles[args[0]];
        embedMsg.setColor(blue).setDescription(`Toggle ${args[0]} is now set to ${client.toggles[args[0]]}`);
        sendEmbed(embedMsg,message);
    }
}