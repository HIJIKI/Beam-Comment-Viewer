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
			CallUserName:			0
		};

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
		// undefined でない値のみ保存する
		if( this.UserName				!= undefined ) { localStorage.UserName				= JSON.stringify(this.UserName); }
		if( this.Password				!= undefined ) { localStorage.Password				= JSON.stringify(this.Password); }
		if( this.AlwaysOnTop			!= undefined ) { localStorage.AlwaysOnTop			= JSON.stringify(this.AlwaysOnTop); }
		if( this.PutWhisper				!= undefined ) { localStorage.PutWhisper			= JSON.stringify(this.PutWhisper); }
		if( this.CallWhisper			!= undefined ) { localStorage.CallWhisper			= JSON.stringify(this.CallWhisper); }
		if( this.CallBouyomiChan		!= undefined ) { localStorage.CallBouyomiChan		= JSON.stringify(this.CallBouyomiChan); }
		if( this.BouyomiChanLocation	!= undefined ) { localStorage.BouyomiChanLocation	= JSON.stringify(this.BouyomiChanLocation); }
		if( this.CallUserName			!= undefined ) { localStorage.CallUserName			= JSON.stringify(this.CallUserName); }

		/*
		console.log("------------------------------")
		console.log("Setting saved.")
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

	//----------------------------------------------------------------------------------------------
	//= 設定を読み込む
	//----------------------------------------------------------------------------------------------
	static Load()
	{
		// 省略用
		const t = this;
		const ls = localStorage;
		const un = undefined;
		const p = JSON.parse;

		// 各データを読み込む (undefined の場合は初期値を代入する)
		t.UserName				= ls.UserName				!= un ? p(ls.UserName)				: t.Defaults.UserName;
		t.Password				= ls.Password				!= un ? p(ls.Password)				: t.Defaults.Password;
		t.AlwaysOnTop			= ls.AlwaysOnTop			!= un ? p(ls.AlwaysOnTop)			: t.Defaults.AlwaysOnTop;
		t.PutWhisper			= ls.PutWhisper				!= un ? p(ls.PutWhisper)			: t.Defaults.PutWhisper;
		t.CallWhisper			= ls.CallWhisper			!= un ? p(ls.CallWhisper)			: t.Defaults.CallWhisper;
		t.CallBouyomiChan		= ls.CallBouyomiChan		!= un ? p(ls.CallBouyomiChan)		: t.Defaults.CallBouyomiChan;
		t.BouyomiChanLocation	= ls.BouyomiChanLocation	!= un ? p(ls.BouyomiChanLocation)	: t.Defaults.BouyomiChanLocation;
		t.CallUserName			= ls.CallUserName			!= un ? p(ls.CallUserName)			: t.Defaults.CallUserName;

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