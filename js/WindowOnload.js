//--------------------------------------------------------------------------------------------------
//= window.onload
//--------------------------------------------------------------------------------------------------
window.onload = function()
{
	// 起動速度計測用のタイマーを終了させる
	console.timeEnd('Launch Complete');
	
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