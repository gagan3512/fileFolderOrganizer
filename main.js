//how to take input
let inputArr = process.argv.slice(2);
//In terminal type node main.js hello world  -- O/P ['Hello' , 'World']
//console.log(inputArr);
const { dir } = require("console");
let fs = require("fs");
let path = require("path");
let destPath; 
//console.log(inputArr);
// node main.js tree "directoryPath"
// node main.js organize "directoryPath"
// node main.js help

let command = inputArr[0];
let types = {
    media: ["mp4", "mkv"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['pptx','docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"]
}
switch(command){
    case "tree":
        treeFn(inputArr[1]);
        break;
    case "organize":
        organizedFn(inputArr[1]);
        break;
    case "help":
        helpFn();
        break;
    default :
        console.log("Please 🙏 Input right command");
        break;

}

function treeFn(dirPath){

    if(dirPath == undefined){
        console.log("Kindly enter the path");
        return;
    }else{
        let doesExist = fs.existsSync(dirPath);
        if(doesExist){
            treeHelper(dirPath, "");
        }else{
            console.log("Kindly enter the correct path");
            return;
        }
}
}
function treeHelper(dirPath, indent){
    //is file or folder
    let isFile = fs.lstatSync(dirPath).isFile();
    if(isFile == true){
        let fileName = path.basename(dirPath);
        console.log(indent + "****** " + fileName);
    }else{
        let dirName = path.basename(dirPath);
        console.log(indent + "|*****" + dirName);
        let childrens = fs.readdirSync(dirPath);
        for(let i=0;i<childrens.length;i++){
            let childPath = path.join(dirPath, childrens[i]);
            treeHelper(childPath, indent+ "\t");
        }

    }

}




function organizedFn(dirPath){
    //console.log("Tree command implemented for ",dirPath);
    // 1. input -> directory path given
    if(dirPath == undefined){
        console.log("Kindly enter the path");
        return;
    }else{
        let doesExist = fs.existsSync(dirPath);
        if(doesExist){
            // 2. create -> organized_files -> directory
            destPath  = path.join(dirPath,"organized_files");
            if(fs.existsSync(destPath) == false){ 
            fs.mkdirSync(destPath);
            }

        }else{
            console.log("Kindly enter the correct path");
            return;
        }
    }

    organizeHelper(dirPath,destPath);


}

function organizeHelper(src,dest){
    // 3. Identify categories of all the files present in that input directory ->
     
    let childNames = fs.readdirSync(src);
    //console.log(childNames);
    for(let i=0;i<childNames.length;i++){
        let childAddress = path.join(src,childNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if(isFile){
            //console.log(childNames[i]);
            let category = getCategory(childNames[i]);
            console.log(childNames[i],"belong to ----> ", category);

            //4. copy / cut files to that organied program.
            sendFile(childAddress,dest,category);





        }

    }
   


}
function sendFile(srcFilePath,dest,category){
    let categoryPath = path.join(dest,category);
    if(fs.existsSync(categoryPath) == false){
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath,fileName);
    fs.copyFileSync(srcFilePath,destFilePath);
    fs.unlinkSync(srcFilePath);
    console.log(fileName , "copied to ", category);

}

function getCategory(name){
    let ext = path.extname(name);
    ext = ext.slice(1);
    for(let type in types){
        let cTypeArray = types[type];
        for(let i = 0;i<cTypeArray.length;i++){
            if(ext == cTypeArray[i]){
                return type;
            }
        }
    }
    return 'others';

}


//help function
function helpFn(dirPath){
    console.log(`List of All commands :  
    node main.js tree "directoryPath" 
    node main.js organize "directoryPath" 
    node main.js help`);
}








