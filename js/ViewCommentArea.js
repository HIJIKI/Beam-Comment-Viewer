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
		this.PutComment('./img/icon.png', 'System', Message, false);
	}

	//----------------------------------------------------------------------------------------------
	//= ログにコメントを出力
	//----------------------------------------------------------------------------------------------
	static PutComment(IconURL, UserName, Comment, IsWhisper)
	{
		console.log(UserName+": "+Comment);

		var ImgTag = '<img src="'+IconURL+'">';

		// 現在時刻を取得
		var date = new Date();
		var Hou = ('0' + date.getHours()).slice(-2);
		var Min = ('0' + date.getMinutes()).slice(-2);
		var Sec = ('0' + date.getSeconds()).slice(-2);
		var Time = Hou+":"+Min+":"+Sec;

		// Whisper の場合は .Whisper クラスを付与する
		var FirstLine = '';
		if( IsWhisper )
		{
			FirstLine = '<div class="Row Whisper">';
		}
		else
		{
			FirstLine = '<div class="Row">';
		}

		var Data =
		[
			FirstLine,
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
		
		// コメント内の URL をリンクに置き換える
		var Target = $('#CommentOutputPosition').prev().find('.Comment span');
		$(Target).html( $(Target).html().replace(/((?:https?|ftp):\/\/[^\s　]+)/g, '<span class="Link" onclick="Common.OpenLink(\'$1\');">$1</span>') );

		// コメントが指定件数を超えた場合は古い物から削除
		this.RemoveExceedComment();

		// コメント出力前にスクロールバーが一番下にあった場合はスクロールバーを一番下に再調整
		if( ScrollBarIsBottom )
		{
			ViewCommentArea.scrollTop(ViewCommentArea.get(0).scrollHeight);
		}
	}

	//----------------------------------------------------------------------------------------------
	//= 指定件数を超えたコメントを古いものから削除する
	//----------------------------------------------------------------------------------------------
	static RemoveExceedComment()
	{
		var Max = Setting.MaxDisplayComment;
		if( Max > 0 )
		{
			while( $('#ViewCommentArea #Body .Row').length > Max )
			{
				$('#ViewCommentArea #Body .Row:first-child').remove();
			}
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