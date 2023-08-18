import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer } from 'react-toastify';
import { showToast } from '../../utils/toast';
import { useNavigate } from 'react-router-dom';
import { sqlite3All, sqlite3Run } from '../../helpers/Sqlite3Operations';
import AuthTypes from './../../redux/constants';
import { sha256Encode, base64Decode } from '../../utils/generals';
import httpClient from '../../helpers/httpClient';
import { getMachineId, isInternetAvailable } from '../../utils/electronFunctions';

const Init = () => {
  const navigate = useNavigate();
  const activationValidate = async(data) => {
    const machineId = await getMachineId();
    if (base64Decode(data.estado) == 'ACTIVO') {
      if (machineId == data.serial_maquina) {
        navigate('/login');
      }else{
        showToast('Identificador de licencia inválido activo.', 'error');
      }
      
    } else {
     
      if (machineId == data.serial_maquina) {
        const isReachable = await isInternetAvailable('google.com');
        if (isReachable){

          const response = await httpClient().post('/', {
            licenseSerial: base64Decode(data.serial_licencia),
            machineId: data.serial_maquina,
          });
  
          if (response.error) {
            //showToast('Tu licencia no es válida.', 'error');
            showToast('No fue posible obtener información de la licencia.', 'error');
          } else {
            const data = response.data;
            if (data.isValid && data.isValid == true) {
              navigate('/login');
            } else {
              showToast('Tu licencia no es válida.', 'error');
            }
          }

        }else{
          navigate('/login');
        }

      } else {
        showToast('Identificador de licencia inválido.', 'error');
      }
    }
  };

  const initApp = async () => {
    const result = await sqlite3All(`SELECT * FROM activacion LIMIT 1`);
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
