//--------------------------------------------------------------------------------------------------
//= Init
//--------------------------------------------------------------------------------------------------

	//----------------------------------------------------------------------------------------------
	//= 各クラスの初期化
	//----------------------------------------------------------------------------------------------
	Common.Init();
	MenuBar.Init();
	Setting.Init();
	BeamClientManager.Init();
	BouyomiChanManager.Init();
	SendCommentArea.Init();
	ViewCommentArea.Init();

	//----------------------------------------------------------------------------------------------
	//= アプリケーションの起動が完了した時
	//----------------------------------------------------------------------------------------------
	window.onload = function()
	{
		// 設定が有効な場合はアップデートを確認する
		if( Setting.CheckUpdate )
		{
			Common.CheckUpdate();
		}

		// 設定が有効な場合は自動的に接続する
		if( Setting.AutoConnect )
		{
			MenuBar.ConnectMyChannel();
		}
	}