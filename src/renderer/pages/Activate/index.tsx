import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ToastContainer } from 'react-toastify';
import OverlayLoader from '../../components/OverlayLoader';
import { useDispatch } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';

import AuthTypes from './../../redux/constants';
import { sqlite3All, sqlite3Run } from '../../helpers/Sqlite3Operations';

import Copyright from '../../components/Copyright';
import { showToast } from '../../utils/toast';
import { sha256Encode, base64Decode, base64Encode, md5Encode } from '../../utils/generals';
import httpClient from '../../helpers/httpClient';
import {
  getMachineId,
  readSerialFiles,
  deleteSerialFiles,
  isInternetAvailable,
} from '../../utils/electronFunctions';
import { userApi, tokenApi, BAD_REQUEST_ERRORS } from '../../constants';

export default function Activate() {
  const [open, setOpen] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const requestActivation = async (pin) => {
    setOpen(true);

    const resultFile = await readSerialFiles(md5Encode(pin));
    if (resultFile.ok && resultFile.found && resultFile.found == true) {
      const isReachable = await isInternetAvailable('https://google.com');
      const machineId = await getMachineId();
      if (isReachable) {
        const response = await httpClient().post('http://educationfortheworld.com.py:7000/v1', {
          serialLicense: pin,
          serialMachine: machineId,
          user: userApi,
          token: tokenApi
        });

        if (response.error) {

          if (response.data.type == "response"){
            setOpen(false);
            const statusCode = response.data.error.status;
            const dataResponse = response.data.error.data;
            showToast('No fue posible obtener información de la licencia. Error '+ statusCode +"-"+dataResponse.message + '. Verifica e intenta de nuevo.', 'error');
          }else{
            insertData(pin, machineId, false);
          }
        } else {
          const data = response.data;
          if (data.code && parseInt(data.code) == 201) {
            insertData(pin, machineId, true);
          } else {
            setOpen(false);
            showToast(
              'No fue posible activar tu licencia. Intenta nuevamente.',
              'error'
            );
          }
        }
      } else {
        insertData(pin, machineId, false);
      }
    } else {
      setOpen(false);
      showToast(
        'No fue posible activar tu licencia. Verifica que tu pin sea válido e intenta nuevamente.',
        'error'
      )
    }
  };

  const insertData = async (pin, machineId, isActive) => {
    const state = isActive ? 'ACTIVE' : 'EARRING'
    const result = await sqlite3Run('INSERT INTO activacion VALUES (?,?,?)', [
      base64Encode(pin),
      machineId,
      base64Encode(state),
    ]);
    if (result.OK) {
      setReady(true);
      await deleteSerialFiles();
      showToast(
        'Aplicación activada correctamente',
        'success',
        undefined,
        () => {
          setOpen(false);
          navigate('/login');
        }
      );
    } else {
      showToast('No fue posible realizar la activación. Intenta nuevamente.');
      setOpen(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const pin = data.get('pin').trim();
    if (pin == '') {
      showToast('Digita un pin válido');
    } else {
      await requestActivation(pin);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <OverlayLoader
        open={open}
        ready={ready}
        buttonClick={() => {
          setOpen(false);
          navigate('/login');
        }}
      />
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Activar aplicación
        </Typography>
        <Typography
          sx={{ marginTop: 2, marginBottom: 2 }}
          component="h1"
          variant="body2"
        >
          Digita el pin suministrado
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="pin"
            label="Pin de activación"
            name="pin"
            autoComplete="off"
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Activar
          </Button>
        </Box>
      </Box>
      {/*<Copyright sx={{ mt: 8, mb: 4 }} />*/}
      <ToastContainer />
    </Container>
  );
}
