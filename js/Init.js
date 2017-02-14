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
	SendCommentArea.Init();
	ViewCommentArea.Init();

	//----------------------------------------------------------------------------------------------
	//= アップデートを確認する
	//----------------------------------------------------------------------------------------------
	if( Setting.CheckUpdate )
	{
		Common.CheckUpdate();
	}

	//----------------------------------------------------------------------------------------------
	//= 設定が有効な場合は自動的に接続する
	//----------------------------------------------------------------------------------------------
	//*
	window.onload = function()
	{
		if( Setting.AutoConnect )
		{
			MenuBar.ConnectMyChannel();
		}
	}
	//*/