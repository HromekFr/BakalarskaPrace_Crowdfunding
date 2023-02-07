<template>
    <div class="createForm" v-if="!$store.state.loading">
        <h1>Enter basic information about the project</h1>
        <form @submit.prevent="$store.dispatch('createProject', {newProject})">
            <div class="form-group">
                <label for="title">Title</label>
                <input type="text" class="form-control" id="title" required v-model="newProject.title" placeholder="Enter project titile">
            </div>
            <div class="form-group">
                <label for="description">Description</label>
                <textarea type="text" class="form-control" id="description" required v-model="newProject.desc" placeholder="Enter project description"></textarea>
            </div>
            <div class="form-group">
                <p>Categories</p>
                <div class="category-list">
                    <label>
                        <input type="radio" name="category" v-model="newProject.category" value="games">
                        <img src="@/assets/console.png">
                    </label>
                    <label>
                        <input type="radio" name="category" v-model="newProject.category" value="music">
                        <img src="@/assets/musical-note.png">
                    </label>
                    <label>
                        <input type="radio" name="category" v-model="newProject.category" value="books">
                        <img src="@/assets/open-book.png">
                    </label>
                    <label>
                        <input type="radio" name="category" v-model="newProject.category" value="video">
                        <img src="@/assets/video.png">
                    </label>
                </div>
            </div>
            <div class="form-group">
                <label for="durationInDays">Duration in days</label>
                <input type="number"  step=".0001" class="form-control" id="durationInDays" required v-model="newProject.duration">
            </div>
            <div class="form-group">
                <label for="amountToRaise">Amount to raise in ETH</label>
                <input type="number" class="form-control" id="amountToRaise" required v-model="newProject.amount">
            </div>
            <div class="form-group">
                <label for="projectImage">Img of your project</label>
                <br/>
                <input type="file" accept="image/*" id="image"
                    @change="updatePhoto($event.target.files)"
                >
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
    <div v-else>
        <LoadingScreen />
    </div>
</template>

<script>
import store from "@/store"
import { Buffer } from "buffer"
import LoadingScreen from "../LoadingScreen.vue"
export default {
    data() {
        return {
            newProject: {}
        };
    },
    methods: {
        async handleSubmit() {
            await store.dispatch("createProject", { newProject });
        },
        updatePhoto(files) {
            const file = files[0];
            const reader = new window.FileReader();
            reader.readAsArrayBuffer(file);
            reader.onloadend = () => {
                const buffer = Buffer(reader.result);
                this.newProject.file = buffer;
            };
        }
    },
    components: { LoadingScreen }
}
</script>

<style>
#description {
    height: 5rem
}
#image {
    margin-bottom: 10px;
}

.createForm {
    padding-right: 5rem;
    padding-left: 5rem;
}

[type=radio] { 
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

[type=radio] + img {
  cursor: pointer;
  height: 64px;
}
[type=radio]:checked + img {
  outline: 2px solid black;
}

.category-list {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>