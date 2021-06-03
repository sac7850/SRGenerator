// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');

const staticResourcePath = '\\force-app\\main\\default\\staticresources\\';
const metadataFileType = '.resource-meta.xml';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "srg" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('srg.generateStaticResource', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Generating Static Resource!');

		vscode.window.showInputBox({
			placeholder: 'Example: My Static Resource', // Placeholder
			prompt: 'Enter Static Resource name', // An indication of what to do
			value: '' // A value by default. In this case leave it empty
		  }).then(value => {
			// Use your parser here

			//createFolder(value);
			generateStaticResource(value);
		  });
	});

	context.subscriptions.push(disposable);
}

function generateStaticResource(value) {
	// Create the Static Resource folder
	createFolder(staticResourcePath, value);
	// Create the metadata file
	let filePath = createFile(staticResourcePath, value);

	let metadataText = '<?xml version="1.0" encoding="UTF-8"?>\n';
	metadataText += '<StaticResource xmlns="http://soap.sforce.com/2006/04/metadata">\n';
	metadataText += '\t<cacheControl>Public</cacheControl>\n';
	metadataText += '\t<contentType>application/zip</contentType>\n';
	metadataText += '\t<description></description>\n';
	metadataText += '</StaticResource>';

	// Write the metadata to the file
	writeFile(filePath, metadataText);
}

function createFolder(uriPath, value) {

	let root = vscode.Uri;	

	const folder = path.join(vscode.workspace.rootPath, uriPath + value);
	const folderRoot = root.file(folder);

	vscode.workspace.fs.createDirectory(folderRoot);
}

function createFile(uriPath, value) {
	const wsedit = new vscode.WorkspaceEdit();
	const filePath = vscode.Uri.file(vscode.workspace.rootPath + uriPath + value + metadataFileType);
	
	wsedit.createFile(filePath, { ignoreIfExists: true });
	vscode.workspace.applyEdit(wsedit);
	vscode.window.showInformationMessage('Created a new file: ' + value + metadataFileType);

	return filePath;
}

function writeFile(uriPath, textData) {

	const writeData = Buffer.from(textData, 'utf8');
	vscode.workspace.fs.writeFile(uriPath, writeData);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
