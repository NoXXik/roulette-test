import {useSelector} from "react-redux";
import {getCurrentUser} from "../../entities/User/model/selectors/userSelectors";
import {memo} from "react";

export const Metrica = memo(() => {
    const uuid = crypto.randomUUID()
    const user = useSelector(getCurrentUser)

    console.log('update metrica', uuid, user?.id)
    if(user) {
        // const row = {__html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        //     m[i].l=1*new Date();
        //     for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        //     k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        //     (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        //
        //     ym(95071328, "init", {
        //     defer: true,
        //     clickmap:true,
        //     trackLinks:true,
        //     accurateTrackBounce:true,
        //     webvisor:true,
        //     params: {webvisor_id: ${uuid}, user_id: ${user.id}}
        //     })`}
        return (
            // @ts-ignore
            <>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
      
                ym(92227037, "init", {
                     defer: true,
                     clickmap:true,
                     trackLinks:true,
                     accurateTrackBounce:true,
                     webvisor:true,
                     params: {webvisor_id: ${uuid}, user_id: ${user.id}}
                });
              `,
                    }}
                />
                <noscript>
                    <div>
                        <img src="https://mc.yandex.ru/watch/92227037" style={{position: 'absolute', left: '-9999px'}}
                             alt=""/>
                    </div>
                </noscript>
            </>


        )
    }
    return (
        <></>
    )
})
