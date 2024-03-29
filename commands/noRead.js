const { sendMessage } = require('../functions/sendMessage.js');

module.exports = {
    attr: "base",
    data: {
        name: "noread",
        description: "このコマンドを使用すると，ttsListに登録済みのユーザでもbotに読み上げられない",
        options: [
            {
                type: 3,//"STRING",
                name: "message",
                required: true,
                description: "テキストチャットにはこの引数の内容が送信される",
            }
        ]
    },
    async execute(interaction) {
        //引数のメッセージを取得
        let readTxt = interaction.options.get("message").value;

        //ユーザアカウントに偽装したwebhookを送る
        await sendMessage("🔇", interaction,readTxt).catch(e => console.error(e));

        //ここまでで必要な動作は全て済んでいるが，interactionに返答しないとアプリ側にエラーが出てうざい
        //ので適当に返信してすぐ消す
        //ここが返信
        // await interaction.reply({ content: interaction.options.get("message").value, ephemeral: false })
        //     .then(console.log)
        //     .catch(console.error);
        // //こっちで消す
        await interaction.deleteReply()
            .then(console.log)
            .catch(console.error);
        return;
    }
}