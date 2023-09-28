import {memo, ReactElement} from 'react';
import cls from './MainLayout.module.scss';
import {classNames} from "../../lib/classNames/classNames";
import {ChatM} from "../../../widgets/Chat/ui/Chat";

interface MainLayoutProps {
    className?: string;
    header?: ReactElement;
    content: ReactElement;
    footer?: ReactElement;
}

export const MainLayout = memo((props: MainLayoutProps) => {
    const {className, content, header, footer} = props;

    return (
        <div className={classNames(cls.MainLayout, {}, [className])}>
            <div className={cls.header}>{header}</div>
            <div className={cls.content}>
                <div className={cls.left_side}>
                    <ChatM/>
                </div>
                <div className={cls.right_side}>
                    {content}
                </div>
            </div>
            <div className={cls.footer}>{footer}</div>
            {/*<div className={cls.rightbar}>*/}
            {/*    <div className={cls.header}>{header}</div>*/}
            {/*    <div className={cls.toolbar}>{toolbar}</div>*/}
            {/*</div>*/}
        </div>
    );
});
