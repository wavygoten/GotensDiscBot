const Discord = require("discord.js");
const tokens = [
  {BOT-TOKEN},
  {BOT-TOKEN},
];
const prefix = "-";
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const zipcodes = require("zipcodes");

for (const token of tokens) {
  const client = new Discord.Client();

  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on("message", async (message) => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (command == "variants") {
      const url = args[0];
      let lsize = "";
      let lvar = "";
      let data = [];
      try {
        axios({
          method: "get",
          url: url,
        })
          .then(function (response) {
            document = response.data;
            const $ = cheerio.load(document);
            var title = $('meta[property="og:title"]').attr("content");
            var img = $('meta[property="og:image"]').attr("content");
            var titletext = $("title").text();
            var price;

            if (img == undefined) {
              img = "";
            } else if (!img.match(/^[a-zA-Z]+:\/\//)) {
              img = "https:" + img;
            } else {
              img = img;
            }
            if (title === undefined) title = titletext;

            const getAfterText = (allText, keyword) => {
              return allText.slice(allText.indexOf(keyword));
            };
            parsedData = JSON.parse(
              getAfterText(document, "var meta = ")
                .split(";", 1)[0]
                .substring(11)
            );
            for (size in parsedData.product.variants) {
              lsize += "\n" + parsedData.product.variants[size].public_title;
            }
            for (variant in parsedData.product.variants) {
              lvar += "\n" + parsedData.product.variants[variant].id;
            }

            price = (parsedData.product.variants[0].price / 100).toFixed(2);
            // console.log(document.getElementsByTagName("*"));

            const embed = new Discord.MessageEmbed()
              .setColor("#f09719")
              .setTitle(title)
              .setURL(url)
              .addFields(
                {
                  name: "Sizes",
                  value: "```" + lsize + "```",
                  inline: true,
                },
                {
                  name: "Variants",
                  value: "```" + lvar + "```",
                  inline: true,
                },
                {
                  name: "Price",
                  value: "$" + price,
                  inline: false,
                }
              )
              .setThumbnail(img)
              .setFooter(
                message.guild.name + " - " + message.author.username,
                message.guild.iconURL()
              );
            message.channel.send(embed);
          })
          .catch(() => (error) => {
            const embederror = new Discord.MessageEmbed()
              .setColor("#f09719")
              .setDescription("Error Retrieving Variants");
            message.send.channel(embederror);
            console.log(error);
          });
      } catch (error) {
        const embederror = new Discord.MessageEmbed()
          .setColor("#f09719")
          .setDescription("Error Retrieving Variants");
        message.send.channel(embederror);
        console.log(error);
      }
    }
    if (command == "stockx") {
      const query = args;
      try {
        axios({
          method: "get",
          url: `https://stockx.com/api/browse?&_search=${query}`,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            Connection: "keep-alive",
          },
        })
          .then(function (response) {
            let document = response.data;
            let firstItem = document.Products[0];

            let img = firstItem.media.thumbUrl;
            let title = firstItem.title;
            let styleId = firstItem.styleId;
            let releaseDate = firstItem.releaseDate;
            let url = `https://stockx.com/${firstItem.urlKey}`;
            let highestBid = firstItem.market.highestBid;
            let highestBidSize = firstItem.market.highestBidSize;
            let lowestAsk = firstItem.market.lowestAsk;
            let lowestAskSize = firstItem.market.lowestAskSize;
            let retailPrice = firstItem.retailPrice;
            const embed = new Discord.MessageEmbed()
              .setColor("#f09719")
              .setTitle(title)
              .setURL(url)
              .setThumbnail(img)
              .addFields(
                {
                  name: "SKU/ID",
                  value: styleId,
                  inline: true,
                },
                {
                  name: "Release Date",
                  value: releaseDate,
                  inline: true,
                },
                {
                  name: "Retail Price",
                  value: `$${retailPrice}`,
                  inline: true,
                },
                { name: "\u200B", value: "\u200B" },

                {
                  name: "Highest Bid",
                  value: `$${highestBid}`,
                  inline: true,
                },
                {
                  name: "Highest Bid Size",
                  value: `${highestBidSize}`,
                  inline: true,
                },
                { name: "\u200B", value: "\u200B" },
                {
                  name: "Lowest Ask",
                  value: `$${lowestAsk}`,
                  inline: true,
                },
                {
                  name: "Lowest Ask Size",
                  value: `${lowestAskSize}`,
                  inline: true,
                }
              )
              .setFooter(
                message.guild.name + " - " + message.author.username,
                message.guild.iconURL()
              );
            message.channel.send(embed);
          })
          .catch(() => (error) => {
            const embederror = new Discord.MessageEmbed()
              .setColor("#f09719")
              .setDescription("No product found, try another search.");
            message.send.channel(embederror);
            console.log(error);
          });
      } catch (error) {
        const embederror = new Discord.MessageEmbed()
          .setColor("#f09719")
          .setDescription("No product found, try another search.");
        message.send.channel(embederror);
        console.log(error);
      }
    }
    if (command == "walmart") {
      const uri = args[0];
      try {
        axios({
          method: "get",
          url: `${uri}`,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            Connection: "keep-alive",
          },
        })
          .then(function (response) {
            // fs.writeFile("text.html", document, (err) => {
            //   // In case of a error throw err.
            //   if (err) throw err;
            // });
            let document = response.data;

            const $ = cheerio.load(document);
            let offerID = $('script[id="item"]')[0].children[0].data;
            let parsedData = JSON.parse(offerID);
            let offerId = parsedData.item.product.buyBox.products[0].offerId;
            let title = parsedData.item.product.buyBox.products[0].productName;
            let price =
              parsedData.item.product.buyBox.products[0].priceMap.price;
            let img = parsedData.item.product.buyBox.products[0].images[0].url;

            const embed = new Discord.MessageEmbed()
              .setColor("#f09719")
              .setTitle(title)
              .setURL(uri)
              .addFields(
                {
                  name: "ID SKU",
                  value: "```" + offerId + "```",
                  inline: true,
                },
                {
                  name: "Price",
                  value: "$" + price,
                  inline: false,
                }
              )
              .setThumbnail(img)
              .setFooter(
                message.guild.name + " - " + message.author.username,
                message.guild.iconURL()
              );
            message.channel.send(embed);
          })
          .catch(() => (error) => {
            const embederror = new Discord.MessageEmbed()
              .setColor("#f09719")
              .setDescription("No product found, try another search.");
            message.send.channel(embederror);
            console.log(error);
          });
      } catch (error) {
        const embederror = new Discord.MessageEmbed()
          .setColor("#f09719")
          .setDescription("No product found, try another search.");
        message.send.channel(embederror);
        console.log(error);
      }
    }
    if (command == "lv") {
      try {
        const zip = args[0];
        let lname = [];
        let laddy = [];
        let lphone = [];
        var latitude = zipcodes.lookup(zip).latitude.toFixed(2);
        var longitude = zipcodes.lookup(zip).longitude.toFixed(2);
        var vaccineEndpoint = `https://api.us.castlighthealth.com/vaccine-finder/v1/provider-locations/search?medicationGuids=779bfe52-0dd8-4023-a183-457eb100fccc,a84fb9ed-deb4-461c-b785-e17c782ef88b,784db609-dc1f-45a5-bad6-8db02e79d44f&lat=${latitude}&long=${longitude}&radius=50`;
        await axios
          .get(vaccineEndpoint)
          .then((res) => {
            const document = res.data;
            const providers = document.providers;
            for (provider in providers) {
              if (providers[provider].in_stock) {
                lname.push(providers[provider].name);
                laddy.push(providers[provider].address1);
                lphone.push(providers[provider].phone);
              }
            }
            const name = lname.slice(0, 20).join("\n");
            const addy = laddy.slice(0, 20).join("\n");
            const phone = lphone.slice(0, 20).join("\n");

            const embed = new Discord.MessageEmbed()
              .setTitle("20 Vaccine Locations Within 50 miles IN STOCK")
              .setColor("#f09719")
              .addFields({
                name: "Store",
                value: "```" + name + "```",
                inline: true,
              })
              .addFields({
                name: "Address",
                value: "```" + addy + "```",
                inline: true,
              })
              .addFields({
                name: "Phone",
                value: "```" + phone + "```",
                inline: true,
              })
              .setFooter(
                message.guild.name + " | " + "Vaccine Monitor",
                message.guild.iconURL()
              );

            message.channel.send(embed);
            // webhook({ username: "Vaccine Webhook", embeds: [embed] });

            // [0].in_stock;

            // fs.writeFile("vaccine.txt", document, (err) => {
            //   // In case of a error throw err.
            //   if (err) throw err;
            // });
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    }
  });
  client.login(token);
}
// client.on("message", (msg) => {
//   if (msg.content === "ping") {
//     msg.reply("Pong!");
//   }
// });
