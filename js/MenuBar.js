//--------------------------------------------------------------------------------------------------
//= MenuBar
//--------------------------------------------------------------------------------------------------
class MenuBar
{

	//----------------------------------------------------------------------------------------------
	//= 初期化
	//----------------------------------------------------------------------------------------------
	static Init()
	{
		var Gui = require('nw.gui');
		var Separator = new Gui.MenuItem({ type: 'separator' });

		//------------------------------------------------------------------------------------------
		//= 各ボタンの定義
		//------------------------------------------------------------------------------------------

		// 接続 ボタン
		this.ConnectButton = new Gui.MenuItem(
		{
			label: '接続',
			click: function(){ MenuBar.Connect(); }
		});

		// 切断ボタン
		this.DisconnectButton = new Gui.MenuItem(
		{
			label: '切断',
			click: function(){ MenuBar.Disconnect(); },
			enabled: false
		});

		// 終了ボタン
		this.ExitButton = new Gui.MenuItem(
		{
			label: '終了',
			click: function(){ MenuBar.Exit(); }
		});

		// 常に最前面に表示ボタン
		this.AlwaysOnTopButton = new Gui.MenuItem(
		{
			type: 'checkbox',
			label: '常に最前面に表示',
			click: function() { MenuBar.ToggleAlwaysOnTop(); }
		});

		// ユーザーアイコンを表示ボタン
		/*
		this.ShowUserIconButton = new Gui.MenuItem(
		{
			type: 'checkbox',
			label: 'ユーザーアイコンを表示',
			click: function() { MenuBar.ToggleShowUserIcon(); }
		});
		//*/

		// 棒読みちゃん連携を有効にするボタン
		this.CallBouyomiChanButton = new Gui.MenuItem(
		{
			type: 'checkbox',
			label: '棒読みちゃん連携を有効にする',
			click: function(){ MenuBar.ToggleCallBouyomiChan(); }
		});

		// 設定ボタン
		this.SettingButton = new Gui.MenuItem(
		{
			label: '設定',
			click: function(){ MenuBar.OpenSettingWindow(); }
		});

		// バージョン情報ボタン
		this.VersionInfoButton = new Gui.MenuItem(
		{
			label: 'バージョン情報',
			click: function(){ MenuBar.OpenVersionInfo(); }
		});

		//------------------------------------------------------------------------------------------
		//= 各ボタンを各メニューに登録
		//------------------------------------------------------------------------------------------
		// ファイル
		this.File = new Gui.Menu();
		this.File.append(this.ConnectButton);									// 接続
		this.File.append(this.DisconnectButton);								// 切断
		this.File.append(Separator);											// --------
		this.File.append(this.ExitButton);										// 終了

		// 表示
		this.View = new Gui.Menu();
		this.View.append(this.AlwaysOnTopButton);								// 常に最前面に表示
		//this.View.append(this.ShowUserIconButton);							// ユーザーアイコンを表示

		// 設定
		this.Setting = new Gui.Menu();
		this.Setting.append(this.CallBouyomiChanButton);						// 棒読みちゃん連携を有効にする
		this.Setting.append(this.SettingButton);								// 設定

		// ヘルプ
		this.Help = new Gui.Menu();
		this.Help.append(this.VersionInfoButton);								// バージョン情報

		//------------------------------------------------------------------------------------------
		//= 各メニューをメニューバーに登録
		//------------------------------------------------------------------------------------------
		this.Menus = new Gui.Menu({ type: 'menubar' });
		this.Menus.append(new Gui.MenuItem({ label: 'ファイル',	submenu: this.File		}));
		this.Menus.append(new Gui.MenuItem({ label: '表示',		submenu: this.View		}));
		this.Menus.append(new Gui.MenuItem({ label: '設定',		submenu: this.Setting	}));
		this.Menus.append(new Gui.MenuItem({ label: 'ヘルプ',	submenu: this.Help		}));

		//------------------------------------------------------------------------------------------
		//= メニューバーをウィンドウに登録
		//------------------------------------------------------------------------------------------
		Gui.Window.get().menu = this.Menus;

	}

	//----------------------------------------------------------------------------------------------
	//= 接続
	//----------------------------------------------------------------------------------------------
	static Connect()
	{
		// 接続ボタンを無効にする
		MenuBar.ConnectButton.enabled = false;

		// 接続
		BeamClientManager.Connect(Setting.UserName, Setting.Password);
	}

	//----------------------------------------------------------------------------------------------
	//= 切断
	//----------------------------------------------------------------------------------------------
	static Disconnect()
	{
		// 接続ボタンを有効に、切断ボタンを無効にする
		MenuBar.ConnectButton.enabled = true;
		MenuBar.DisconnectButton.enabled = false;

		// 切断
		BeamClientManager.Disconnect();
	}

	//----------------------------------------------------------------------------------------------
	//= 終了
	//----------------------------------------------------------------------------------------------
	static Exit()
	{
		Common.Exit();
	}

	//----------------------------------------------------------------------------------------------
	//= 常に最前面に表示
	//----------------------------------------------------------------------------------------------
	static ToggleAlwaysOnTop()
	{
		var Win = nw.Window.get();
		var Flag = this.AlwaysOnTopButton.checked;
		Setting.AlwaysOnTop = Flag;
		Win.setAlwaysOnTop(Flag);
	}

	//----------------------------------------------------------------------------------------------
	//= 棒読みちゃん連携を有効にする
	//----------------------------------------------------------------------------------------------
	static ToggleCallBouyomiChan()
	{
		var Flag = this.CallBouyomiChanButton.checked;
		Setting.CallBouyomiChan = Flag;

		if( Flag && Setting.BouyomiChanLocation == '' )
		{
			Setting.Open();
		}
	}

	//----------------------------------------------------------------------------------------------
	//= 設定
	//----------------------------------------------------------------------------------------------
	static OpenSettingWindow()
	{
		Setting.Open();
	}

	//----------------------------------------------------------------------------------------------
	//= バージョン情報
	//----------------------------------------------------------------------------------------------
	static OpenVersionInfo()
	{
		const pjson = require('./package.json');
		const Version = pjson.version;
		var Data =
		[
			'Beam Comment Viewer\n',
			'Version '+Version+'\n',
			'\n',
			'GitHub: https://github.com/HIJIKIsw/Beam-Comment-Viewer\n',
			'\n',
			'©2017 HIJIKIsw\n',
			'Icon Design: kix'
		].join("");
		alert(Data);
	}

	//----------------------------------------------------------------------------------------------
	//= 各チェックボックスを適宜変更する
	//----------------------------------------------------------------------------------------------
	static CheckboxUpdate()
	{
		this.AlwaysOnTopButton.checked = Setting.AlwaysOnTop;
		this.CallBouyomiChanButton.checked = Setting.CallBouyomiChan;
	}

}