//--------------------------------------------------------------------------------------------------
//= Setting
//--------------------------------------------------------------------------------------------------
class Setting
{
	//----------------------------------------------------------------------------------------------
	//= 初期化
	//----------------------------------------------------------------------------------------------
	static Init()
	{
		// 各設定の初期値
		this.Defaults = 
		{
			UserName: 				"",
			Password:				"",
			AlwaysOnTop:			false,
			PutWhisper:				false,
			CallWhisper:			false,
			CallBouyomiChan:		false,
			BouyomiChanLocation:	"",
			CallUserName:			0,
			MaxCommentLength:		100
		};

		// 名前読み上げ設定の定数
		this.CALL_USER_NAME_OFF		= 0
		this.CALL_USER_NAME_BEFORE	= 1
		this.CALL_USER_NAME_AFTER	= 2

		this.MaxCommentLength = this.Defaults.MaxCommentLength;

		// RemoteTalk の相対パス (BouyomiChan.exe からの)
		this.RemoteTalkRelativePath = 'RemoteTalk\\RemoteTalk.exe';

		// 設定を読み込む
		this.Load();

		// メニューバーの各チェックボックスをアップデート
		MenuBar.CheckboxUpdate();

		// 常に最前面に表示の設定を適用する
		var Win = nw.Window.get();
		Win.setAlwaysOnTop(this.AlwaysOnTop);
	}

	//----------------------------------------------------------------------------------------------
	//= 設定画面を開く
	//----------------------------------------------------------------------------------------------
	static Open()
	{
		// メニューバーの 設定 > コメントを読み上げる をクリックできなくする
		MenuBar.CallBouyomiChanButton.enabled = false;

		// メニューバーの 設定 > 設定 をクリックできなくする
		MenuBar.SettingButton.enabled = false;

		// 画面に影をかける
		$('#Shade').addClass('Show');

		// 設定画面を表示させる
		$('#Setting').load('./setting.html');
		$('#Setting').addClass('Show');
	}

	//----------------------------------------------------------------------------------------------
	//= 設定画面を閉じる
	//----------------------------------------------------------------------------------------------
	static Close()
	{
		// メニューバーの 設定 > コメントを読み上げる をクリックできるようにする
		MenuBar.CallBouyomiChanButton.enabled = true;

		// メニューバーの 設定 > 設定 をクリックできるようにする
		MenuBar.SettingButton.enabled = true;

		// 画面の影を取り払う
		$('#Shade').removeClass('Show');

		// 設定画面を非表示にする
		$('#Setting').empty();
		$('#Setting').removeClass('Show');
	}

	//----------------------------------------------------------------------------------------------
	//= 設定を保存する
	//----------------------------------------------------------------------------------------------
	static Save()
	{
		// 省略用
		var t = this;
		var ls = localStorage;
		var un = undefined;
		var st = JSON.stringify;

		// undefined でない値のみ保存する
		if( t.UserName				!= un ) { ls.UserName				= st(t.UserName); }
		if( t.AlwaysOnTop			!= un ) { ls.AlwaysOnTop			= st(t.AlwaysOnTop); }
		if( t.PutWhisper			!= un ) { ls.PutWhisper				= st(t.PutWhisper); }
		if( t.CallWhisper			!= un ) { ls.CallWhisper			= st(t.CallWhisper); }
		if( t.CallBouyomiChan		!= un ) { ls.CallBouyomiChan		= st(t.CallBouyomiChan); }
		if( t.BouyomiChanLocation	!= un ) { ls.BouyomiChanLocation	= st(t.BouyomiChanLocation); }
		if( t.CallUserName			!= un ) { ls.CallUserName			= st(t.CallUserName); }

		// パスワードのみ例外的に暗号化して保存する
		if( t.Password				!= un )
		{
			ls.Password = st(Common.Encrypt(t.Password));
		}
	}

	//----------------------------------------------------------------------------------------------
	//= 設定を読み込む
	//----------------------------------------------------------------------------------------------
	static Load()
	{
		// 省略用
		var t = this;
		var ls = localStorage;
		var un = undefined;
		var p = JSON.parse;

		// 各データを読み込む (undefined の場合は初期値を代入する)
		t.UserName				= ls.UserName				!= un ? p(ls.UserName)				: t.Defaults.UserName;
		t.AlwaysOnTop			= ls.AlwaysOnTop			!= un ? p(ls.AlwaysOnTop)			: t.Defaults.AlwaysOnTop;
		t.PutWhisper			= ls.PutWhisper				!= un ? p(ls.PutWhisper)			: t.Defaults.PutWhisper;
		t.CallWhisper			= ls.CallWhisper			!= un ? p(ls.CallWhisper)			: t.Defaults.CallWhisper;
		t.CallBouyomiChan		= ls.CallBouyomiChan		!= un ? p(ls.CallBouyomiChan)		: t.Defaults.CallBouyomiChan;
		t.BouyomiChanLocation	= ls.BouyomiChanLocation	!= un ? p(ls.BouyomiChanLocation)	: t.Defaults.BouyomiChanLocation;
		t.CallUserName			= ls.CallUserName			!= un ? p(ls.CallUserName)			: t.Defaults.CallUserName;

		// パスワードのみ例外的に復号して読み込む
		t.Password = ls.Password != un ? Common.Decrypt(p(ls.Password))	: t.Defaults.Password;

		console.log("------------------------------")
		console.log("Setting loaded.")
		console.log("------------------------------")
		console.log("UserName: "+typeof(this.UserName)+" "+this.UserName);
		console.log("Password: "+typeof(this.Password)+" "+this.Password);
		console.log("AlwaysOnTop: "+typeof(this.AlwaysOnTop)+" "+this.AlwaysOnTop);
		console.log("PutWhisper: "+typeof(this.PutWhisper)+" "+this.PutWhisper);
		console.log("CallWhisper: "+typeof(this.CallWhisper)+" "+this.CallWhisper);
		console.log("CallBouyomiChan: "+typeof(this.CallBouyomiChan)+" "+this.CallBouyomiChan);
		console.log("BouyomiChanLocation: "+typeof(this.BouyomiChanLocation)+" "+this.BouyomiChanLocation);
		console.log("CallUserName: "+typeof(this.CallUserName)+" "+this.CallUserName);
		console.log("------------------------------")
		//*/
	}
}