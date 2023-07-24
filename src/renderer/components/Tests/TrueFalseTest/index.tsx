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
import TrueFalseQuestion from '../components/TrueFalseQuestion';
import AlertModal from '../components/AlertModal';
import TestTitle from '../TestTitle';
import parse from 'html-react-parser';
import { getPathCourseResource } from '../../../utils/electronFunctions';
import { sqlite3All } from '../../../helpers/Sqlite3Operations';
import { ToastContainer } from 'react-toastify';
import OverlayLoader from '../../OverlayLoader';
import { showToast } from '../../../utils/toast';
import '../styles.scss';

const TrueFalseTest = ({ data, courseCode, onContinue }) => {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [openModalWelcome, setOpenModalWelcome] = useState(true);
  const [openModalEnd, setOpenModalEnd] = useState(false);
  const [currentTest, setTest] = useState(null);
  const [categories, setCategories] = useState([]);
  const categoryResponseArray = useRef([]);
  const [testSaved, setTestSaved] = useState(false);
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
      value: value,
    };
    console.log(newAnswers);
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
      const orderType =
        testData.preguntas_aleatorias == 1
          ? ` ORDER BY RANDOM() `
          : ` ORDER BY tests_preguntas_vf.orden ASC`;

      const questions = await sqlite3All(
        `SELECT tests_preguntas_vf.id,
        tests_preguntas_vf.pregunta,
        tests_preguntas_vf.cod_categoria AS category
        FROM tests_preguntas_vf 
        LEFT JOIN tests_categorias_preguntas ON tests_categorias_preguntas.cod_categoria = tests_preguntas_vf.cod_categoria
        WHERE tests_preguntas_vf.cod_test = '${data.test_id}' ${orderType}`
      );

      console.log(questions);

      if (questions.OK) {
        setQuestions(questions.OK);
        setAnswers(
          new Array(questions.OK.length).fill({
            category: '',
            value: null,
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

  const saveTest = async () => {
    const empty = answers.filter((ele) => ele.value == null).length;
    if (empty > 0) {
      showToast('Debes completar todo el test');
    } else {
      const extro = answers.filter(
        (ele) =>
          (ele.value == '1' && ele.category == 'IE_EXTRO') ||
          (ele.value == '0' && ele.category == 'IE_INTRO')
      ).length;
      const percentage = Math.round((100 * extro) / answers.length);

      setOpen(true);
      setTestSaved(true);

      setModalEndData({
        title: 'Introvertido o Extrovertido',
        content: `Tienes un mayor porcentaje de ${
          percentage >= 60 ? 'EXTROVERSIÓN' : 'INTROVERSIÓN'
        }  en un ${percentage >= 60 ? percentage : 100 - percentage}%`,
        buttonText: 'Aceptar',
      });
      setOpen(false);
      setOpenModalEnd(true);
    }
  };

  useEffect(() => {
    if (data) {
      loadTestData();
    }
  }, [data]);

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
                  <TrueFalseQuestion
                    question={question}
                    key={index}
                    scale={{
                      min: currentTest.rango_inicial,
                      max: currentTest.rango_final,
                    }}
                    onAnswerChange={(value) =>
                      handleAnswerChange(index, question.category, value)
                    }
                  />
                );
              })}
            </div>
          </Grid>
          <Grid item xs={12} className="lessons-button-container-center">
            {!testSaved ? (
              <ButtomCustom onClick={saveTest} variant="contained" rounded>
                Guardar
              </ButtomCustom>
            ) : (
              <ButtomCustom onClick={onContinue} variant="contained" rounded>
                Continuar
              </ButtomCustom>
            )}
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

export default TrueFalseTest;
