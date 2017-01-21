//--------------------------------------------------------------------------------------------------
//= Common
//--------------------------------------------------------------------------------------------------
class Common
{

	//----------------------------------------------------------------------------------------------
	//= 初期化
	//----------------------------------------------------------------------------------------------
	static Init()
	{
		
	}

	//----------------------------------------------------------------------------------------------
	//= アバター画像のURLを取得する
	//----------------------------------------------------------------------------------------------
	static GetAvatarURL(UserID)
	{
		const Prefix = "https://beam.pro/api/v1/users/"
		const Suffix = "/avatar";
		var Ret = Prefix + UserID + Suffix;
		return Ret;
	}

	//----------------------------------------------------------------------------------------------
	//= ランダムなコメント表示テスト (Debug)
	//----------------------------------------------------------------------------------------------
	static RundomComment()
	{
		const UserName = ["HIJIKIsw", "Bill", "Johny", "Connie Talbot", "Michael Jackson", "かずお", "たかし", "裕行", "佳輔", "多嘉山 克真", "波々伯部 達馬"];
		const Comment = ["こんにちは。", "Hi", "Hello", "あけましておめでとうございます。", "あのー、肉じゃが作りすぎちゃったんですけど、無事食べきれました", "GG", "行く手をふさがれたら、回り道で行けばいいのよ。", "When you come to a roadblock, take a detour.", "機敏であれ、しかし慌ててはいけない。", "Be quick, but don’t hurry.", "コンピューターおばあちゃん。"];

		var N = UserName[Math.floor(Math.random()*UserName.length)];
		var C = Comment[Math.floor(Math.random()*Comment.length)];

		PutComment(GetAvatarURL(703508), N, C);
	}

	//----------------------------------------------------------------------------------------------
	//= 文字列を HTML 用にエスケープする (参考: http://qiita.com/saekis/items/c2b41cd8940923863791)
	//----------------------------------------------------------------------------------------------
	static EscapeHtml(string)
	{
		if(typeof string !== 'string')
		{
			return string;
		}
		return string.replace(/[&'`"<>]/g, function(match)
		{
			return {
				'&': '&amp;',
				"'": '&#x27;',
				'`': '&#x60;',
				'"': '&quot;',
				'<': '&lt;',
				'>': '&gt;',
			}[match]
		});
	}

	/*
	//----------------------------------------------------------------------------------------------
	//= Message を棒読みちゃんに読ませる
	//----------------------------------------------------------------------------------------------
	function SendBouyomi(Message)
	{
		Exec(RemoteTalk + ' /talk ' + '"'+Message+'"');
	}
	//*/

	//----------------------------------------------------------------------------------------------
	//= Json ファイルに書き込む (削除予定)
	//----------------------------------------------------------------------------------------------
	/*
	function SaveJson(JsonPath)
	{
		const fs = require('fs-extra');
		const AppData = process.env.APPDATA;
		const JsonDir = AppData + "/BeamCommentViewer";
		const JsonName = "Settings.json";
		
		var Input = document.getElementById('UserInput');

		var Data = {
			"Data": Input.value
		};
		fs.mkdirsSync(JsonDir);
		fs.writeFile(JsonDir + "/" + JsonName, JSON.stringify(Data, null, '	'));

		console.log("Saved");
	}
	//*/

	//----------------------------------------------------------------------------------------------
	//= Json ファイルを読み込む (削除予定)
	//----------------------------------------------------------------------------------------------
	static LoadJson(JsonPath)
	{
		const fs = require('fs-extra');
		var Data = JSON.parse(fs.readFileSync(JsonPath, 'utf8'));
		return Data;
	}

}