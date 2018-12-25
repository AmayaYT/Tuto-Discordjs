const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client({disableEveryone: true});
client.commands = new Discord.Collection();
const botconfig = require("./botconfig.json")

  // let prefix = "%";

fs.readdir("./cmd/", (err, files) => {

  if(err) console.log(err);
  var jsfile = files.filter(f => f.split('.').pop() === 'js');
  if(jsfile.length <= 0){ return console.log("Il n'y a aucune commande.")}
    else { console.log(jsfile.length + 'commandes trouvées') }

  console.log("Commandes ==========")

  jsfile.forEach((f, i) =>{
    let props = require(`./cmd/${f}`);
    console.log(`${f} chargé !`);
    client.commands.set(props.help.name, props);
  });
});

client.on("ready", async () => {

  console.log(`====================\n\nConnection ========== \nConnecté en tant que ${client.user.username} !\n=====================`)
  client.user.setActivity(`odilon.tk ||Default prefix => %`)   
});

client.on("message", async msg => {

  let prefixes = JSON.parse(fs.readFileSync('./prefixes.json', "utf8"))
  if(!prefixes[msg.guild.id]){
    prefixes[msg.guild.id] = {
      prefixes: botconfig.prefix
    }
  }

  let prefix = prefixes[msg.guild.id].prefixes

  let msgArray = msg.content.split(" ");
  let cmd = msgArray[0];
  let args = msgArray.slice(1);
  let cont = msg.content.slice(prefix.length).split(" ");

  if(!msg.content.startsWith(prefix)) return;


  let commandfile = client.commands.get(cont[0]);
  if(commandfile) commandfile.run(client,msg,args);

});

client.login("TON TOKEN ICI");
