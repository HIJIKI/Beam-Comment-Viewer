//--------------------------------------------------------------------------------------------------
//= ViewCommentArea
//--------------------------------------------------------------------------------------------------
class ViewCommentArea
{

	//----------------------------------------------------------------------------------------------
	//= 初期化
	//----------------------------------------------------------------------------------------------
	static Init()
	{
		
	}

	//----------------------------------------------------------------------------------------------
	//= システムメッセージを出力
	//----------------------------------------------------------------------------------------------
	static SystemMessage(Message)
	{
		this.PutComment('./img/icon.png', 'System', Message);
	}

	//----------------------------------------------------------------------------------------------
	//= ログにコメントを出力
	//----------------------------------------------------------------------------------------------
	static PutComment(IconURL, UserName, Comment)
	{
		const ImgTag = '<img src="'+IconURL+'">';

		// 現在時刻を取得
		var date = new Date();
		var Hou = ('0' + date.getHours()).slice(-2);
		var Min = ('0' + date.getMinutes()).slice(-2);
		var Sec = ('0' + date.getSeconds()).slice(-2);
		var Time = Hou+":"+Min+":"+Sec;

		var Data =
		[
			'<div class="Row">',
			'	<div class="Icon"><span>'+ImgTag+'</span></div>',
			'	<div class="UserName"><span title="'+Common.EscapeHtml(UserName)+'">'+Common.EscapeHtml(UserName)+'</span></div>',
			'	<div class="Time"><span>'+Common.EscapeHtml(Time)+'</span></div>',
			'	<div class="Comment"><span>'+Common.EscapeHtml(Comment)+'</span></div>',
			'</div>'
		].join("");

		// スクロールバーが一番下にあるか
		var ScrollBarIsBottom = false;
		var ViewCommentArea = $('#ViewCommentArea');
		if( ViewCommentArea.scrollTop()+ViewCommentArea.outerHeight() == ViewCommentArea.get(0).scrollHeight )
		{
			ScrollBarIsBottom = true;
		}

		$('#CommentOutputPosition').before(Data);

		// コメント出力前にスクロールバーが一番下にあった場合はスクロールバーを一番下に再調整
		if( ScrollBarIsBottom )
		{
			ViewCommentArea.scrollTop(ViewCommentArea.get(0).scrollHeight);
		}
	}

	//----------------------------------------------------------------------------------------------
	//= ユーザーアイコンの表示/非表示を切り替え
	//----------------------------------------------------------------------------------------------
	/*
	static SetShowUserIcon(ShowFlag)
	{
		if( ShowFlag )
		{
			$('.Row .Icon').each(function(index, element)
			{
				$(element).css('display', 'flex');
			});
		}
		else
		{
			$('.Row .Icon').each(function(index, element)
			{
				$(element).css('display', 'none');
			});
		}
	}
	//*/

}