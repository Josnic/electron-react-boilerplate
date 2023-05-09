import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Copyright from '../../components/Copyright';
import OverlayLoader from '../../components/OverlayLoader';

import { showToast } from '../../utils/toast';
import { validateEmail } from '../../utils/generals';
import { sqlite3Run } from '../../helpers/Sqlite3Operations'; 

export default function SignUp() {
  const [open, setOpen] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get('email').trim();
    const firstName = data.get('firstName').trim();
    const lastName = data.get('lastName').trim();
    const password = data.get('password').trim();
    if (email == "" || password == "" || firstName == "" || lastName == "") {
      showToast("Completa los datos");
    }else if (!validateEmail(email)) {
      showToast("El correo electrónico no es correcto");
    }else{
      setOpen(true);
      const result = await sqlite3Run("INSERT INTO user VALUES (?,?,?,?)", [firstName, lastName, email, password]);
      setReady(true);
      showToast("Usuario creado exitosamente", "success", undefined, ()=>{
        setOpen(false);
        navigate("/login");
      })
      if (result.OK) {
        setReady(true);
        showToast("Usuario creado exitosamente. De click en el botón o cierre el mensaje para ir al ", "success", undefined, ()=>{
          setOpen(false);
          navigate("/login");
        })
      }else{
        //setOpen(false);
        console.log(result)
        //showToast("Ocurrió un error. Intenta nuevamente.", "error");
      }
    }
  };

  const CloseButton = ({ closeToast }) => (
    <Chip label="Iniciar sesión" variant="outlined" onClick={()=>{
      closeToast();
      setOpen(false);
      navigate("/login");
    }} />
  );

  return (
      <Container component="main" maxWidth="xs">
        <OverlayLoader open={open} ready={ready} buttonClick={()=>{
          setOpen(false);
          navigate("/login");
        }}/>
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
            Registro de usuario
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Nombres"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Apellidos"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Correo electrónico"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="Acepto los terminos y condiciones."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Registrar
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  navigate("/login")
                }}
              >
                Iniciar sesión
              </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
        <ToastContainer limit={3} autoClose={3000} closeButton={CloseButton}/>
      </Container>
  );
}