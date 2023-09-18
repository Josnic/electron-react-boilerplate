import { sqlite3All, sqlite3Run, sqlite3InsertBulk } from './Sqlite3Operations';
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
        const forms = await sqlite3All(`SELECT * FROM formulario_respuesta WHERE user_id = '${userId}`);
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
                user: user.OK[0],
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

            const response = await httpClient().post('https://educationfortheworld.com.py/apiv1-dskapp/', {
                SYNCHRONIZE: obj
            });
            console.log(response)
            if (response.error) {

                return {
                    error: "Ha ocurrido un error en la sincronización remota. Intenta nuevamente"
                }
              } else {

                const toUpdate = response.data.ok.data.toUpdate;
                const toInsert = response.data.ok.data.toInsert;

                //eliminación

                if (toUpdate.forms.length > 0){
                    await sqlite3Run(
                        `DELETE FROM formulario_respuesta WHERE cod_formulario IN('${toUpdate.forms.join("','")}') AND user_id = '${userId}'`,
                        []
                    ); 
                }
                
                if (toUpdate.radiotest.length > 0){
                    await sqlite3Run(
                        `DELETE FROM test_radio_respuestas WHERE cod_test IN('${toUpdate.radiotest.join("','")}') AND user_id = '${userId}'`,
                        []
                      );
                }

                if (toUpdate.inputntest.length > 0){
                    await sqlite3Run(
                        `DELETE FROM test_inputn_respuestas WHERE cod_test IN('${toUpdate.inputntest.join("','")}') AND user_id = '${userId}'`,
                        []
                    );
                }

                if (toUpdate.vftest.length > 0){
                    await sqlite3Run(
                        `DELETE FROM test_vf_respuestas WHERE cod_test IN('${toUpdate.vftest.join("','")}') user_id = '${userId}'`,
                        []
                    );
                }

                //inserción

                if (toInsert.forms.length > 0){
                    const arForm = [];
                    for (let i = 0; i < toInsert.forms.length; i++){
                        arForm.push([
                            userId,
                            toInsert.forms[i].cod_formulario,
                            toInsert.forms[i].id_pregunta,
                            toInsert.forms[i].respuesta,
                            toInsert.forms[i].fecha,
                        ])
                    }
                    await sqlite3InsertBulk(
                        'INSERT INTO formulario_respuesta VALUES (?,?,?,?,?)',
                        arForm
                      );
                }
                
                if (toInsert.radiotest.length > 0){
                    const arRadio = [];
                    for (let i = 0; i < toInsert.radiotest.length; i++){
                        arRadio.push([
                            userId,
                            toInsert.radiotest[i].cod_test,
                            toInsert.radiotest[i].id_pregunta,
                            toInsert.radiotest[i].valor,
                            toInsert.radiotest[i].fecha
                        ])
                    }
                    await sqlite3InsertBulk(
                        'INSERT INTO test_radio_respuestas VALUES (?,?,?,?,?)',
                        arRadio
                      );
                }

                if (toInsert.inputntest.length > 0){

                    const arInput = [];
                    for (let i = 0; i < toInsert.inputntest.length; i++){
                        arInput.push([
                            userId,
                            toInsert.inputntest[i].cod_test,
                            toInsert.inputntest[i].id_pregunta,
                            toInsert.inputntest[i].valor,
                            toInsert.inputntest[i].fecha
                        ])
                    }
                    await sqlite3InsertBulk(
                        'INSERT INTO test_inputn_respuestas VALUES (?,?,?,?,?)',
                        arInput
                      );
                }

                if (toInsert.vftest.length > 0){
                    const arVtest = [];
                    for (let i = 0; i < toInsert.vftest.length; i++){
                        arVtest.push([
                            userId,
                            toInsert.vftest[i].cod_test,
                            toInsert.vftest[i].id_pregunta,
                            toInsert.vftest[i].valor,
                            toInsert.vftest[i].fecha
                        ])
                    }
                    await sqlite3InsertBulk(
                        'INSERT INTO test_inputn_respuestas VALUES (?,?,?,?,?)',
                        arVtest
                      );
                }


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