<template>
    <div>
        <h1>Upload asset pack</h1>
        <div>
            <input type="text" placeholder="Asset pack name"/>
            <input type="text" placeholder="Value"/>
            <input id="files" type="file" multiple size="50">
        </div>
        <div>
            <button> Browse </button>
        </div>
        <div>
            <button @click="loadAssets"> Upload </button>
        </div>
        <div>
            <p id="uploaded"></p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "upload-asset-packs",
        data: () => ({
            uploaded_files: []
        }),

        methods: {
            async loadAssets() {
                let x = document.getElementById("files");
                let txt = "";
                if('files' in x) {
                    console.log(x.files);
                    if(x.files.length == 0){
                        txt = "Select one or more assets to upload";
                    } else {
                        for (var i = 0; i < x.files.length; i++) {
                            txt += "<br><strong>" + (i+1) + ". file</strong><br>";
                            var file = x.files[i];
                            if ('name' in file) {
                                txt += "name: " + file.name + "<br>";
                            }
                            if ('size' in file) {
                                txt += "size: " + file.size + " bytes <br>";
                            }
                        }
                    }
                }
                document.getElementById("uploaded").innerHTML = txt;
            }
        }
    }
</script>

<style scoped>
    div {
        margin-top: 30px;
    }

    input {
        margin-left: 20px;
        margin-right: 20px;
    }
</style>