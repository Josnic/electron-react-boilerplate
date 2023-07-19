import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import DOMPurify from 'dompurify';
import TextField from '@mui/material/TextField';
import ButtomCustom from '../../ButtonRound';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import NumericInput from 'react-numeric-input';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import TestTitle from '../TestTitle';
import parse from 'html-react-parser';
import { getPathCourseResource } from '../../../utils/electronFunctions';
import { sqlite3All } from '../../../helpers/Sqlite3Operations';
import AlertModal from '../components/AlertModal';
import '../styles.scss';

const InputNumberTest = ({ data, courseCode }) => {
  const [answers, setAnswers] = useState(Array(10).fill(null));
  const [questions, setQuestions] = useState(Array(10).fill('Pregunta'));
  const [openModalWelcome, setOpenModalWelcome] = useState(true);
  const [openModalEnd, setOpenModalEnd] = useState(false);
  const [categories, setCategories] = useState([]);
  const [modalInitData, setModalInitData] = useState({
    content: '',
    buttonText: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log((event.target as HTMLInputElement).value);
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleAnswerChange = (index, value) => {
    console.log(index, value);
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const imagePaths = async (html, stringImages, path) => {
    const images = stringImages ? stringImages.split(',') : null;
    let content = html;
    if (Array.isArray(images)) {
      for (let i = 0; i < images.length; i++) {
        let finalPath = '';
        if (images[i].indexOf('commons/') != -1) {
          finalPath = await getPathCourseResource(
            images[i].replace('commons', 'commons.asar')
          );
        } else {
          finalPath = await getPathCourseResource(path + '/img.asar/' + images[i]);
        }
        content = content.replace(images[i], finalPath);
      }
    }
    return content;
  };

  const loadTestData = async () => {
    const test = await sqlite3All(
      `SELECT * FROM tests WHERE cod_test = '${data.test_id}' LIMIT 1`
    );
    console.log(test);
    if (test.OK) {
      const testData = test.OK[0];
      if (testData.encabezado && testData.encabezado != '') {
        let htmlContent = testData.encabezado;
        const path = courseCode;
        if (testData.img_encabezado && testData.img_encabezado != '') {
          htmlContent = await imagePaths(
            htmlContent,
            testData.img_encabezado,
            path
          );
        }
        setModalInitData({
          content: htmlContent,
          buttonText:
            testData.texto_boton && testData.texto_boton != ''
              ? testData.texto_boton
              : 'Aceptar',
        });
      }else{
        setModalInitData({
          content: "",
          buttonText: ""
        });
      }
    }else{
      setModalInitData({
        content: "",
        buttonText: ""
      });
    }

    const questions = await sqlite3All(
      `SELECT tests_preguntas_inputn.permite_cero, tests_preguntas_inputn.pregunta, tests_preguntas_inputn.cod_categoria, tests_categorias_preguntas.nombre FROM tests_preguntas_inputn 
      LEFT JOIN tests_categorias_preguntas ON tests_categorias_preguntas.cod_categoria = tests_preguntas_inputn.cod_categoria
      WHERE tests_preguntas_inputn.cod_test = '${data.test_id}' ORDER BY tests_categorias_preguntas.orden, tests_preguntas_inputn.orden ASC`
    );
    console.log(questions);
    if (questions.OK) {
      const categoryArray = [
        ...new Set(
          questions.OK.map((ele, index) => {
            return ele.nombre;
          })
        ),
      ];
      setCategories(categoryArray);
      console.log(categoryArray);
      setQuestions(questions.OK);
      setAnswers(new Array(questions.OK.length).fill(null));
    }else{
      setCategories([]);
      setQuestions([]);
      setAnswers([]);
    }
  };

  useEffect(() => {
    if (data) {
      loadTestData();
    }
  }, [data]);

  return (
    <Grid container columns={{ xs: 4, md: 12 }} spacing={2}>
      <Grid item xs={12}>
        {data ? (
          <TestTitle title={data.nombre} component={'div'} color={'white'} />
        ) : null}
      </Grid>
      <Grid item xs={12}>
        <div className="tests-container">
          {categories && categories.length > 0 ? (
            <>
              {categories.map((ele1, index) => (
                <Box className="container-area">
                  <TestTitle
                    title={ele1}
                    component={'nav'}
                    color={'white'}
                    barColor={'secondary'}
                  />

                  <Box component="main" sx={{ p: 3 }}>
                    {questions.map((ele, index2) => (
                      <>
                        {ele.nombre == ele1 ? (
                          <div className="question-container" key={index2}>
                            <div className="question input-number-cuestion">
                              {parse(ele.pregunta)}
                            </div>
                            <div className="input-number-container">
                              <NumericInput
                                value={0}
                                min={0}
                                max={10}
                                step={1}
                                size={6}
                                onChange={(value, input, other) => {
                                  console.log(value, input, other);
                                  //handleAnswerChange(0, value)
                                }}
                                style={{
                                  wrap: {
                                    background: 'white',
                                    boxShadow:
                                      '0 0 1px 1px #fff inset, 1px 1px 5px -1px #000',
                                    padding: '2px 2.26ex 2px 2px',
                                    borderRadius: '6px 3px 3px 6px',
                                    fontSize: 18,
                                  },
                                  input: {
                                    borderRadius: '4px 2px 2px 4px',
                                    padding: '0.1ex 1ex',
                                    border: '1px solid #white',
                                    marginRight: 4,
                                    display: 'block',
                                    fontWeight: 100,
                                    textShadow:
                                      '1px 1px 1px rgba(0, 0, 0, 0.1)',
                                  },
                                  'input:focus': {
                                    border: '1px inset #white',
                                    outline: 'none',
                                  },
                                }}
                              />
                            </div>
                          </div>
                        ) : null}
                      </>
                    ))}
                  </Box>
                </Box>
              ))}
            </>
          ) : null}
        </div>
      </Grid>
      <Grid item xs={12} className="lessons-button-container-center">
        <ButtomCustom variant="contained" rounded>
          Continuar
        </ButtomCustom>
      </Grid>
      <AlertModal
        open={openModalWelcome}
        title={''}
        content={parse(modalInitData.content)}
        buttonText={modalInitData.buttonText}
        onButtonClick={() => {
          setOpenModalWelcome(false);
        }}
      />
    </Grid>
  );
};

export default InputNumberTest;
