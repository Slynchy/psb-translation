const fs = require('fs');

const TEXTS_PROPS = {
	NAME1: 0,
	NAME2: 1,
	TEXT: 2,
	UNK1: 3,
	UNK2: 4,
	UNK3: 5
};

function main(){
	if(process.argv.length < 4) {
		console.log(`
			PSBTranslator v1.0.0
			Usage: 
				psbtranslator decompile [psb json filename]
				psbtranslator recompile [psb txt filename]
		`);
		return;
	}

	const filename = process.argv[3];
	if(process.argv[2] === 'decompile') {
		decompile(filename);
	} else if(process.argv[3] === 'recompile') {
		recompile(filename);
	} else {
		console.log('Invalid parameters');
	}
}

function recompile(filename) {
	//
}

function decompile(filename){
	if(!fs.existsSync(filename)) {
		console.error(`
			File ${filename} cannot be found!
		`);
		return;
	}

	const file = fs.readFileSync(filename, 'utf8');

	let fileJson = createTemplateJson();
	try {
		fileJson = JSON.parse(file);
	} catch(err) {
		console.error(`
			File ${filename} is not valid json!
		`);
		return;
	}

	const result = [];
	let resultStr = '';

	for(let s = 0; s < fileJson.scenes.length; s++) {
		const currScn = fileJson.scenes[s];

		for(let t = 0; t < currScn.texts.length; t++) {
			const currTxt = currScn.texts[t];
			const currLine = {name: '', text: ''};
			const name1 = currTxt[TEXTS_PROPS.NAME1];
			const name2 = currTxt[TEXTS_PROPS.NAME2];
			if(name2 !== null) {
				currLine.name = name2;
			} else {
				currLine.name = name1;
			}
			currLine.text = currTxt[TEXTS_PROPS.TEXT];
			result.push(currLine);
		}
	}

	for(let i = 0; i < result.length; i++){
		resultStr += `${result[i].name}: ${result[i].text}\n\n`;
	}

	try {
		fs.writeFileSync(filename, resultStr, 'utf8');
	} catch(err) {
		console.error('Failed to write file because ' + err);
		return;
	}

	console.log('Success!');
}

function createTemplateJson(){
	return {
		hash: '',
		name: '',
		outlines: [],
		scenes: []
	};
}

function createTemplateScene(){
	return {
		firstLine: 0,
		label: '',
		lines: [],
		nexts: [],
		spCount: 0,
		texts: [],
		title: ''
	};
}

main();