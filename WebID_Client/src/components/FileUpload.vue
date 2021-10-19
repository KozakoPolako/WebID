<template>
  <v-card
    fluid
    outlined
    tabindex="0"   
    :color="dragover ? 'indigo lighten-4' : 'grey lighten-3'"
    width="100%"
    :min-height="height"
    class="pa-3"
  >
    <input
        :multiple="multiple"
        type="file"               
        :accept="acceptExtension"
        style="display:none"/> 
    <v-container class=" inputBox flex-column d-flex text-center" style="min-height:inherit;" fluid>
        <v-row align="start" justify="end" dense style="height: 0" class="pa-0">
            <v-col cols="auto" class="pa-0" >
                <v-icon v-show="multiple && files.length"
                    @click.stop="clearAll"
                    @keydown.enter.stop="clearAll"
                >mdi-window-close</v-icon> 
            </v-col>
        </v-row>
        <v-row align="center" justify="center" class="flex-column pb-3">
            <v-col cols="auto" class="pa-0">
                <v-icon
                    size="50"
                >mdi-cloud-upload</v-icon>
            </v-col>
            <v-col cols="auto" class="py-0 pb-2" align-self="center">
                <h1 v-if="!message" >Wybierz lub upuść plik</h1>
                <h1 v-else>{{message}}</h1> 
            </v-col>
        </v-row>
        <v-row justify="center" v-bind:align="this.files.length >= 3 ? 'end':'start'">
            <v-col cols="12" class="px-4 pt-auto pb-0 text-center " v-if="files.length" style="word-break: break-word;" justify="center"> 
                <v-row class="my-1" :justify="this.files.length >= 3 ? 'start':'center'" >    
                    <v-col v-for="(file,i) in files" :key="i" cols="12" md="6" lg="4" class="pa-1">
                        <v-card outlined class="pa-1" color="grey lighten-1" @click.stop>
                            <v-row class="flex-no-wrap" >
                                <v-col cols="10">
                                    <h3 class="text-truncate text-start">{{file.name}}</h3> 
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="auto" justify="end" class="pr-3 pl-0">
                                    <v-icon
                                        @click.stop="multiple ? clear(file.name) : clearAll()"
                                        @keydown.enter.stop="multiple ? clear(file.name) : clearAll()"
                                    >mdi-window-close
                                    </v-icon> 
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
    name:"FileUpload",
    components: {},
    data: () => {
        return {
            dropzone: null,
            fileInput: null,
            dragover: false,
            message: "",
            files: [],
            counter: 0,
        }
    },
    props: {
        acceptExtension: {
            type: String,
            default: "",
        },
        height: {
            type: String,
            default: "200",
        },
        multiple: {
            type: Boolean,
            default: false,
        }
    },
    watch: {
        files(){
            this.$emit("input", this.files);
        },
    },
    methods: {
        prepareFileDrop() {
            if(this.dropzone){
                this.dropzone.addEventListener("dragenter", e => { 
                    e.preventDefault();
                    this.counter++;
                    this.dragover = true;
                });
                this.dropzone.addEventListener("dragleave", e => { 
                    e.preventDefault();
                    this.counter--;
                    if(this.counter <= 0) {
                        this.dragover = false;
                    }
                });
                this.dropzone.addEventListener("dragover", e => { 
                    e.preventDefault();
                    this.dragover = true;
                });
                this.dropzone.addEventListener("drop", e => { 
                    e.preventDefault();
                    this.counter = 0;
                    this.dragover = false;
                    const dragEvent = e;
                    if(dragEvent.dataTransfer) {
                        const files = dragEvent.dataTransfer.files;
                        if(!this.acceptExtension || this.fileTypeCheck(files)) {
                            if(!this.multiple) {
                                this.files.length = 0;
                                this.files.push(files[0]);
                            }else {
                                this.addUniqueFiles([...files]);     
                            }
                        }
                    }
                })
            }
        },
        prepareFileClick() {
            if (this.dropzone && this.fileInput) {
                this.fileInput.addEventListener("input", (e) => {
                    e.preventDefault();
                    const files = e.target.files;
                    if(!this.acceptExtension || this.fileTypeCheck(files)){
                        if(!this.multiple) {
                            this.files.length = 0;
                            this.files.push(files[0]);
                        }else {
                            this.addUniqueFiles([...files]); 
                        }
                    }
                });
                this.dropzone.addEventListener("click", (e) => {  
                    e.stopPropagation();
                    this.fileInput.click();
                });
                this.dropzone.addEventListener("keypress", e => {
                    e.preventDefault();
                    if(e.key === "Enter") {
                        this.fileInput.click();
                    }
                });
            }
        },
        fileTypeCheck(files) {
            this.message = "";
            const acceptFileType = this.acceptExtension.split(",").map((val) => val.trim());
            const re = new RegExp(`([a-zA-Z0-9\\s_\\\\.\\-\\(\\):])+(${acceptFileType.join('|')})$`, 'i');
            const InvalidTypeException = { };
            let test = true;
            console.log("files: ",files);
            try {
                [...files].forEach(val => {
                    if(!re.test(val.name)) {
                        InvalidTypeException["name"] = val.name;
                        throw InvalidTypeException ;
                    }
                });
            } catch (e) {
                if (e === InvalidTypeException) {
                    this.message="Nieobsługiwany format pliku: ."+e.name.split(".")[1];
                    test = false;
                }
                else throw e;
            }   
            return test;
        },
        addUniqueFiles(files) {
            const a = new Set(this.files.map(x => x.name));
            this.files = [...this.files, ...files.filter(x => !a.has(x.name))];
        },
        clear(name) {
            this.files = this.files.filter(val => val.name !== name);
            this.fileInput.value = "";
            this.$forceUpdate();
        },
        clearAll() {
            this.files = [];
            this.fileInput.value = "";
            this.$forceUpdate();
        }
    },
    mounted() {
        this.dropzone = this.$el;
        this.fileInput = this.$el.firstElementChild;
        this.prepareFileDrop();
        this.prepareFileClick();
    },
}
</script>

<style lang="scss" scoped>
.inputBox {
    border:2px dashed black;
    border-radius: 4px;
}
</style>