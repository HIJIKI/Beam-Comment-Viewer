// TODO: ウィスパーも読み上げる設定を追加する
// TODO: 必要な node_modules をインストールするbatファイルを作る
// TODO: 名前の読み上げをコメントの前と後の両方に対応する

// 設定ファイルを読み込む
const Settings = LoadJson(process.env.APPDATA+"/BeamCommentViewer/Settings.json");

// 棒読みちゃんの RemoteTalk のパス
const RemoteTalk = Settings.BouyomiChan+'\\RemoteTalk\\RemoteTalk.exe';

// 名前を読み上げるかどうか
const CallName = Settings.CallName;

const Exec = require('child_process').exec;
const BeamClient = require('beam-client-node');
const BeamSocket = require('beam-client-node/lib/ws');

let userInfo;

const client = new BeamClient();

client.use('password', {
	username: Settings.Username,
	password: Settings.Password,
})

.attempt()
.then(response => {
	//console.log(response.body);
	userInfo = response.body;
	return client.chat.join(response.body.channel.id);
})
.then(response => {
	const body = response.body;
	//console.log(body);
	return createChatSocket(userInfo.id, userInfo.channel.id, body.endpoints, body.authkey);
})
.catch(error => {
	console.log('Something went wrong:', error);
});


// チャットに接続
function createChatSocket (userId, channelId, endpoints, authkey) {
	const socket = new BeamSocket(endpoints).boot();

	socket.auth(channelId, userId, authkey)
	.then(() => {
		console.log('Beam のチャットに接続しました。');
		PutComment('Beam のチャットに接続しました。');
		SendBouyomi("Beamのチャットに接続しました。")
		return;
	})
	.catch(error => {
		console.log('Oh no! An error occurred!', error);
	});

	// チャット受信時
	socket.on('ChatMessage', data => {

		// 受信したメッセージが Whisper の場合は何もしない
        if( data.message.meta.whisper != true ){

    		// 受信したメッセージを整形
    		var LogMessage = data.user_name+": ";
    		var BouyomiMessage = "";
    		for( var id in data.message.message )
    		{
    			var mes = data.message.message[id];
    			LogMessage += mes.text;
    			if( mes.type == 'text' || mes.type == 'link' )
    			{
    				BouyomiMessage += mes.text;
    			}
    		}

    		// 名前を読み上げる場合
    		if( CallName )
    		{
    			BouyomiMessage += " " + data.user_name;
    		}

    		// 棒読みちゃんに投げる
    		BouyomiMessage = BouyomiMessage.trim();
    		if( BouyomiMessage != "" )
    		{
    			SendBouyomi(BouyomiMessage);
    		}

    		// ログに出力
    		PutComment(LogMessage+"/"+abata.then());
    		console.log(LogMessage);

        }
	});

	socket.on('error', error => {
		console.error('Socket error', error);
	});
}

// Message を棒読みちゃんに読ませる
function SendBouyomi(Message)
{
	Exec(RemoteTalk + ' /talk ' + '"'+Message+'"');
}