<template>
    <img class="avatar" :src="src" :style="{
        width: size + 'px',
        height: size + 'px'
    }">
</template>

<script>

export default {
    props: {
        src: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            default: 50
        }
    }
}
</script>

<style scoped>
.avatar {
    border-radius: 50%;
}
</style>