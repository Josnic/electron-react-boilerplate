import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer } from 'react-toastify';
import { showToast } from '../../utils/toast';
import { useNavigate } from 'react-router-dom';
import { sqlite3All, sqlite3Run } from '../../helpers/Sqlite3Operations';
import AuthTypes from './../../redux/constants';
import { sha256Encode, base64Decode, base64Encode } from '../../utils/generals';
import httpClient from '../../helpers/httpClient';
import { getMachineId, isInternetAvailable } from '../../utils/electronFunctions';
import { userApi, tokenApi, BAD_REQUEST_ERRORS } from '../../constants';

const Init = () => {
  const navigate = useNavigate();;
  const activationValidate = async(data) => {
    console.log(data)
    const machineId = await getMachineId();
    const statusLicense = base64Decode(data.estado);
    if (statusLicense == 'ACTIVE') {
      if (machineId == data.serial_maquina) {
        navigate('/welcome');
      }else{
        showToast('Identificador de licencia inválido activo.', 'error');
        navigate('/welcome');
      }

    }else if (statusLicense == "NO_VALID"){
      showToast('La aplicación debe ser reinstalada debido a error crítco de licencia.', 'error');
    } else if(statusLicense == "EARRING"){
     
      if (machineId == data.serial_maquina) {
        const isReachable = await isInternetAvailable('https://google.com');
        if (isReachable){
          const response = await httpClient().post('http://educationfortheworld.com.py:7000/v1', {
            user: userApi,
            token: tokenApi,
            serialLicense: base64Decode(data.serial_licencia),
            serialMachine: data.serial_maquina,
          });

          console.log(response)
  
          if (response.error) {
            //showToast('Tu licencia no es válida.', 'error');
            if (response.data.type == "response"){

              const statusCode = response.data.error.status;

              const dataResponse = response.data.error.data;

              switch(statusCode){

                case 400:

                if (BAD_REQUEST_ERRORS.includes(dataResponse.message)){
                  await updateData( base64Decode(data.serial_licencia), data.serial_maquina, 'NO_VALID')
                }else{
                  showToast('No fue posible obtener información de la licencia. Error 400: '+dataResponse.message, 'error');
                }

                
                break;

                case 401:
                  showToast('No fue posible obtener información de la licencia. Error 401.', 'error');
                break;

                case 500:
                  showToast('No fue posible obtener información de la licencia. Error 500.', 'error');
                break;

              }

            }else{
              navigate("/welcome")
            }
            
          } else {
            const data2 = response.data;
            if (data2.code && parseInt(data2.code) == 201) {
              await updateData(base64Decode(data.serial_licencia), data.serial_maquina, 'ACTIVE')
            } else {



              showToast('Tu licencia no es válida.', 'error');



            }
          }

        }else{
          navigate('/welcome');
        }

      } else {
        showToast('Identificador de licencia inválido.', 'error');
      }
    }else{
      showToast('Licencia dañada. Contacta a tu proveedor.', 'error');
    }
  };

  const updateData = async (pin, machineId, state) => {
    const result = await sqlite3Run(`UPDATE activacion SET estado = '${base64Encode(state)}'`, []);
    console.log(result)
    if (state == "NO_VALID"){
      showToast('Licencia no válida. Imposible continuar.');
    }else{
      navigate('/welcome');
    }
    
   
  };

  const initApp = async () => {
    const result = await sqlite3All(`SELECT * FROM activacion LIMIT 1`);
    console.log(result)
    if (result.OK) {
      if (result.OK.length && result.OK.length == 1) {
        activationValidate(result.OK[0]);
      } else {
        navigate('/activation');
      }
    } else {
      showToast('Ocurrió un error en BD. Intenta nuevamente.', 'error');
    }
  };

  React.useEffect(() => {
    initApp();
  }, []);
  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
        onClick={() => {}}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <ToastContainer />
    </div>
  );
};

export default Init;
