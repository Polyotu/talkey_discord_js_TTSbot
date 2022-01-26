const { NoSubscriberBehavior, joinVoiceChannel, getVoiceConnection, createAudioPlayer } = require("@discordjs/voice");
const { addGuildToMap } = require('../functions/audioMap.js');
const { MessageEmbed } = require('discord.js');

var fs = require('fs');
var path = require('path');

var tokens = JSON.parse(
    fs.readFileSync(
        path.resolve(__dirname, "../../tokens.json")
    )
);

module.exports = {
    attr: "base",
    data: {
        name: "join",
        description: "botをvcに参加させる",
    },
    async execute(interaction) {
        //コマンド送信者のVC状況をチェック
        const memberVC = interaction.member.voice.channel;
        const guild = interaction.guild;
        // const member = await guild.members.fetch(interaction.member.id);
        // const memberVC = member.voice.channel;

        const botConnection = getVoiceConnection(interaction.guild.id);

        //そもそも参加していない場合
        if (!memberVC) {
            const replyMessage = "コマンド送信者がボイスチャットに参加している必要があります．";
            return interaction.reply(replyMessage);
        }
        //botが既に参加している場合
        else if (botConnection != undefined) {
            const replyMessage = "botは既にボイスチャットに接続しています．";
            return interaction.reply(replyMessage);
        }
        //botが参加できない場合
        else if (!memberVC.joinable) {
            const replyMessage = "botがボイスチャットに接続できませんでした．";
            return interaction.reply(replyMessage);
        }
        //botに音声再生権限が無い場合
        else if (!memberVC.speakable) {
            const replyMessage = "botに音声再生権限がありません．";
            return interaction.reply(replyMessage);
        }
        //全部違ったら接続
        else {
            const embed = new MessageEmbed()
                .setTitle('ボイスチャンネルに参加します')
                .setColor('#0000ff')
                .addFields(
                    {
                        name: "簡単な使い方",
                        value: "ボイスチャットに参加している間は，/talk コマンドを使用した書き込みがあった場合ゆっくりボイスで読み上げます．\n詳しい使い方は下記のサーバからどうぞ．"
                    },
                    {
                        name: "詳細説明",
                        value: `詳しい使い方やアプデ情報，質問はここから: ${tokens.officialServerURL}`
                    },
                    {
                        name: "音声合成プログラム",
                        value: "読み上げ用音声データ生成にはAquesTalkPiを利用させて頂いています．\nhttps://www.a-quest.com/products/aquestalkpi.html"
                    }
                );
            const connection = joinVoiceChannel({
                guildId: guild.id,
                channelId: memberVC.id,
                adapterCreator: guild.voiceAdapterCreator,
                selfMute: false,
            });
            const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause, } });
            connection.subscribe(player);
            addGuildToMap(guild.id, memberVC.id, connection, player);
            return interaction.reply({ embeds: [embed] });
            // return interaction.reply(replyMessage);
        }
    }
}