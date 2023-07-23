import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import DOMPurify from 'dompurify';
import TextField from '@mui/material/TextField';
import ButtomCustom from '../../ButtonRound';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import FormControlLabel from '@mui/material/FormControlLabel';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import RadioQuestion from '../components/RadioQuestion';
import AlertModal from '../components/AlertModal';
import TestTitle from '../TestTitle';
import parse from 'html-react-parser';
import { getPathCourseResource } from '../../../utils/electronFunctions';
import { sqlite3All } from '../../../helpers/Sqlite3Operations';
import { ToastContainer } from 'react-toastify';
import OverlayLoader from '../../OverlayLoader';
import { showToast } from '../../../utils/toast';
import '../styles.scss';

const RadioButtonTest = ({ data, courseCode }) => {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [openModalWelcome, setOpenModalWelcome] = useState(true);
  const [openModalEnd, setOpenModalEnd] = useState(false);
  const [currentTest, setTest] = useState(null);
  const [categories, setCategories] = useState([]);
  const categoryResponseArray = useRef([]);
  const [modalInitData, setModalInitData] = useState({
    title: '',
    content: '',
    buttonText: '',
  });
  const [modalEndData, setModalEndData] = useState({
    title: '',
    content: '',
    buttonText: '',
  });

  const handleAnswerChange = (index, category, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = {
      category: category,
      value: value
    };
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
          finalPath = await getPathCourseResource(
            path + '/img.asar/' + images[i]
          );
        }
        content = content.replace(images[i], finalPath);
      }
    }
    return content;
  };

  const loadTestData = async () => {
    setModalEndData({
      title: '',
      content: '',
      buttonText: '',
    });
    const test = await sqlite3All(
      `SELECT * FROM tests WHERE cod_test = '${data.test_id}' LIMIT 1`
    );
    let testData = null;
    console.log(test);
    if (test.OK) {
      setTest(test.OK[0]);
      testData = test.OK[0];
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
      } else {
        setModalInitData({
          content: '',
          buttonText: '',
        });
      }
    } else {
      setModalInitData({
        content: '',
        buttonText: '',
      });
    }
    console.log(testData);
    if (testData) {
      let category = ``;
      let join = ``;
      let orderType = ` ORDER BY tests_preguntas_radio.orden ASC`;

      switch (testData.cod_test) {
        case 'COVI_Autoevaluacion':
          category = `'' AS category`;
          break;

        case 'COVI_Raiz_amargura':
        case 'INEM_nivel_IE':
          let field = testData.cod_test == 'COVI_Raiz_amargura' ? `raiz` : `ie`;
          category = `tests_categorias_preguntas.nombre AS category`;
          join = `  LEFT JOIN tests_categorias_preguntas ON tests_categorias_preguntas.cod_categoria = tests_preguntas_radio.${field} `;
          if (testData.cod_test == 'INEM_nivel_IE') {
            orderType = ` ORDER BY RANDOM() `;
          }
          break;
      }

      const questions = await sqlite3All(
        `SELECT tests_preguntas_radio.id,
        tests_preguntas_radio.pregunta, 
        tests_preguntas_radio.informativo,
        tests_preguntas_radio.negativo,
        tests_preguntas_radio.unidad,
        ${category}
        FROM tests_preguntas_radio 
        ${join}
        WHERE tests_preguntas_radio.cod_test = '${data.test_id}' ${orderType}`
      );

      console.log(questions);

      if (questions.OK) {
        setQuestions(questions.OK);
        setAnswers(
          new Array(questions.OK.length).fill({
            category: '',
            value: 0,
          })
        );
        const categoryArray = [
          ...new Set(
            questions.OK.map((ele, index) => {
              return ele.category;
            })
          ),
        ];
        setCategories(categoryArray);
      } else {
        setQuestions([]);
        setAnswers([]);
        setCategories([]);
      }
    }
  };

  useEffect(() => {
    if (data) {
      loadTestData();
    }
  }, [data]);

  const COVI_AutoevaluacionResponse = async () => {
    setModalEndData({
      title: 'RESULTADO DE TU AUTOEVALUACIÓN',
      content: '',
      buttonText: 'Aceptar',
    });
    setOpenModalEnd(true);
  };

  const AmarguraList  = () => {
    const preventDefault = (event: React.SyntheticEvent) =>
      event.preventDefault();
    return (
      <>
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        >
          {categoryResponseArray.current && categoryResponseArray.current.map((value, index) => (
            <ListItem
              key={index}
              disableGutters
              secondaryAction={
                <Badge
                  badgeContent={`${value.value}`}
                  color="primary"
                ></Badge>
              }
            >
              <ListItemText primary={`${value.category}`} />
            </ListItem>
          ))}
        </List>
        <Box
          sx={{
            typography: 'body1',
            '& > :not(style) ~ :not(style)': {
              ml: 2,
            },
            textAlign: 'center',
          }}
          onClick={preventDefault}
        >
          <Typography variant="h6" gutterBottom>
            Raíz a trabajar:{' '}
            {
              JSON.parse(JSON.stringify(categoryResponseArray.current)).sort(function (a, b) {
                return a.value - b.value;
              })[0].category
            }
          </Typography>
        </Box>
      </>
    );
  }

  const ieResponse = () => {
    const category = JSON.parse(JSON.stringify(categoryResponseArray.current)).sort(function (a, b) {
      return a.value - b.value;
    })[0].category;

    const unit = questions.filter(ele => ele.category == category)
    return (
      <>
      {
        categoryResponseArray.current && 
        categoryResponseArray.current.length &&
        categoryResponseArray.current.length > 0 ? (
          <Typography variant="subtitle2" gutterBottom>
            Este proceso de educación emocional será de gran importancia para tu desarrollo personal y bienestar general. De acuerdo al test realizado, requieres elevar tu nivel de {category} que se encuentra en la unidad {unit[0].unidad}
          </Typography>
        ):(
          null
        )
      }
      </>
    )
  }
  const COVI_Raiz_amarguraResponse = async () => {
    setModalEndData({
      title: 'Identificando la Raíz de Amargura',
      content: AmarguraList(),
      buttonText: 'Aceptar',
    });
    setOpenModalEnd(true);
  };

  const INEM_nivel_IEResponse = async () => {
    setModalEndData({
      title: 'RESULTADO DE TU TEST',
      content: ieResponse(),
      buttonText: 'Aceptar',
    });
    setOpenModalEnd(true);
  };

  const invertValue = (value) => {
    if (value == currentTest.rango_inicial) {
      return currentTest.rango_final;
    }
    if (value == currentTest.rango_final) {
      return currentTest.rango_inicial;
    }

    const middle = (currentTest.rango_inicial + currentTest.rango_final) / 2;
    const decimal = middle % 1;

    if (value == middle) {
      return value;
    }
    if (value > middle) {
      return Math.ceil(middle - (currentTest.rango_final - value - decimal));
    }

    if (value < middle) {
      return Math.ceil(middle + (value - currentTest.rango_inicial - decimal));
    }
  };

  const resultByCategory = () => {
    const arForList = [];
    console.log(answers)
    for (let i = 0; i < categories.length; i++) {
      let arValues = [];
      for (let j = 0; j < answers.length; j++) {
        if (answers[j].category == categories[i]) {
          if (questions[j].negativo == 1) {
            arValues.push(invertValue(answers[j].value));
          } else {
            arValues.push(answers[j].value);
          }
        }
      }

      arForList.push({
        category: categories[i],
        value: arValues.reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        }, 0),
      });
    }
    categoryResponseArray.current = arForList;
  };

  const saveTest = async () => {
    const empty = answers.filter((ele) => ele.value == 0);
    if (empty.length > 0) {
      showToast('Completa todo el formulario');
    } else {
      setOpen(true);

      switch (currentTest.cod_test) {
        case 'COVI_Autoevaluacion':
          COVI_AutoevaluacionResponse();
          break;

        case 'COVI_Raiz_amargura':
          resultByCategory();
          COVI_Raiz_amarguraResponse();
          break;
        case 'INEM_nivel_IE':
          resultByCategory();
          INEM_nivel_IEResponse();
          break;
      }

      setTimeout(() => {
        setOpen(false);
      }, 1000);
    }
  };

  return (
    <Grid container columns={{ xs: 4, md: 12 }} spacing={2} key={data.test_id}>
      <OverlayLoader open={open} />
      {currentTest ? (
        <>
          <Grid item xs={12}>
            {data ? <TestTitle title={data.nombre} color={'white'} /> : null}
          </Grid>
          <Grid item xs={12}>
            <div className="tests-container">
              {questions.map((question, index) => {
                return (
                  <RadioQuestion
                    question={question}
                    key={index}
                    scale={{
                      min: currentTest.rango_inicial,
                      max: currentTest.rango_final,
                    }}
                    onAnswerChange={(value) => handleAnswerChange(index, question.category, value)}
                  />
                );
              })}
            </div>
          </Grid>
          <Grid item xs={12} className="lessons-button-container-center">
            <ButtomCustom onClick={saveTest} variant="contained" rounded>
              Guardar
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
          <AlertModal
            open={openModalEnd}
            title={modalEndData.title}
            content={modalEndData.content}
            buttonText={modalEndData.buttonText}
            onButtonClick={() => {
              setOpenModalEnd(false);
            }}
          />
        </>
      ) : null}
      <ToastContainer />
    </Grid>
  );
};

export default RadioButtonTest;
