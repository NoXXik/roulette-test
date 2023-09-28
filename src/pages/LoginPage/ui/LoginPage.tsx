// import { useState } from 'react';
import {Flex} from "../../../shared/ui/Stack/Flex/Flex";
// import {Input} from "../../../shared/ui/Input";
// import {useState} from "react";
import {LoginForm} from "../../../entities/User/ui/LoginForm";
// import { Page } from '@/widgets/Page';

const LoginPage = () => {
    // const [value, setValue] = useState('');
    //
    // const onChange = (val: string) => {
    //     setValue(val);
    // };

    // const [login, setLogin] = useState('')

    return (
        <main>
            <Flex direction={'column'} align={'center'}>
                <LoginForm />
            </Flex>
        </main>
    );
};

export default LoginPage;
