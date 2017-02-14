//--------------------------------------------------------------------------------------------------
//= BeamClientManager
//--------------------------------------------------------------------------------------------------
class BeamClientManager
{
	//----------------------------------------------------------------------------------------------
	//= 初期化
	//----------------------------------------------------------------------------------------------
	static Init()
	{
		// 接続に使用するソケット
		this.Socket;
	}

	//----------------------------------------------------------------------------------------------
	//= 接続
	//----------------------------------------------------------------------------------------------
	static Connect(_UserName, _Password, _ChannelName)
	{
		const BeamSocket = require('beam-client-node/lib/ws');
		const BeamClient = require('beam-client-node');

		// 既に接続している場合はソケットを閉じる (念のため)
		if( this.Socket != undefined )
		{
			if( this.Socket.isConnected() )
			{
				this.Socket.close();
			}
		}

		let userInfo;
		let ChannelId;
		let ChannelName;
		if( typeof _ChannelName == 'string' && _ChannelName.length > 0 )
		{
			ChannelName = _ChannelName;
		}
		else
		{
			ChannelName = Setting.UserName;
		}

		ViewCommentArea.SystemMessage(ChannelName+' のチャンネルに接続します。')

		var client = new BeamClient();

		client.request('GET', 'channels/'+ChannelName)
		.then(response => {
			ChannelId = response.body.id;

			// チャンネルID が正常に取得できたかどうか
			if( ChannelId == undefined )
			{
				// 接続に失敗した場合はメニューバーのボタンを元に戻す
				MenuBar.ConnectMyChannelButton.enabled = true;
				MenuBar.ConnectByChannelNameButton.enabled = true;

				BeamClientManager.Error('チャンネルが見つかりませんでした。', '-')
			}
			else
			{
				console.log('The ID from '+ChannelName+' is '+ChannelId);
				client.use('password', {
					username: _UserName,
					password: _Password,
				})
				.attempt()
				.then(response => {
					userInfo = response.body;
					return client.chat.join(ChannelId);
				})
				.then(response => {
					const body = response.body;
					this.Socket = BeamClientManager.CreateChatSocket(userInfo.id, ChannelId, body.endpoints, body.authkey, ChannelName);
					return this.Socket;
				})
				.catch(error => {
					// 接続に失敗した場合はメニューバーのボタンを元に戻す
					MenuBar.ConnectMyChannelButton.enabled = true;
					MenuBar.ConnectByChannelNameButton.enabled = true;

					var ErrorMessage = error.message.statusMessage;
					var ErrorCode = error.message.statusCode;
					BeamClientManager.Error(ErrorMessage, ErrorCode);
				});
			}
		})
		.catch(error => {
			// 接続に失敗した場合はメニューバーのボタンを元に戻す
			MenuBar.ConnectMyChannelButton.enabled = true;
			MenuBar.ConnectByChannelNameButton.enabled = true;

			var ErrorMessage = error.message.statusMessage;
			var ErrorCode = error.message.statusCode;
			BeamClientManager.Error(ErrorMessage, ErrorCode);
		});
		//*/
	}

	//----------------------------------------------------------------------------------------------
	//= 切断
	//----------------------------------------------------------------------------------------------
	static Disconnect()
	{
		// ソケットを閉じる
		if( this.Socket != undefined )
		{
			if( this.Socket.isConnected() )
			{
				this.Socket.close();
				ViewCommentArea.SystemMessage('切断しました。');

				Common.SetStatus(null);
			}
		}

	}

	//----------------------------------------------------------------------------------------------
	//= エラーメッセージを表示
	//----------------------------------------------------------------------------------------------
	static Error(ErrorMessage, ErrorCode)
	{
		// ログイン情報が間違っていた場合
		if( ErrorCode == 401 )
		{
			alert('ログインに失敗しました。\nBeam アカウントが正しく設定されていることを確認してください。');
			return;
		}
		
		// その他のエラー
		alert('接続に失敗しました: '+ErrorMessage+' (エラーコード: '+ErrorCode+')');

		if( this.Socket != undefined )
		{
			if( this.Socket.isConnected() )
			{
				this.Socket.close();
			}
		}

		return;
	}

	//----------------------------------------------------------------------------------------------
	//= チャットソケットを作成
	//----------------------------------------------------------------------------------------------
	static CreateChatSocket(userId, channelId, endpoints, authkey, channelName)
	{
		const BeamSocket = require('beam-client-node/lib/ws');
		const socket = new BeamSocket(endpoints).boot();

		socket.auth(channelId, userId, authkey)
		// 接続完了時
		.then(() => {
			// 切断ボタンを有効にする
			MenuBar.DisconnectButton.enabled = true;

			ViewCommentArea.SystemMessage('接続に成功しました。');
			BeamClientManager.EventRegister();

			Common.SetStatus(channelName+' に接続中');
			return;
		})
		// エラー時
		.catch(error => {
			var ErrorMessage = error.message.statusMessage;
			var ErrorCode = error.message.statusCode;
			BeamClientManager.Error(ErrorMessage, ErrorCode);
		});

		return socket;
	}

	//----------------------------------------------------------------------------------------------
	//= 各イベントの処理を定義
	//----------------------------------------------------------------------------------------------
	static EventRegister()
	{
		// チャット受信時
		this.Socket.on('ChatMessage', data => {

			var AvatarURL = Common.GetAvatarURL(data.user_id);
			var UserName = data.user_name;
			var IsWhisper = data.message.meta.whisper;

			// 出力用メッセージ
			var Message = "";

			// 棒読み用メッセージ
			var BouyomiMessage = "";

			// 名前を先に読み上げる場合
			if( Setting.CallUserName == Setting.CALL_USER_NAME_BEFORE )
			{
				BouyomiMessage += UserName+" ";
			}

			// メッセージを用途別に整形
			for( var id in data.message.message )
			{
				var mes = data.message.message[id];
				Message += mes.text;
				if( mes.type == 'text' || mes.type == 'link' )
				{
					BouyomiMessage += mes.text;
				}
			}

			// コメントエリアに出力
			if( !IsWhisper || (IsWhisper && Setting.PutWhisper) )
			{
				ViewCommentArea.PutComment(AvatarURL, UserName, Message, IsWhisper);
			}

			// 名前を後に読み上げる場合
			if( Setting.CallUserName == Setting.CALL_USER_NAME_AFTER )
			{
				BouyomiMessage += " "+UserName;
			}

			// 棒読みちゃんに投げる
			if( !IsWhisper || (IsWhisper && Setting.CallWhisper) )
			{
				if( Setting.CallBouyomiChan )
				{
					BouyomiMessage = BouyomiMessage.trim();
					if( BouyomiMessage != "" )
					{
						Common.SendBouyomi(BouyomiMessage);
					}
				}
			}
		});

		// エラー発生時
		this.Socket.on('error', error => {
			var ErrorMessage = error.message.statusMessage;
			var ErrorCode = error.message.statusCode;
			BeamClientManager.Error(ErrorMessage, ErrorCode);
			console.error('Socket error', error);
		});
	}

	//----------------------------------------------------------------------------------------------
	//= Beam にチャットコメントを送信
	//----------------------------------------------------------------------------------------------
	static SendComment(Message)
	{
		// 接続しているか確認 (念のため)
		if( this.Socket != undefined )
		{
			if( this.Socket.isConnected() )
			{
				this.Socket.call('msg', [Message]);
			}
		}
	}

}