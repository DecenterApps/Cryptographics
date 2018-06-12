const functions = require('../scripts/functions');
const utils = require('../scripts/utils');

let randomSeed = 123123;
let iterations = 5;
let potentialAssets = [1,2,3,4,5,6,7,8,9,10,11];
potentialAssets = utils.encode(potentialAssets);



function merge_objects(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}
async function getNumberOfAss() {
    let assets = await functions.getNumberOfAssets();
    return assets;
}
async function loadDataForAssets(){
    let assets = await getNumberOfAss();
    let allDataAboutAsset = [];
    for(let i=0; i<assets.c[0]; i++){
        let stats = await functions.getAssetStats(i);
        let final = merge_objects(stats);
        allDataAboutAsset.push(final);
    }
    return allDataAboutAsset;
}


async function getData(randomSeed, iterations, potentialAssets, allAssets) {
    console.log(randomSeed)
    let assets = functions.getImage(randomSeed, iterations, potentialAssets);
    var allDataAboutAsset = [];
    for(let i=0; i<assets.length; i++){
        let stats = allAssets[assets[i]];
        let final = merge_objects(assets[i], stats);
        allDataAboutAsset.push(final);
    }
    return allDataAboutAsset;

}

function makeImage(objs, c) {
    let context = c.getContext('2d');
    context.clearRect(0, 0, 1000, 1000);
    context.strokeRect(0, 0, 1000, 1000);
    let images = [];
    for(let i=0; i<objs.length; i++) {
        let image = new Image();
        let val = objs[i].id;
        if(val < 10) {
            val = "0" + val;
        }
        image.src = '../dist/assets/' + val + '.png';

        images.push(image);
    }

    for(let j=0; j<objs.length; j++) {
        images[j].onload = function () {
            let x = objs[j].x_coordinate %1000;
            let y = objs[j].y_coordinate %1000;
            let rotation = objs[j].rotation;

            drawImageRot(context,images[j],x,y,250,250,rotation);
        }
    }

}
function drawImageRot(context, img,x,y,width,height,deg) {
    //Convert degrees to radian
    var rad = deg * Math.PI / 180;


    //Set the origin to the center of the image
    context.translate(x, y);

    //Rotate the canvas around the origin
    context.rotate(rad);

    //draw the image
    context.drawImage(img, width / 2 * (-1), height / 2 * (-1), width, height);

    //reset the canvas
    context.rotate(rad * ( -1 ) );

    //
    context.translate((x) * (-1), (y) * (-1));
}

async function test() {
    let x = await loadDataForAssets();
    console.log(x);
}

test();

module.exports ={
    getData, drawImageRot, loadDataForAssets, makeImage
}