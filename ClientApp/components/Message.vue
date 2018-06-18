<template>
    <div>
        <h2>{{ message.title }}</h2>
        <p>{{ message.text }}</p>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: ["message"]
});
</script>

<style lang="sass" scoped>
    div{
        h2{
            color:green;
        }
    }
</style>

