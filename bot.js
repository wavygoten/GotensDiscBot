const Discord = require("discord.js");
const client = new Discord.Client();
const token = {BOT-TOKEN-HERE};
const prefix = "-";
const axios = require("axios");
const cheerio = require("cheerio");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (message) => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command == "variants") {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const url = args[0];
    let lsize = "";
    let lvar = "";
    let data = [];
    try {
      axios({
        method: "get",
        url: url,
      }).then(function (response) {
        document = response.data;
        const $ = cheerio.load(document);
        var title = $('meta[property="og:title"]').attr("content");
        var img = $('meta[property="og:image"]').attr("content");
        var titletext = $("title").text();
        var price;

        if (!img.match(/^[a-zA-Z]+:\/\//)) {
          img = "https:" + img;
        } else {
          img = img;
        }
        if (title === undefined) title = titletext;

        const getAfterText = (allText, keyword) => {
          return allText.slice(allText.indexOf(keyword));
        };
        parsedData = JSON.parse(
          getAfterText(document, "var meta = ").split(";", 1)[0].substring(11)
        );
        for (size in parsedData.product.variants) {
          lsize += "\n" + parsedData.product.variants[size].public_title;
        }
        for (variant in parsedData.product.variants) {
          lvar += "\n" + parsedData.product.variants[variant].id;
        }

        price = parsedData.product.variants[0].price / 100;
        
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
              value: "$" + price + ".00",
              inline: false,
            }
          )
          .setThumbnail(img)
          .setFooter(
            message.guild.name + " - " + message.author.username,
            message.guild.iconURL()
          );
        message.channel.send(embed);
      }).catch(() => (error) => {
          const embederror = new Discord.MessageEmbed()
            .setColor("#f09719")
            .setDescription("Error Retrieving Variants");
          message.send.channel(embederror);
          console.log(error);
        });
    } catch (error) {
      const embed = new Discord.MessageEmbed()
        .setColor("#f09719")
        .setDescription("Error Retrieving Variants");
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
});

client.login(token);

