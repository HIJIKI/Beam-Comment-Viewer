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
		// ウィンドウが閉じられた時のイベントを登録
		const Gui = require('nw.gui');
		const Window = Gui.Window.get();
		Window.on( 'close', function()
		{
			Common.Exit();
		});
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

		ViewCommentArea.PutComment(Common.GetAvatarURL(703508), N, C, false);
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

	//----------------------------------------------------------------------------------------------
	//= ファイルのフルパスからディレクトリに変換する
	//----------------------------------------------------------------------------------------------
	static FullPath2Dir(FullPath)
	{
		// スラッシュ「/」を逆スラッシュ「\」に置換 (念のため)
		var FilePath = FullPath.replace(/\//g, '\\');

		// 「\」でsplit
		var FilePaths = FilePath.split('\\');

		// 末尾の要素 (ファイル名の部分) を削除
		FilePaths.pop();

		return FilePaths.join('\\');
	}

	//----------------------------------------------------------------------------------------------
	//= ファイルのフルパスからファイル名のみを取り出す
	//----------------------------------------------------------------------------------------------
	static FullPath2FileName(FullPath)
	{
		// スラッシュ「/」を逆スラッシュ「\」に置換 (念のため)
		var FilePath = FullPath.replace(/\//g, '\\');

		// 「\」でsplit
		var FilePaths = FilePath.split('\\');

		return FilePaths.pop();
	}

	//----------------------------------------------------------------------------------------------
	//= アプリケーションを終了する
	//----------------------------------------------------------------------------------------------
	static Exit()
	{
		// 設定を保存する
		Setting.Save();

		BeamClientManager.Disconnect();

		// 終了する
		var Gui = require('nw.gui');
		Gui.App.closeAllWindows();
		Gui.App.quit();
	}

	//----------------------------------------------------------------------------------------------
	//= ファイルの有無を確認する
	//----------------------------------------------------------------------------------------------
	static Exist(FilePath) {
		const fs = require('fs');
		try
		{
			fs.statSync(FilePath);
			return true
		}
		catch(err)
		{
			if(err.code === 'ENOENT')
			{
				return false
			}
		}
	}

	//----------------------------------------------------------------------------------------------
	//= Message を棒読みちゃんに読ませる
	//----------------------------------------------------------------------------------------------
	static SendBouyomi(Message)
	{
		const Exec = require('child_process').exec;
		var BouyomiChan = Setting.BouyomiChanLocation;
		var BouyomiDir = Common.FullPath2Dir(BouyomiChan);
		var RemoteTalk = BouyomiDir+'\\'+Setting.RemoteTalkRelativePath;
		// RemoteTalk が見つかった場合のみ
		if( Common.Exist(RemoteTalk) )
		{
			Exec('"' + RemoteTalk + '"' + ' /talk ' + '"'+Message+'"');
		}
	}

	//----------------------------------------------------------------------------------------------
	//= MAC アドレスを取得する
	//----------------------------------------------------------------------------------------------
	static GetMacAddress()
	{
		const macaddress = require('macaddress');
		const NI = macaddress.networkInterfaces();

		var Result = '';
		for (var i in NI) {
			Result += NI[i].mac;
		}

	    return Result;
	}

	//----------------------------------------------------------------------------------------------
	//= MAC アドレスをシードとして暗号化
	//----------------------------------------------------------------------------------------------
	static Encrypt(PlainText)
	{
		const UniqueID = Common.GetMacAddress();
		const crypto = require("crypto");
		var cipher = crypto.createCipher('aes192', UniqueID);

		var Original = ''+PlainText;
		var Encrypted = '';

		Encrypted = cipher.update(Original, 'utf8', 'hex');
		Encrypted += cipher.final('hex');
		return Encrypted;
	}

	//----------------------------------------------------------------------------------------------
	//= MAC アドレスをシードとして復号
	//----------------------------------------------------------------------------------------------
	static Decrypt(Encrypted)
	{
		const UniqueID = Common.GetMacAddress();
		const crypto = require("crypto");
		var decipher = crypto.createDecipher('aes192', UniqueID);

		var Original = ''+Encrypted;
		var Decrypted = '';

		Decrypted = decipher.update(Original, 'hex', 'utf8');
		Decrypted += decipher.final('utf8');
		return Decrypted;
	}
}