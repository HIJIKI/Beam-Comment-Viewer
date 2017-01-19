//--------------------------------------------------------------------------------------------------
//= Common
//--------------------------------------------------------------------------------------------------

	window.onload = function()
	{
		setInterval("RundomComment()",1000);
	}

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