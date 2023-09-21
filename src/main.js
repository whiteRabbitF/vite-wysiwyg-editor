import { createApp } from "vue";
import App from './App.vue';
import { createVuestic } from "vuestic-ui";
import "vuestic-ui/css";
import '/src/style.scss'
import 'normalize.css';


 createApp(App).use(createVuestic()).mount("#app");

