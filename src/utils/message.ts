import { sendMessage } from './push';

const notify = async ({
    title,
    body,
    data
} : {
    title? : string,
    body? : string,
    data? : string
})=>{
    const tokens = ['ExponentPushToken[IDkakXEPDXCy-NU-SmBs13]', 'ExponentPushToken[_ednsVAJQk7JnpfF3wTlxC]', 'ExponentPushToken[JD5Zz-MxGFOz32gTQ9d8BS]']
    for(let token of tokens){
        const {response, error} = await sendMessage([
            {
                to: token,
                sound: 'default',
                title : title,
                body: body,
                data: data
            }
        ])
        console.log({response})
    }
}

export default notify