/*--------------------------------------------------------------------------------------------------
//= BouyomiChanManager
//------------------------------------------------------------------------------------------------*/
class BouyomiChanManager
{
	//----------------------------------------------------------------------------------------------
	//= 初期化
	//----------------------------------------------------------------------------------------------
	static Init()
	{
		this.Exec = require('child_process').exec;
	}

	//----------------------------------------------------------------------------------------------
	//= Message を棒読みちゃんに読ませる
	//----------------------------------------------------------------------------------------------
	static Call(Message)
	{
		var BouyomiChan = Setting.BouyomiChanLocation;
		var BouyomiDir = Common.FullPath2Dir(BouyomiChan);
		var RemoteTalk = BouyomiDir+'\\'+Setting.RemoteTalkRelativePath;
		// RemoteTalk が見つかった場合のみ
		if( Common.Exist(RemoteTalk) )
		{
			this.Exec('"' + RemoteTalk + '"' + ' /talk ' + '"'+Message+'"');
		}
	}

	//----------------------------------------------------------------------------------------------
	//= 読み上げ用にコメントを整形
	//----------------------------------------------------------------------------------------------
	/*
	 *	@Data: BeamSocket の ChatMessage イベントで受け取ったコメントデータ
	 */
	static Format(Data)
	{
		var Ret = '';

		// 名前を先に読み上げる場合
		if( Setting.CallUserName == Setting.CALL_USER_NAME_BEFORE )
		{
			Ret += Data.user_name+' ';
		}

		// メッセージを整形
		for( var id in Data.message.message )
		{
			var mes = Data.message.message[id];
			if( mes.type == 'text' || mes.type == 'link' || mes.type == 'tag' )
			{
				Ret += mes.text;
			}
		}

		// 名前を後に読み上げる場合
		if( Setting.CallUserName == Setting.CALL_USER_NAME_AFTER )
		{
			Ret += ' '+Data.user_name;
		}

		return Ret;
	}

}