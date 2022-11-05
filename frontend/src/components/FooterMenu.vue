<script setup lang="ts">
</script>
    
<template>
    <div class="footer-div">
      <div class="footer-row">
        <div class="col">
          <router-link to="/" class="footer-button">
              Sign Out
          </router-link>
        </div>
        <div class="col">
          <router-link to="/chooseExchange" class="footer-button">
              View Exchanges
          </router-link>
        </div>
      </div>
    </div>
</template>

<style>
  .footer-div {
    background-color: #A74141;;
    position:fixed;
    width:100%;
    height:50px;
    bottom:0;
    left:0;
    justify-content: center;
  }

  .footer-button {
    /* margin-top: 2rem; */
    display: block;

    /* border: none; */
    /* border-radius: 40px; */

    text-decoration: none;
    color: black;
    font-family: 'Inter' sans-serif;
    font-size: 1rem;
    justify-content: center;
    text-align: center;
    /* padding: 14px 16px; */

    cursor: pointer;
  }

  .col {
      display: inline-block;
      padding: 0.6rem 2rem;
      vertical-align: middle;
      justify-content: center;
  }

  .footer-row {
      display: flex;
      /* padding-left: 37.1rem;
      padding-right: 37rem; */
      vertical-align: middle;
      justify-content: center;
  } 

</style>