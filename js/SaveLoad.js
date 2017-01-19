/*
function SaveJson(JsonPath)
{
	const fs = require('fs-extra');
	const AppData = process.env.APPDATA;
	const JsonDir = AppData + "/BeamCommentViewer";
	const JsonName = "Settings.json";
	
	var Input = document.getElementById('UserInput');

	var Data = {
		"Data": Input.value
	};
	fs.mkdirsSync(JsonDir);
	fs.writeFile(JsonDir + "/" + JsonName, JSON.stringify(Data, null, '	'));

	console.log("Saved");
}
//*/

function LoadJson(JsonPath)
{
	const fs = require('fs-extra');
	var Data = JSON.parse(fs.readFileSync(JsonPath, 'utf8'));
	console.log("Loaded: "+Data);
	return Data;
}