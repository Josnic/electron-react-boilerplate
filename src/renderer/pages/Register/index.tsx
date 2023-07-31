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
import IconButton from '@mui/material/IconButton';
import ArrowCircleRightTwoTone from '@mui/icons-material/ArrowCircleRightTwoTone';
import ArrowCircleLeftTwoTone from '@mui/icons-material/ArrowCircleLeftTwoTone';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Copyright from '../../components/Copyright';
import OverlayLoader from '../../components/OverlayLoader';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
registerLocale('es', es);
import { showToast } from '../../utils/toast';
import {
  validateEmail,
  getMysqlDate,
  base64Encode,
  base64Decode,
  sha256Encode,
  formatDate
} from '../../utils/generals';
import { sqlite3Run, sqlite3All } from '../../helpers/Sqlite3Operations';

import 'react-datepicker/dist/react-datepicker.css';
import './styles.scss';

export default function SignUp() {
  const range = (start, end) => {
    var ans = [];
    for (let i = start; i <= end; i++) {
      ans.push(i);
    }
    return ans;
  };
  const getYear = (date) => {
    return date.getYear();
  };
  const years = range(1990, new Date().getFullYear() + 1, 1);
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Novimbre',
    'Diciembre',
  ];

  const [open, setOpen] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const navigate = useNavigate();
  const [startDate, setStartDate] = React.useState(new Date());

  const [isOpen, setIsOpen] = React.useState(false);
  const handleChange = (e) => {
    setIsOpen(false);
    setStartDate(e);
  };

  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get('email').trim().toLowerCase();
    const email_repeat = data.get('email_repeat').trim().toLowerCase();
    const fullName = data.get('fullName').trim();
    const document = data.get('document').trim();
    const password = data.get('password').trim();
    const password_repeat = data.get('password_repeat').trim();
    const birthday = startDate ? formatDate(startDate) : '';
    console.log(sha256Encode(password))
    if (
      email == '' ||
      email_repeat == '' ||
      password_repeat == '' ||
      password == '' ||
      fullName == '' ||
      document == '' ||
      birthday == ""
    ) {
      showToast('Completa los datos');
    } else if (!validateEmail(email)) {
      showToast('El correo electrónico no es correcto');
    }else if (email != email_repeat) {
        showToast('Revisa que tu correo electrónico sea válido en ambos campos de texto');
      }else if (password != password_repeat) {
        showToast('Revisa que tu contraseña sea la misma en ambos campos de texto');
    } else {
      setOpen(true);
      const existsData = await sqlite3All(
        `SELECT * FROM usuario WHERE email = '${email}' OR documento = '${document}'`
      );

      if (existsData.OK && existsData.OK.length == 0){
        const result = await sqlite3Run(
          'INSERT INTO usuario VALUES (?,?,?,?,?,?,?)',
          [
            fullName,
            document,
            email,
            birthday,
            sha256Encode(password),
            base64Encode(password),
            getMysqlDate().split(' ')[0],
          ]
        );
        if (result.OK) {
          setReady(true);
          showToast(
            'Usuario creado exitosamente. De click en el botón o cierre el mensaje para ir a la pantalla de inico de sesión',
            'success',
            undefined,
            () => {
              setOpen(false);
              navigate('/login');
            }
          );
        } else {
          setOpen(false);
          console.log(result);
          showToast('Ocurrió un error. Intenta nuevamente.', 'error');
        }
      }else{
        setOpen(false);
        console.log(existsData);
        showToast('Ocurrió un error. Intenta nuevamente.', 'error');
      }
      
    }
  };

  const CloseButton = ({ closeToast }) => (
    <Chip
      label="Iniciar sesión"
      variant="outlined"
      onClick={() => {
        closeToast();
        setOpen(false);
        navigate('/login');
      }}
    />
  );

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
          Registro de usuario
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                name="fullName"
                required
                fullWidth
                id="fullName"
                label="Nombre completo"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
            <TextField
                autoComplete="off"
                name="birthday"
                required
                fullWidth
                id="birthday"
                label="Fecha de nacimiento"
                onClick={handleClick}
                onBlur={(e)=>{setIsOpen(false)}}
                value={formatDate(startDate)}
                inputProps={
                  { readOnly: true, }
                }
              />
              {isOpen ? (
              <DatePicker
           
                inline
                locale="es"
                dateFormat="yyyy-MM-dd"
                selected={startDate}
                onChange={(date) => handleChange(date)}
                renderCustomHeader={({
                  date,
                  changeYear,
                  changeMonth,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => (
                  <div
                    style={{
                      margin: 10,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <IconButton
                      color="secondary"
                      onClick={decreaseMonth}
                      disabled={prevMonthButtonDisabled}
                    >
                      <ArrowCircleLeftTwoTone />
                    </IconButton>
                    <select
                      value={date.getFullYear()}
                      onChange={({ target: { value } }) => changeYear(value)}
                    >
                      {years.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <select
                      value={months[date.getMonth()]}
                      onChange={({ target: { value } }) =>
                        changeMonth(months.indexOf(value))
                      }
                    >
                      {months.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <IconButton
                      color="secondary"
                      onClick={increaseMonth}
                      disabled={nextMonthButtonDisabled}
                    >
                      <ArrowCircleRightTwoTone />
                    </IconButton>
                  </div>
                )}
                selected={startDate}
              />
              ):(null)}
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="document"
                label="Documento"
                name="document"
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Correo electrónico"
                name="email"
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email_repeat"
                label="Confirmación correo electrónico"
                name="email_repeat"
                autoComplete="off"
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
              <TextField
                required
                fullWidth
                name="password_repeat"
                label="Contraseña"
                type="password"
                id="password_repeat"
                autoComplete="off"
              />
            </Grid>
            {/*<Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="Acepto los terminos y condiciones."
              />
                      </Grid>*/}
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
                  navigate('/login');
                }}
              >
                Iniciar sesión
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {/*<Copyright sx={{ mt: 5 }} />*/}
      <ToastContainer limit={3} autoClose={3000} />
    </Container>
  );
}
