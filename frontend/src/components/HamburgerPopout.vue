<template>
  <div class="menu">
    <div class="menu-bar">
      <div class="hamburger" ref="hamburger">
        <font-awesome-icon icon="fa-solid fa-bars" />
      </div>
    </div>
    <div class="flyout-container">
      <div :class="['flyout-menu', { 'open': open }]" ref="flyout"
        :style="`transform: translateX(-${!open ? flyout?.clientWidth ?? 10000 : 0}px)`">
        <div class="menu-title">Menu</div>
        <router-link to="/join-exchange">Join Exchange</router-link>
        <router-link to="/create-exchange">Create Exchange</router-link>
        <div @click="signOut">Sign Out</div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router';
const open = ref(false)
/* https://vuejs.org/guide/typescript/composition-api.html#typing-template-refs */
const hamburger = ref<HTMLInputElement | null>()
const flyout = ref<HTMLInputElement | null>()

const clickListener = (event: MouseEvent) => {
  const clickTarget = event.target as HTMLInputElement
  const clickedInMenu = flyout.value!.contains(clickTarget)
  const clickedOnHamburgerIcon = hamburger.value!.contains(clickTarget)
  if (clickedOnHamburgerIcon) {
    open.value = !open.value
  } else {
    open.value = false
  }
}

onMounted(() => {
  // register click handler on document so that clicks outside of the menu
  // will be registered
  document.addEventListener('click', clickListener)
})

onUnmounted(() => {
  document.removeEventListener('click', clickListener)
})

function signOut() {
  open.value = false;
  // TODO
}
</script>

<style lang="scss">
$menu-height: 50px;
$mobile-threshold: 800px;

.menu {
  // cancel out default #app padding
  margin: -2rem 0 0 0;
  width: 100vw;
  padding: 0;

  // anchors to top left of page by anchoring to center of parent div
  // which is also centered, than translate -50% of the page width;
  position: relative;
  left: 50%;
  transform: translateX(-50vw);
  display: flex;
  flex-flow: column;
  background: transparent;
  margin-bottom: 15px;
}

.menu-bar {
  padding: 20px;
  position: fixed;

  // put in the top left corner for desktop screens
  @media screen and (min-width: ($mobile-threshold + 1)) {
    top: 0;
    left: 0;
    color: #A74141;
  }

  // create a bar with the menu icon smaller screens, because 
  // otherwise the icon would overlap with the content
  @media screen and (max-width: $mobile-threshold) {
    min-width: 100vw;
    display: flex;
    height: $menu-height;
    background: $primary-color;
    color: white;
    align-items: center;
    position: sticky;
    top: 0;
    // cancel out padding of root #app element
    z-index: 1;
    box-shadow: 0 2px 2px #00000033;
  }

  .hamburger {
    font-size: 24px;
    cursor: pointer;
  }
}

.flyout-container {
  display: relative;
  z-index: 0; // put behind menu bar, which has z-index 1

  .flyout-menu {
    background: $primary-color;
    z-index: 2;
    transition: transform 200ms;
    position: fixed;
    padding: 0;
    flex: 1;
    color: white;
    display: flex;
    flex-flow: column;
    align-items: stretch;
    box-shadow: 2px 0 2px #00000033;

    height: 100vh;

    >* {
      padding: 10px 40px;
      box-shadow: 0 2px 2px #00000033;
      text-decoration: none;
      text-align: center;
      color: white;
      transition: background 200ms;
      background: transparent;
      cursor: pointer;

      &:hover:not(.menu-title) {
        background: #ffffff22;
      }

      &.menu-title {
        font-family: 'Coiny';
        font-style: normal;
        font-weight: 400;
        padding: 15px 40px;
        font-size: 24px;
        // hide on small screens because the menu bar servers
        // the same purpose of this element
        @media screen and (max-width: $mobile-threshold) {
          display: none;
        }
      }
    }
  }
}
</style>