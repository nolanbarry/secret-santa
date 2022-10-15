<script setup lang="ts">
</script>
    
<template>
    <div class="choose-button-div">
        <router-link to="/userView" class="choose-button">
            Exchange Name: Person Name
        </router-link>

        <router-link to="/userView" class="choose-button">
            Exhchange Name: Person Name
        </router-link>

        <router-link to="/userView" class="choose-button">
            Exchange Name: Person Name
        </router-link>
    </div>
</template>

<style>
  .choose-button-div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .choose-button {
    margin-top: 2rem;
    display: flex;

    border: none;
    background-color: #D9D9D9;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    /* border-radius: 40px; */
    width: 20em;
    padding:1em;

    text-decoration: none;
    color: black;
    font-family: 'Inter' sans-serif;
    font-size: 1rem;
    justify-content: center;

    cursor: pointer;
  }


</style>