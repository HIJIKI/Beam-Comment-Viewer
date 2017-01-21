//--------------------------------------------------------------------------------------------------
//= BeamClient
//--------------------------------------------------------------------------------------------------
	// ライブラリの読み込み
	const Exec = require('child_process').exec;
	const BeamClient = require('beam-client-node');
	const BeamSocket = require('beam-client-node/lib/ws');

	// 設定ファイルを読み込む
	var Settings = Common.LoadJson(process.env.APPDATA+"/BeamCommentViewer/Settings.json");

	// 棒読みちゃんの RemoteTalk のパス
	var RemoteTalk = Settings.BouyomiChan+'\\RemoteTalk\\RemoteTalk.exe';

	// 名前を読み上げるかどうか
	var CallName = Settings.CallName;

	// ユーザー情報
	let userInfo;

	const client = new BeamClient();

	var socket;

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
		socket = new BeamSocket(body.endpoints).boot();
		return CreateChatSocket(userInfo.id, userInfo.channel.id, body.endpoints, body.authkey);
	})
	.catch(error => {
		console.log('Something went wrong:', error);
	});

	// チャットに接続
	function CreateChatSocket (userId, channelId, endpoints, authkey) {
		// const socket = new BeamSocket(endpoints).boot();

		socket.auth(channelId, userId, authkey)
		.then(() => {
			ViewCommentArea.PutComment('./img/icon.png', 'System', 'Beam のチャットに接続しました。');
			SendBouyomi("Beamのチャットに接続しました。")
			return;
		})
		.catch(error => {
			console.log('Oh no! An error occurred!', error);
		});

		// チャット受信時
		socket.on('ChatMessage', data => {

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

		socket.on('error', error => {
			console.error('Socket error', error);
		});
	}

	//----------------------------------------------------------------------------------------------
	//= Beam にチャットコメントを送信
	//----------------------------------------------------------------------------------------------
	function SendComment(Message)
	{
		socket.call('msg', [Message]);
	}

	//----------------------------------------------------------------------------------------------
	//= Message を棒読みちゃんに読ませる
	//----------------------------------------------------------------------------------------------
	function SendBouyomi(Message)
	{
		Exec(RemoteTalk + ' /talk ' + '"'+Message+'"');
	}