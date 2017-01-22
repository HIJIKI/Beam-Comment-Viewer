//--------------------------------------------------------------------------------------------------
//= BeamClient
//--------------------------------------------------------------------------------------------------
class BeamClient
{

	//----------------------------------------------------------------------------------------------
	//= 初期化
	//----------------------------------------------------------------------------------------------
	static Init()
	{
		// 省略用
		var m = this;

		var Settings = Common.LoadJson(process.env.APPDATA+"/BeamCommentViewer/Settings.json");

		// 各ライブラリの読み込み
		const BeamClient = require('beam-client-node');
		const BeamSocket = require('beam-client-node/lib/ws');

		// 接続に使用するソケット
		m.Socket;

		// ユーザー情報
		var userInfo;

		const client = new BeamClient();
		client.use('password', {
			username: Settings.Username,
			password: Settings.Password,
		})
		.attempt()
		.then(response => {
			userInfo = response.body;
			return client.chat.join(response.body.channel.id);
		})
		.then(response => {
			const body = response.body;
			m.Socket = new BeamSocket(body.endpoints).boot();
			return CreateChatSocket(userInfo.id, userInfo.channel.id, body.endpoints, body.authkey);
		})
		.catch(error => {
			console.log('Something went wrong:', error);
		});

		// チャットに接続
		function CreateChatSocket (userId, channelId, endpoints, authkey) {
			m.Socket.auth(channelId, userId, authkey)
			.then(() => {
				ViewCommentArea.SystemMessage('Beam のチャットに接続しました。');
				//SendBouyomi("Beamのチャットに接続しました。");
				return;
			})
			.catch(error => {
				console.log('Oh no! An error occurred!', error);
			});

			// チャット受信時
			m.Socket.on('ChatMessage', data => {

				// 受信したメッセージが Whisper でない場合のみ
				if( data.message.meta.whisper != true ){

					// 出力用メッセージ
					var Message = "";

					// 棒読み用メッセージ
					var BouyomiMessage = "";

					// コンソールログ用メッセージ
					var LogMessage = data.user_name+": ";

					// メッセージを各用途別に整形
					for( var id in data.message.message )
					{
						var mes = data.message.message[id];

						Message += mes.text;

						if( mes.type == 'text' || mes.type == 'link' )
						{
							BouyomiMessage += mes.text;
						}

						LogMessage += mes.text;
					}

					// アプリに出力
					ViewCommentArea.PutComment(Common.GetAvatarURL(data.user_id), data.user_name, Message);

					// 名前を読み上げる場合
					if( CallName )
					{
						BouyomiMessage += " " + data.user_name;
					}

					// 棒読みちゃんに投げる
					BouyomiMessage = BouyomiMessage.trim();
					if( BouyomiMessage != "" )
					{
						//SendBouyomi(BouyomiMessage);
					}

					// ログに出力
					console.log(LogMessage);

				}
			});

			m.Socket.on('error', error => {
				console.error('Socket error', error);
			});
		}
	}

	//----------------------------------------------------------------------------------------------
	//= Beam にチャットコメントを送信
	//----------------------------------------------------------------------------------------------
	static SendComment(Message)
	{
		this.Socket.call('msg', [Message]);
	}

}