import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ToastContainer } from 'react-toastify';
import OverlayLoader from '../../components/OverlayLoader';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../../components/Tests/components/AlertModal';
import { sqlite3All } from '../../helpers/Sqlite3Operations';

import { showToast } from '../../utils/toast';
import { base64Decode } from '../../utils/generals';
import httpClient from '../../helpers/httpClient';
import { isInternetAvailable } from '../../utils/electronFunctions';

export default function Activate() {
  const [open, setOpen] = React.useState(false);
  const [showModalPwd, setShowModalPwd] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pwd, setPwd] = React.useState("");
  const [confirmCode, setConfirmCode] = React.useState('');
  const [confirmCode2, setConfirmCode2] = React.useState('');

  const confirmCodeResult = () => {
    if (confirmCode2 == confirmCode) {
      setShowModalPwd(true);
    }else{
      showToast('Código de confirmación no válido.');
    }
  }

  const requestActivation = async (email) => {
    const isReachable = await isInternetAvailable('https://google.com');

    if (isReachable) {
      const response = await httpClient().post('/', {
        email: email,
      });

      if (response.error) {
        setOpen(false);
        showToast(
          'No fue posible enviar tu correo de confirmación. intenta nuevamente.',
          'error'
        );
      } else {
        setOpen(false);
        const data = response.data;
        if (data.code && data.code != '') {
          setConfirmCode(data.code);
        } else {
          showToast(
            'No fue posible activar tu licencia. Intenta nuevamente.',
            'error'
          );
        }
      }
    } else {
      setOpen(false);
      showToast('No cuentas con conexión a internet.', 'error');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email').trim();
    if (email == '') {
      showToast('Digita un correo válido');
    } else {
      setOpen(true);
      const result = await sqlite3All(
        `SELECT * FROM usuario WHERE email = '${email}' LIMIT 1`
      );
      if (result.OK) {
        setPwd(result.OK[0].password2)
        requestActivation(email);
      } else {
        setOpen(false);
        showToast('Ocurrió un error en BD. Intenta de nuevo.');
      }
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
          Recuperar contraseña
        </Typography>
        <Typography
          sx={{ marginTop: 2, marginBottom: 2 }}
          component="h1"
          variant="body2"
        >
          Digita el correo suministrado cuando te registraste
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="off"
            autoFocus
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="code"
            label="Código"
            name="code"
            autoComplete="off"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setConfirmCode2(event.target.value);
            }}
            autoFocus
          />
          {confirmCode ? (
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={()=>{
                
              }}
            >
              Confirmar código
            </Button>
          ) : null}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {!confirmCode ? 'Enviar correo' : 'Volver a enviar correo'}
          </Button>
          <Grid container sx={{textAlign: "center"}}>
            <Grid item xs>
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  navigate('/login');
                }}
              >
                Volver
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {/*<Copyright sx={{ mt: 8, mb: 4 }} />*/}
      <ToastContainer />
      <AlertModal
          open={showModalPwd}
          title={''}
          content={<>
             <Typography variant="subtitle1" gutterBottom>
              Tu contraseña es:
            </Typography>
            <Typography variant="h6" gutterBottom>
             {base64Decode(pwd)}
            </Typography>
            </>}
          buttonText={'Ir a iniciar sesión'}
          onButtonClick={() => {
            navigate("/login")
          }}
        />
    </Container>
  );
}
