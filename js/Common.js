//--------------------------------------------------------------------------------------------------
//= Common
//--------------------------------------------------------------------------------------------------

	// 仮
	window.onload = function()
	{
		// メニューバーを仮配置
		var gui = require('nw.gui');
		var menubar = new gui.Menu({ type: 'menubar' });
		var subMenu = new gui.Menu();
		menubar.append(new gui.MenuItem({ label: '表示', submenu: subMenu }));
		menubar.append(new gui.MenuItem({ label: '設定', submenu: subMenu }));
		menubar.append(new gui.MenuItem({ label: 'ヘルプ', submenu: subMenu }));

		gui.Window.get().menu = menubar;

		// デバッグ表示
		//setInterval("RundomComment()",1000);
	}
	//*/

	//----------------------------------------------------------------------------------------------
	//= チャットを送信する
	//----------------------------------------------------------------------------------------------
	$("#SendCommentArea textarea").keypress(function(event)
	{
		if( event.keyCode && event.keyCode == 13 )
		{
			SendComment(this.value);
			this.value = "";
			return false;
		}
		return true;
	});

	//----------------------------------------------------------------------------------------------
	//= アバター画像のURLを取得する
	//----------------------------------------------------------------------------------------------
	function GetAvatarURL(UserID)
	{
		const Prefix = "https://beam.pro/api/v1/users/"
		const Suffix = "/avatar";
		var Ret = Prefix + UserID + Suffix;
		return Ret;
	}

	//----------------------------------------------------------------------------------------------
	//= ランダムなコメント表示テスト (Debug)
	//----------------------------------------------------------------------------------------------
	function RundomComment()
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
	function EscapeHtml(string)
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