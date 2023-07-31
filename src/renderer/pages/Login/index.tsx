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
import { sqlite3All } from '../../helpers/Sqlite3Operations'; 

import Copyright from '../../components/Copyright';
import { showToast } from '../../utils/toast';
import {
  sha256Encode
} from '../../utils/generals';

export default function SignIn() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email').trim();
    const password = data.get('password').trim()
    if (email == "" || password == "") {
      showToast("Completa los datos");
    }else{
      setOpen(true);
      const result = await sqlite3All(`SELECT * FROM usuario WHERE email = '${email}' AND password1 = '${sha256Encode(password)}' LIMIT 1`);
      if (result.OK) {
        setOpen(false);
        if (result.OK.length && result.OK.length == 1) {
          dispatch({
            type: AuthTypes.LOGIN,
            user: result.OK[0]
          });
          navigate("/home");
        }else{
          showToast("Datos de acceso no existentes");
        }
      }else{
        setOpen(false);
        console.log(result)
        showToast("Ocurrió un error. Intenta nuevamente.", "error");
      }
    } 
  };

  return (
      <Container component="main" maxWidth="xs">
        <OverlayLoader open={open} />
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
            Iniciar sesión
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo electrónico"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/*<FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Recordarme"
        />*/}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Ingresar
            </Button>
            <Grid container>
              <Grid item xs>
                {/*<Link
                  component="button"
                  variant="body2"
                  onClick={() => {
                    navigate("/register")
                  }}
                >
                  Olvidaste tu contraseña?
                </Link>*/}
              </Grid>
              <Grid item>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => {
                    navigate("/register")
                  }}
                >
                  Registrate
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/*<Copyright sx={{ mt: 8, mb: 4 }} />*/}
        <ToastContainer />
      </Container>
  );
}