const fetch = require('node-fetch');

const Discord = require('discord.js');
const client = new Discord.Client();

var steamapikey = 'FCE8F95BBCC226119E2DE30D9A6EFB36'
var channelid = '770280302622015567'
var bottoken = 'TOKEN'
var logo = 'https://media.discordapp.net/attachments/795349438851842051/796455672413290557/logo.png?width=467&height=467'
var whitelistroleid = '402481652015824920'

var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "extendedmode"
});

client.on("ready", () => {
	client.user.setStatus("online");
	con.connect(function(err) {
		if (err) throw err;
	});
	console.log(`Hazır.`);
})

// https://stackoverflow.com/questions/12532871/how-to-convert-a-very-large-hex-number-to-decimal-in-javascript
function h2d(s) {

    function add(x, y) {
        var c = 0, r = [];
        var x = x.split('').map(Number);
        var y = y.split('').map(Number);
        while(x.length || y.length) {
            var s = (x.pop() || 0) + (y.pop() || 0) + c;
            r.unshift(s < 10 ? s : s - 10); 
            c = s < 10 ? 0 : 1;
        }
        if(c) r.unshift(c);
        return r.join('');
    }

    var dec = '0';
    s.split('').forEach(function(chr) {
        var n = parseInt(chr, 16);
        for(var t = 8; t; t >>= 1) {
            dec = add(dec, dec);
            if(n & t) dec = add(dec, '1');
        }
    });
    return dec;
}

// https://stackoverflow.com/a/6078873
function timeConverter(UNIX_timestamp){
	var a = new Date(UNIX_timestamp * 1000);
	var months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min ;
	return time;
}

client.on('guildMemberRemove', member => {
	let user = member.user
	var sql1 = "DELETE FROM dcwl WHERE dcid = ?"
	var sql2 = "SELECT * FROM dcwl WHERE dcid = '"+ user.id +"'"
	con.query(sql2,[user.id], async function (err2, result2) {
		if (err2) throw err2;
		if (result2[0] != null) {
			var hex = result2[0].hex
			const textjson = await fetch('https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key='+ steamapikey +'&steamids='+ h2d((hex.slice(6)).toLowerCase())).then(response => response.json()); 
			const textjson2 = await fetch('http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key='+ steamapikey +'&steamids='+ h2d((hex.slice(6)).toLowerCase())).then(response => response.json());

			const embed = new Discord.RichEmbed()
			embed.setColor(15866651)
			embed.setAuthor('Orient Whitelist', logo, 'https://lastroleplay.com')
			embed.setThumbnail(textjson.response.players[0].avatarmedium)
			embed.setDescription('Sunucudan ayrıldı!')
			embed.addField('Steam İsmi:', textjson.response.players[0].personaname)
			embed.addField('Steam Bağlantısı:', textjson.response.players[0].profileurl)
			if (textjson.response.players[0].communityvisibilitystate == 1 || textjson.response.players[0].communityvisibilitystate == 2) {
				embed.addField('Profil Gizliliği:', 'Gizli')
			} else {
				if (textjson.response.players[0].communityvisibilitystate == 3) {
					embed.addField('Profil Gizliliği:', 'Herkese Açık')
				}
			}
			if (textjson.response.players[0].realname) {
				embed.addField('Steamdeki Kayıtlı İsim:', textjson.response.players[0].realname)
			}
			if (textjson.response.players[0].timecreated) {
				embed.addField('Hesap Oluşturma Tarihi:', timeConverter(textjson.response.players[0].timecreated))
			}
			embed.addField('Discord:', '<@'+ user.id +'>')
			embed.addField('Steam Hex:', hex)
			embed.setFooter('dev. by Orient')
			embed.setTimestamp()

			client.channels.get(channelid).send(embed)
			con.query(sql1,[user.id], function (err1, result1) {
				if (err1) throw err1;
			});
		}
	})
});

client.on('message', async message => {
	var command = message.content.split(' ')
	let user = message.mentions.members.first();
	if(message.author.bot) return; 
	if (message.channel.id === channelid) {
		if (message.content.startsWith("!ekle")) {
			var hex = command[1]
			if (hex.length == 21) {
				var sql1 = "SELECT * FROM dcwl WHERE hex = '"+ hex.toLowerCase() +"'"
				var sql2 = "SELECT * FROM dcwl WHERE dcid = '"+ user.id +"'"
				var sql3 = "INSERT INTO dcwl (hex, dcid) VALUES (?, ?)";
				con.query(sql1,[], async function (err, result) {
					if (err) throw err;
					if (result[0] == null) {
						con.query(sql2,[], async function (err2, result2) {
							if (err2) throw err2;
							if (result2[0] == null) {
								con.query(sql3,[hex.toLowerCase(), user.id], function (err3, result3) {
									if (err3) throw err3;
								});
								const textjson = await fetch('https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key='+ steamapikey +'&steamids='+ h2d((hex.slice(6)).toLowerCase())).then(response => response.json()); 
								const textjson2 = await fetch('http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key='+ steamapikey +'&steamids='+ h2d((hex.slice(6)).toLowerCase())).then(response => response.json());
					
								const embed = new Discord.RichEmbed()
								embed.setColor(1942002)
								embed.setAuthor('Orient Whitelist', logo, 'https://lastroleplay.com')
								embed.setThumbnail(textjson.response.players[0].avatarmedium)
								embed.setDescription('Whitelist eklendi!')
								embed.addField('Steam İsmi:', textjson.response.players[0].personaname)
								embed.addField('Steam Bağlantısı:', textjson.response.players[0].profileurl)
								if (textjson.response.players[0].communityvisibilitystate == 1 || textjson.response.players[0].communityvisibilitystate == 2) {
									embed.addField('Profil Gizliliği:', 'Gizli')
								} else {
									if (textjson.response.players[0].communityvisibilitystate == 3) {
										embed.addField('Profil Gizliliği:', 'Herkese Açık')
									}
								}
								if (textjson.response.players[0].realname) {
									embed.addField('Steamdeki Kayıtlı İsim:', textjson.response.players[0].realname)
								}
								if (textjson.response.players[0].timecreated) {
									embed.addField('Hesap Oluşturma Tarihi:', timeConverter(textjson.response.players[0].timecreated))
								}
								if (textjson2.players[0].CommunityBanned) {
									embed.addField('Topluluk Banı:', 'Var')
								}
								if (textjson2.players[0].VACBanned) {
									embed.addField('VAC Banı:', 'Var')
								}
								if (textjson2.players[0].NumberOfVACBans > 0) {
									embed.addField('VAC Ban Sayısı:', textjson2.players[0].NumberOfVACBans)
								}
								if (textjson2.players[0].NumberOfGameBans > 0) {
									embed.addField('Kaç Oyunda Banı Var?', textjson2.players[0].NumberOfGameBans)
								}
								if (textjson2.players[0].EconomyBan != 'none') {
									embed.addField('EconomyBan:', textjson2.players[0].EconomyBan)
								}
								embed.addField('Discord:', '<@'+ user.id +'>')
								embed.addField('Steam Hex:', hex.toLowerCase())
								embed.addField('Whitelist Kaydını Yapan:', message.author)
								embed.setFooter('dev. by Orient')
								embed.setTimestamp()
					
								message.channel.send(embed)
								user.addRole(whitelistroleid)
							} else {
								const embed = new Discord.RichEmbed()
								embed.setColor(1634883)
								embed.setAuthor('Orient Whitelist', logo, 'https://lastroleplay.com')
								embed.setDescription('<@'+ user.id +'> zaten whiteliste sahip!')
								embed.addField('Kayıtlı Steam Hex:', result2[0].hex)
								embed.setFooter('dev. by Orient')
								embed.setTimestamp()

								message.channel.send(embed)
							}
						});
					} else {
						const embed = new Discord.RichEmbed()
						embed.setColor(1634883)
						embed.setAuthor('Orient Whitelist', logo, 'https://lastroleplay.com')
						embed.setDescription(hex.toLowerCase() +' zaten whiteliste sahip!')
						embed.addField('Kayıtlı Discord:', '<@'+ result[0].dcid +'>')
						embed.setFooter('dev. by Orient')
						embed.setTimestamp()

						message.channel.send(embed)
					}
				});
			} else {
				const embed = new Discord.RichEmbed()
				embed.setColor(1634883)
				embed.setAuthor('Orient Whitelist', logo, 'https://lastroleplay.com')
				embed.setDescription('Steam hexi hatalı yazdınız!')
				embed.setFooter('dev. by Orient')
				embed.setTimestamp()

				message.channel.send(embed)
			}
		} else if (message.content.startsWith("!kaldırdc")) {
			var sql1 = "DELETE FROM dcwl WHERE dcid = ?"
			var sql2 = "SELECT * FROM dcwl WHERE dcid = '"+ user.id +"'"
			con.query(sql2,[user.id], async function (err2, result2) {
				if (err2) throw err2;
				if (result2[0] != null) {
					var hex = result2[0].hex
					const textjson = await fetch('https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key='+ steamapikey +'&steamids='+ h2d((hex.slice(6)).toLowerCase())).then(response => response.json()); 
					const textjson2 = await fetch('http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key='+ steamapikey +'&steamids='+ h2d((hex.slice(6)).toLowerCase())).then(response => response.json());
		
					const embed = new Discord.RichEmbed()
					embed.setColor(15866651)
					embed.setAuthor('Orient Whitelist', logo, 'https://lastroleplay.com')
					embed.setThumbnail(textjson.response.players[0].avatarmedium)
					embed.setDescription('Whitelist kaldırıldı!')
					embed.addField('Steam İsmi:', textjson.response.players[0].personaname)
					embed.addField('Steam Bağlantısı:', textjson.response.players[0].profileurl)
					if (textjson.response.players[0].communityvisibilitystate == 1 || textjson.response.players[0].communityvisibilitystate == 2) {
						embed.addField('Profil Gizliliği:', 'Gizli')
					} else {
						if (textjson.response.players[0].communityvisibilitystate == 3) {
							embed.addField('Profil Gizliliği:', 'Herkese Açık')
						}
					}
					if (textjson.response.players[0].realname) {
						embed.addField('Steamdeki Kayıtlı İsim:', textjson.response.players[0].realname)
					}
					if (textjson.response.players[0].timecreated) {
						embed.addField('Hesap Oluşturma Tarihi:', timeConverter(textjson.response.players[0].timecreated))
					}
					embed.addField('Discord:', '<@'+ user.id +'>')
					embed.addField('Steam Hex:', hex)
					embed.addField('Whitelist Kaydını Silen:', message.author)
					embed.setFooter('dev. by Orient')
					embed.setTimestamp()
		
					message.channel.send(embed)
					user.removeRole(whitelistroleid)

					con.query(sql1,[user.id], function (err1, result1) {
						if (err1) throw err1;
					});
				} else {
					const embed = new Discord.RichEmbed()
					embed.setColor(1634883)
					embed.setAuthor('Orient Whitelist', logo, 'https://lastroleplay.com')
					embed.setDescription('<@'+ user.id +'> - Böyle bir whitelist bulunamadı!')
					embed.setFooter('dev. by Orient')
					embed.setTimestamp()

					message.channel.send(embed)
				}
			});
		} else if (message.content.startsWith("!kaldırhex")) {
			var hex = command[1]
			var sql1 = "DELETE FROM dcwl WHERE hex = ?"
			var sql2 = "SELECT * FROM dcwl WHERE hex = '"+ hex.toLowerCase() +"'"
			con.query(sql2,[hex.toLowerCase()], async function (err2, result2) {
				if (err2) throw err2;
				if (result2[0] != null) {
					var dcid = result2[0].dcid
					const textjson = await fetch('https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key='+ steamapikey +'&steamids='+ h2d((hex.slice(6)).toLowerCase())).then(response => response.json()); 
					const textjson2 = await fetch('http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key='+ steamapikey +'&steamids='+ h2d((hex.slice(6)).toLowerCase())).then(response => response.json());
		
					const embed = new Discord.RichEmbed()
					embed.setColor(15866651)
					embed.setAuthor('Orient Whitelist', logo, 'https://lastroleplay.com')
					embed.setThumbnail(textjson.response.players[0].avatarmedium)
					embed.setDescription('Whitelist kaldırıldı!')
					embed.addField('Steam İsmi:', textjson.response.players[0].personaname)
					embed.addField('Steam Bağlantısı:', textjson.response.players[0].profileurl)
					if (textjson.response.players[0].communityvisibilitystate == 1 || textjson.response.players[0].communityvisibilitystate == 2) {
						embed.addField('Profil Gizliliği:', 'Gizli')
					} else {
						if (textjson.response.players[0].communityvisibilitystate == 3) {
							embed.addField('Profil Gizliliği:', 'Herkese Açık')
						}
					}
					if (textjson.response.players[0].realname) {
						embed.addField('Steamdeki Kayıtlı İsim:', textjson.response.players[0].realname)
					}
					if (textjson.response.players[0].timecreated) {
						embed.addField('Hesap Oluşturma Tarihi:', timeConverter(textjson.response.players[0].timecreated))
					}
					embed.addField('Discord:', '<@'+ dcid +'>')
					embed.addField('Steam Hex:', hex.toLowerCase())
					embed.addField('Whitelist Kaydını Silen:', message.author)
					embed.addField('-', 'Steamhex ile kaldırdığınız için whitelist rolünü manuel almanız gerekiyor!')
					embed.setFooter('dev. by Orient')
					embed.setTimestamp()
		
					message.channel.send(embed)

					con.query(sql1,[hex.toLowerCase()], function (err1, result1) {
						if (err1) throw err1;
					});
				} else {
					const embed = new Discord.RichEmbed()
					embed.setColor(1634883)
					embed.setAuthor('Orient Whitelist', logo, 'https://lastroleplay.com')
					embed.setDescription(hex.toLowerCase() +' - Böyle bir whitelist bulunamadı!')
					embed.setFooter('dev. by Orient')
					embed.setTimestamp()

					message.channel.send(embed)
				}
			});
		} else if (message.content.startsWith("!restart")) {
			const embed = new Discord.RichEmbed()
			embed.setColor(1942002)
			embed.setAuthor('Bota Restart Atılıyor!', logo, 'https://lastroleplay.com')
			embed.setFooter('dev. by Orient')
			embed.setTimestamp()
			message.channel.send(embed).then(msg => {
				console.log(`Reboot!`);
				process.exit(0);
			})
		} else if (message.content.startsWith("!yardım")) {
			const embed = new Discord.RichEmbed()
			embed.setColor(1942002)
			embed.setAuthor('Orient Whitelist Komut Rehberi!', logo, 'https://lastroleplay.com')
			embed.addField('!ekle [steamhex] [@kullanıcı etiket]', 'Kullanıcıya databasede whitelist verir, etiketlenen kişiye tanımlı whitelist rolünü verir.')
			embed.addField('!kaldırdc [@kullanıcı etiket]', 'Kullanıcının kayıtlı discordu üzerinden databaseden whitelistini siler, etiketlenen kişiden tanımlı whitelist rolünü siler.')
			embed.addField('!kaldırhex [steamhex]', 'Kullanıcının kayıtlı hexi üzerinden databaseden whitelistini siler, etiketlenen kişiden tanımlı whitelist rolünü SİLMEZ!')
			embed.addField('!blacklistekle [steamhex] [sebep]', 'Kullanıcının kayıtlı hexi üzerinden databaseden whitelistini siler, botun blacklist databesesine kişinin hexini kaydeder, etiketlenen kişiden tanımlı whitelist rolünü SİLMEZ!')
			embed.addField('!blacklistler', 'Botun blacklist databasesindeki kişileri sıralar.')
			embed.addField('!whitelistler', 'Sunucunun databasesindeki kayıtlı whitelistleri sıralar.')
			embed.addField('!restart', 'Bota restart atar.')
			embed.addField('!yardım', 'Bot komut rehberini açar.')
			embed.setFooter('dev. by Orient')
			message.channel.send(embed)
		} else if (message.content.startsWith("!whitelistler")) {
			var sql = "SELECT * FROM dcwl"
			con.query(sql,[], async function (err, result) {
				if (err) throw err;
				if (result[0] != null) {
					for (var i = 0; i < result.length; i++) {
						const embed = new Discord.RichEmbed()
						embed.setColor(1942002)
						embed.setDescription('<@'+ result[i].dcid +'> - '+ result[i].hex)
						embed.setFooter('dev. by Orient')
						embed.setTimestamp()
						message.channel.send(embed)
					}
				}
			});
		}
	}
});

client.login(bottoken);