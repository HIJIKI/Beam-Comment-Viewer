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
		// 絵文字置換に使用する manifest.json を取得する
		const https = require('https');
		const ManifestUrl = 'https://beam.pro/_latest/emoticons/manifest.json';
		this.BeamEmoticons = undefined;
		https.get(ManifestUrl, function(responce) {
			var Body = '';
			responce.setEncoding('utf8');
			responce.on('data', function(chunk) {
				Body += chunk;
			});
			responce.on('end', function() {
				ViewCommentArea.BeamEmoticons = JSON.parse(Body);
				console.log('Successful Get Emoticons manifest.json');
				console.log(ViewCommentArea.BeamEmoticons);
			});
		}).on('error', function(e) {
			console.log('Failed to Emoticons manifest.json: '+e.message);
		});
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
			'	<div class="UserName"><span title="'+UserName+'">'+UserName+'</span></div>',
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
	//= 表示用にコメントを整形
	//----------------------------------------------------------------------------------------------
	/*
	 *	@Data: BeamSocket の ChatMessage イベントで受け取ったコメントデータ
	 */
	static Format(Data)
	{
		var Ret = {
			IconURL: undefined,
			UserName: undefined,
			Comment: undefined,
			IsWhisper: undefined
		}

		Ret.IconURL = Common.GetAvatarURL(Data.user_id);
		Ret.UserName = Common.EscapeHtml(Data.user_name);
		Ret.IsWhisper = Data.message.meta.whisper;

		// メッセージを整形
		var FormatMessage = '';
		for( var id in Data.message.message )
		{
			var mes = Data.message.message[id];
			// 絵文字の場合
			if( mes.type == 'emoticon' )
			{
				FormatMessage += ViewCommentArea.GetEmoticonTag(mes.text);
			}
			// リンクの場合
			else if( mes.type == 'link' )
			{
				FormatMessage += ViewCommentArea.GetLinkTag(mes.text);
			}
			// それ以外の場合
			else
			{
				FormatMessage += Common.EscapeHtml(mes.text);
			}
		}

		Ret.Comment = FormatMessage;

		return Ret;
	}

	//----------------------------------------------------------------------------------------------
	//= 指定した URL へのリンクタグを取得
	//----------------------------------------------------------------------------------------------
	static GetLinkTag(URL)
	{
		var Ret = '<span class="Link" onclick="Common.OpenLink(\''+URL+'\');">'+Common.EscapeHtml(URL)+'</span>';
		return Ret;
	}

	//----------------------------------------------------------------------------------------------
	//=  指定した Emote に対応する絵文字タグを取得
	//----------------------------------------------------------------------------------------------
	static GetEmoticonTag(_Emoticon)
	{
		var Ret = _Emoticon;

		var EmoticonData = {
			Category: '',														// カテゴリ
			X: 0,																// X 座標
			Y: 0,																// Y 座標
			W: 0,																// 横幅
			H: 0,																// 高さ
			Alt: ''																// 説明文
		};

		var Found = false;

		// 対応する絵文字を manifest.json から探す
		for( var Category in this.BeamEmoticons )
		{
			var Contents = this.BeamEmoticons[Category];
			for( var Emoticon in Contents.emoticons )
			{
				// 該当する絵文字が見つかった場合
				if( _Emoticon == Emoticon )
				{
					var Data = Contents.emoticons[Emoticon];
					EmoticonData.Category = Category;
					EmoticonData.X = Data.x;
					EmoticonData.Y = Data.y;
					EmoticonData.W = Data.width;
					EmoticonData.H = Data.height;
					EmoticonData.Alt = Data.alt.en;
					Found = true;
					break;
				}
			}

			// 対応する絵文字が見つかった場合はループを抜ける
			if( Found )
			{
				break;
			}
		}

		// 対応する絵文字が見つかった場合、絵文字タグを生成する
		if( Found )
		{
			var ImageURL = 'https://beam.pro/_latest/emoticons/'+EmoticonData.Category+'.png'

			var Tag =
			[
				'<div class="Emoticon" style="width: '+EmoticonData.W+'px; height: '+EmoticonData.H+'px;">',
				'<img src="'+ImageURL+'" style="transform: translate(-'+EmoticonData.X+'px, -'+EmoticonData.Y+'px);" alt="'+EmoticonData.Alt+'" />',
				'</div>',
			].join("");

			Ret = Tag;
		}

		return Ret;
	}

}