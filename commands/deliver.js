const{createEmbed,hasRole,sendEmbed}=require("../functions");
const{blue,red}=require('../colors.json');
const{deliverer}=require('../roles.json');
const{query}=require("../dbfunctions");

module.exports={
    name:"deliver",
    description:"deliver an order",
    aliases:["del"],
    args:true,
    minArgs:1,
    maxArgs:1,
    usage:"<order id>",
    cooldown:0,
    userType:"worker",
    neededPerms:[],
    pponly:false,
    async execute(message,args,client){
        let embedMsg=createEmbed(blue,"Deliver");
        const deliverRole=client.guild.roles.cache.get(deliverer);
        if(!hasRole(client.member,deliverer)){
            embedMsg.setColor(red).setDescription(`You need to have the ${deliverRole.name} role to be able to deliver`);
            return sendEmbed(embedMsg,message);
        }
        let results=await query("SELECT deliveryMessage FROM worker WHERE workerId = ?",[message.author.id]);
        if(!results.length){
            embedMsg.setColor(red).setDescription(`You have not set a delivery message yet. please set one with ppdelset`);
            return sendEmbed(embedMsg,message);
        }
        let result=results[0];
        let deliveryMessage=result.deliveryMessage;
        results=await query("SELECT * FROM `order` WHERE orderId = ? AND status = 'cooked'",[args[0]]);
        if(!results.length){
            embedMsg.setColor(red).setDescription(`Order ${args[0]} has not been found with the cooked status`);
            return sendEmbed(embedMsg,message);
        }
        const orderer=client.users.cache.get(result.userId);
        if(orderer.id===message.author.id){
            embedMsg.setColor(red).setDescription(`You can't deliver your own order`);
            return sendEmbed(embedMsg,message);
        }
        let cook="none";
        if(result.cookId)cook=client.guild.members.cache.get(result.cookId)?client.users.cache.get(result.cookId).username:"Deleted Cook";
        let image=result.imageUrl;
        let invite="AW7z9qu";
        let guild=client.guilds.cache.get(result.guildId);
        let channel=client.channels.cache.get(result.channelId)?client.channels.cache.get(result.channelId):guild.systemChannel;
        channel.createInvite({maxAge:0,reason:"Delivering an order"}).then(guildInvite=>{
            deliveryMessage = deliveryMessage.replace("{chef}",cook).replace("{customer}",orderer).replace("{image}",image).replace("{invite}",invite);
            message.author.send(deliveryMessage).then(()=>{
                message.author.send(`Don't send this link to the orderer!\n${guildInvite.url}`).then(()=>{
                    query("UPDATE `order` SET status = 'delivered' WHERE orderId = ?",[args[0]]);
                    query("UPDATE worker SET deliveries = deliveries + 1 WHERE workerId = ?",[message.author.id]);
                    embedMsg.setTitle(`Confirmation`).setDescription(`Your order is now being delivered by ${message.author}`);
                    orderer.send(embedMsg);
                });
            });
        });
    }
}