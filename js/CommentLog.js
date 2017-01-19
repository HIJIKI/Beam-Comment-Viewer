//--------------------------------------------------------------------------------------------------
//= ログにコメントを送信
//--------------------------------------------------------------------------------------------------
function PutComment(IconURL, UserName, Comment)
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
		'	<div class="UserName"><span>'+UserName+'</span></div>',
		'	<div class="Time"><span>'+Time+'</span></div>',
		'	<div class="Comment"><span>'+Comment+'</span></div>',
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