import { sqlite3All } from './Sqlite3Operations';
import httpClient from './httpClient';
import { isInternetAvailable } from '../utils/electronFunctions';
import { base64Decode } from '../utils/generals';

export const syncData = async(userId) => {
    const license = await sqlite3All(`SELECT * FROM activacion LIMIT 1`);
    const isReachable = await isInternetAvailable('https://google.com');
    const user = await sqlite3All(`SELECT * FROM usuario WHERE email = '${userId}' LIMIT 1`);
    if (license.OK && license.OK.length == 1 && isReachable && user.OK && user.OK.length == 1){

        //lecciones 

        const lessons = await sqlite3All(`SELECT * FROM sublecciones_vistas WHERE user_id = '${userId}'`);
        const forms = await sqlite3All(`SELECT * FROM formualrio_respuesta WHERE user_id = '${userId}`);
        const radiotest = await sqlite3All(`SELECT * FROM test_radio_respuestas WHERE user_id = '${userId}`);
        const inputntest = await sqlite3All(`SELECT * FROM test_inputn_respuestas WHERE user_id = '${userId}`);
        const vftest = await sqlite3All(`SELECT * FROM test_vf_respuestas WHERE user_id = '${userId}`);

        if (
            lessons.OK &&
            forms.OK &&
            radiotest.OK && 
            inputntest.OK &&
            vftest.OK
        ){

            const obj = {
                user: user,
                data: {
                    lessons:  lessons.OK,
                    forms: forms.OK,
                    radiotest: radiotest.OK,
                    inputntest:inputntest.OK,
                    vftest: vftest.OK
                },
                license: {
                    machineId: license.OK[0].serial_maquina,
                    licenseSerial: base64Decode(license.OK[0].serial_licencia),
                }
            }

            const response = await httpClient().post('http://educationfortheworld.com.py:7000', obj);
            if (response.error) {
                return {
                    error: "Ha ocurrido un error en la sincronización remota. Intenta nuevamente"
                }
              } else {
                return {
                    OK: true
                }
              }
      

        }else{
            return {
                error: "Ha ocurrido un error en BD. Intenta nuevamente"
            }
        }

    }else{
        return {
            error: "Datos no válidos. Contacta a tu proveedor."
        }
    }
} 