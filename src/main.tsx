import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import './app/styles/index.scss'
import './shared/config/i18n/i18n'
import {BrowserRouter} from "react-router-dom";
// import {StoreProvider} from "./app/providers/StoreProvider";
import {Provider} from "react-redux";
import {store} from "./app/providers/StoreProvider/config/store";
import {ToastContainer} from "react-toastify";
import "react-toastify/ReactToastify.min.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <ToastContainer position="top-right" newestOnTop />
                <App/>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>,
)
