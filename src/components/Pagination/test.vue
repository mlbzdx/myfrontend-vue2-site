<template>
    <div>
        <h1>App组件</h1>
        <Pager :total="302" :current="current" @handlePaginationClick="handlePaginationClick($event)"></Pager>
    </div>
</template>

<script>
import Pager from "./index.vue";
export default {
    components: {
        Pager,
    },
    data() {
        return {
            current: 1,
            total: 302,
        };
    },
    methods: {
        handlePaginationClick(newPage) {
            this.current = newPage;
            console.log("加载当前页数据");
        },
    },
};
</script>

<style scoped></style>
