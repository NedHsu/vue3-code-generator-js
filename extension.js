// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { copyFileSync, readdirSync, readdir, statSync, copyFile, existsSync, mkdirSync } = require('fs');
const vscode = require('vscode');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vue3-code-generator-js" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vue3-code-generator-js.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from vue3-code-generator-js!');
	});

	let newModule = initNewModule(context);

	let test = vscode.commands.registerCommand('vue3-code-generator-js.test', function () {
		console.log(context.globalStorageUri);
		console.log(context.storageUri);
		console.log(context.extensionUri);
		console.log(context.workspaceState.keys());
		console.log(vscode.workspace.workspaceFolders);
		console.log(context.extension.extensionUri.fsPath);
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(newModule);
	context.subscriptions.push(test);
}

function initNewModule(context) {
	return vscode.commands.registerCommand('vue3-code-generator-js.newModule', function () {

		let config = {
			templateName: '',
			destName: '',
			destPath: '',
		};
		let {
			templateName, destName, destPath,
		} = config;

		let quickPick = vscode.window.createQuickPick();
		quickPick.items = [{
			label: 'module',
			description: 'description',
			detail: 'detail'
		}];

		let destPathInput = vscode.window.createInputBox();
		destPathInput.placeholder = 'dest path';

		let destNameInput = vscode.window.createInputBox();
		destPathInput.placeholder = 'name';

		// process
		quickPick.show();
		quickPick.onDidChangeSelection((e) => {
			templateName = e[0].label;
			console.log(templateName);
			destNameInput.show();
			quickPick.hide();
		});

		destNameInput.onDidAccept(() => {
			destName = destNameInput.value;
			console.log(destName);
			// check name
			destPathInput.show();
		});

		destPathInput.onDidAccept(() => {
			destPath = destPathInput.value;
			let copyFrom = `${context.extension.extensionUri.fsPath}\\templates\\${templateName}`;
			console.log(copyFrom);
			if (vscode.workspace.workspaceFolders.length == 0) {
				vscode.window.showErrorMessage('Workspace Folder is not found!');
				return;
			}
			console.log(walkDir(copyFrom));
			let files = readdirSync(copyFrom);
			console.log(files);
			let destDir = `${vscode.workspace.workspaceFolders[0].uri.fsPath}${destPath ? `\\${destPath}` : ''}`;
			if (!existsSync(destDir)) {
				mkdirSync(destDir);
			}
			copyFile(`${copyFrom}\\file`, `${destDir}\\file`, (info) => {
				console.log(info);
			});
			destPathInput.hide();
		});
	});
}

// this method is called when your extension is deactivated
function deactivate() { }

// recursive directory search
function walkDir(root) {
	const stat = statSync(root);

	if (stat.isDirectory()) {
		const dirs = readdirSync(root).filter(item => !item.startsWith('.'));
		let results = dirs.map(sub => walkDir(`${root}/${sub}`));
		// empty dir
		if (results.length == 0) {
			results.push(root);
		}
		return [].concat(...results);
	} else {
		console.log(root);
		return root;
	}
}

module.exports = {
	activate,
	deactivate
}
