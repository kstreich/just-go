<template>
  <div class="albumForm form-group">
    <form @submit.prevent="addAlbum">
      <!-- <label for="">Create Album</label> -->
      <input class="form-control" type="text" placeholder="Album Name" v-model="newAlbum.title">
      <button class="btn btn-sm mt-1 btn-danger" type="submit">Create</button>
    </form>
  </div>
</template>


<script>
  export default {
    name: 'AlbumForm',
    data() {
      return {
        newAlbum: {
          title: ''
        }
      }
    },
    computed: {
      user() {
        return this.$store.state.user
      }
    },
    methods: {
      addAlbum() {
        this.newAlbum.authorName = this.user.name
        // this.newAlbum.image = "http://cdn.onlinewebfonts.com/svg/img_304578.png"
        this.$store.dispatch('addAlbum', this.newAlbum)
        event.target.reset()
      }
    }
  }

</script>

<style>


</style>