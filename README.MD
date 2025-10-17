Discord üzerinden ESX altyapılı fivem sunucunuz için SQL yönetimini sağlayan, whitelist tablolarına ekleme silme yapan, whitelist yönetim botu.



ESX Altyapısına göre 2019 yılında yapılmış bir bottur. Node.js ile yazılıp js ve sql kullanılmıştır.
SQL komutlarını çalıştırmaya yarayan bu proje ile offline olarak oyuna girmeden game staff ihtiyacı olmadan whitelist ekleyip çıkarmayı discord komutları ile yapabilirsiniz.
Detaylı bir komut sistemi vardır.


NOT: Bu projeyi Open-Source olarak, 18.10.2025 yılında PUBLIC olarak TheOrient github hesabımda yayınlıyorum. Bot esx-disc envantere göre 2019-2020 yılları arasında yapılmıştır. Dolayısı ile günümüzde kullanılan QBase QB altyapıya göre uyarlayabilirsiniz. Tek yapmanız gereken SQL komutlarını değiştirmek ve tabloları column satırları vs. güncellemek. 


KURULUM 

node.js indirin ve kurun.

cmd yi açıp botun olduğu dizine cd komutu ile girin Örn: cd C:\bot

cmd ye npm install yazın

cmd yi kapatın

start.bat başlatın


AYARLAMALAR-CONFIG

run.js açıp bunları düzenleyin:


steamapikey = steam api değiştirin
channelid = discorddaki kanal id değiştirin
bottoken = Bot Tokeni değiştirin
ogo = logo için image linki
whitelistroleid = whitelist rol idsi değiştirin 

Hemen altındaki database bilgilerini değiştirin.

embed.setAuthor('Orient Whitelist', logo, 'https://lastroleplay.com bulunan satırlarda linki değiştirin.




KOMUTLAR

HEX ve DC ile Whitelist ekleme komutu
!ekle steamhex @discordtag
Örn. !ekle steam:11000013ee349d4 @𝐫 𝐞 𝐕 𝐀 𝐋 𝐈

Discord Whitelist kaldırma komutu
!kaldırdc discordid 
Örn. !kaldırdc 800798775446470716

HEX SİLME HEX Whitelist kaldırma komutu
!kaldırhex hexid discordtag
Örn. !kaldırhex steam:110000100000638 @quixerr

YENİDEN BAŞLATMA
!restart

YARDIM - KOMUTLAR VE KULLANMA REHBERİ
!yardım

 Orient Whitelist Komut Rehberi
!ekle [steamhex] [@kullanıcı etiket]', 'Kullanıcıya databasede whitelist verir, etiketlenen kişiye tanımlı whitelist rolünü verir.
!kaldırdc [@kullanıcı etiket]', 'Kullanıcının kayıtlı discordu üzerinden databaseden whitelistini siler, etiketlenen kişiden tanımlı whitelist rolünü siler.
!kaldırhex [steamhex]', 'Kullanıcının kayıtlı hexi üzerinden databaseden whitelistini siler, etiketlenen kişiden tanımlı whitelist rolünü SİLMEZ!
!blacklistekle [steamhex] [sebep]', 'Kullanıcının kayıtlı hexi üzerinden databaseden whitelistini siler, botun blacklist databesesine kişinin hexini kaydeder, etiketlenen kişiden tanımlı whitelist rolünü SİLMEZ!
!blacklistler', 'Botun blacklist databasesindeki kişileri sıralar.
!whitelistler', 'Sunucunun databasesindeki kayıtlı whitelistleri sıralar.
!restart', 'Bota restart atar.
!yardım', 'Bot komut rehberini açar.



Beni takip etmeyi ve starlamayı unutmayın. Kullanımı ücretsizdir ancak pazarlanması yasaktır.

DC: byorient