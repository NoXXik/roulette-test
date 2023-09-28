// import {useState} from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import {useTranslation} from "react-i18next";
// import {LangSwitcher} from "../features/LangSwitcher";
import {AppRouter} from "./providers/router";
import {Suspense, useEffect} from "react";
import {classNames} from "../shared/lib/classNames/classNames";
import {MainLayout} from "../shared/layouts/MainLayout";
import {Navbar} from "../widgets/Navbar/ui/Navbar";
import {useLazyAuthorizationQuery} from "../entities/User/api/userApi";
import {useLocation} from "react-router-dom";
import {Metrica} from "../features/Metrica";
// import {useParams} from "react-router-dom";
// import {setAccessToken, setUser} from "../entities/User/model/slices/userSlice";
// import {useDispatch} from "react-redux";

function App() {
    const [authorize] = useLazyAuthorizationQuery()

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    // Получение значения параметра по его имен
    const refCode = queryParams.get('ref');
    useEffect(() => {
        console.log(queryParams)
        if(refCode) {
            console.log('ref', refCode)
            const expirationDate = new Date(); // Установите срок действия cookie
            expirationDate.setDate(expirationDate.getDate() + 30); // Например, 30 дней
            document.cookie = `ref=${refCode}; expires=${expirationDate.toUTCString()}; path=/`;
        }
        authorize(null)
    }, [])
    return (
        <>
            <div
                id="app"
                className={classNames('app_redesigned', {}, ['app_dark_theme'])}
            >
                <Suspense fallback="">
                    <MainLayout
                        header={<Navbar />}
                        content={<AppRouter />}
                        // sidebar={<Sidebar />}
                        // toolbar={toolbar}
                    />
                </Suspense>
            </div>
            {/*<Metrica />*/}
        </>
    )
}

export default App
