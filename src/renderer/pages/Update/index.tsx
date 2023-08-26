import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
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
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import OverlayLoader from '../../components/OverlayLoader';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
registerLocale('es', es);
import { showToast } from '../../utils/toast';
import {
  validateEmail,
  getMysqlDate,
  base64Encode,
  sha256Encode,
  formatDate,
} from '../../utils/generals';
import { sqlite3Run, sqlite3All } from '../../helpers/Sqlite3Operations';
import { months, years } from 'renderer/constants';
import 'react-datepicker/dist/react-datepicker.css';
import './styles.scss';

export default function Update() {
  const authState = useSelector((state) => state);
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const [startDate, setStartDate] = React.useState(new Date());
  const userId =
    authState && authState.auth.user ? authState.auth.user.email : 'test';
  const [isOpen, setIsOpen] = React.useState(false);
  const [dataUser, setDataUser] = React.useState(null);
  const handleChange = (e) => {
    setIsOpen(false);
    setStartDate(e);
  };

  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(true);
  };

  const loadUser = async () => {
    setOpen(true);
    const userQuery = await sqlite3All(
      `SELECT * FROM usuario WHERE email = '${userId}' LIMIT 1`
    );
    if (userQuery.OK && userQuery.OK.length == 1) {
      setOpen(false);
      setStartDate(new Date(userQuery.OK[0].fecha_nacimiento))
      setDataUser(userQuery.OK[0]);
    } else {
      setOpen(false);
      showToast('Ha ocurrido un error');
      navigate(-1);
    }
  };

  React.useEffect(() => {
    loadUser();
  }, []);

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

    if (
      email == '' ||
      email_repeat == '' ||
      fullName == '' ||
      document == '' ||
      birthday == ''
    ) {
      showToast('Completa los datos');
    } else if (!validateEmail(email)) {
      showToast('El correo electrónico no es correcto');
    } else if (email != email_repeat) {
      showToast(
        'Revisa que tu correo electrónico sea válido en ambos campos de texto'
      );
    } else {

        let updateRun = true;
        let udateString = `UPDATE usuario SET nombre_completo = '${fullName}', documento = '${document}', fecha_nacimiento = '${birthday}',`;
        
        if (password_repeat != '' || password != ''){
          if (password != password_repeat) {
            updateRun = false;
            showToast(
              'Revisa que tu contraseña sea la misma en ambos campos de texto'
            );
          }else{
            udateString += `, password1 = '${sha256Encode(password)}', password2 = '${ base64Encode(password)}' `;
          }
        }

        udateString += ` WHERE email = '${dataUser.email}'`;

        if (updateRun){
          setOpen(true);
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
            showToast(
              'Usuario actualizado exitosamente',
              'success'
            );
          } else {
            setOpen(false);
            console.log(result);
            showToast('Ocurrió un error. Intenta nuevamente.', 'error');
          }
        }

    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <OverlayLoader open={open} />
      <CssBaseline />
      {dataUser ? (
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
            Actualización de datos
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="off"
                  name="fullName"
                  required
                  fullWidth
                  id="fullName"
                  label="Nombre completo"
                  value={dataUser.nombre_completo}
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
                  value={formatDate(startDate)}
                  inputProps={{ readOnly: true }}
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
                          onChange={({ target: { value } }) =>
                            changeYear(value)
                          }
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
                  />
                ) : null}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="document"
                  label="Documento"
                  name="document"
                  autoComplete="off"
                  value={dataUser.documento}
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
                  value={dataUser.email}
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
                  value={dataUser.email}
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
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Actualizar datos
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  Volver
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      ) : null}

      <ToastContainer limit={3} autoClose={3000} />
    </Container>
  );
}
