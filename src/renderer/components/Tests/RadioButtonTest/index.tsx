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
import RadioQuestion from '../components/RadioQuestion';
import AlertModal from '../components/AlertModal';
import TestTitle from '../TestTitle';
import parse from 'html-react-parser';
import { getPathCourseResource } from '../../../utils/electronFunctions';
import { sqlite3All } from '../../../helpers/Sqlite3Operations';

import '../styles.scss';

const RadioButtonTest = ({ data, courseCode }) => {
  
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [openModalWelcome, setOpenModalWelcome] = useState(true);
  const [openModalEnd, setOpenModalEnd] = useState(false);

  const [modalInitData, setModalInitData] = useState({
    content: "",
    buttonText: ""
  });

  const handleAnswerChange = (index, value) => {
    console.log(index, value);
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const total = answers.reduce((a, b) => a + b);
    alert(`Tu calificación total es: ${total}`);
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
          finalPath = await getPathCourseResource(path + '/img/' + images[i]);
        }
        content = content.replace(images[i], finalPath);
      }
    }
    return content;
  };

  const loadTestData = async() => {
    const test = await sqlite3All(
      `SELECT * FROM tests WHERE cod_test = '${data.test_id}' LIMIT 1`
    );
    console.log(test)
    if (test.OK){
      const testData = test.OK[0];
      if (testData.encabezado && testData.encabezado != '') {
        let htmlContent = testData.encabezado;
        const path = courseCode + '.asar';
        if (testData.img_encabezado && testData.img_encabezado != '') {
          htmlContent = await imagePaths(htmlContent, testData.img_encabezado, path);
        }
        setModalInitData({
          content: htmlContent,
          buttonText: testData.texto_boton && testData.texto_boton != "" ? testData.texto_boton : "Aceptar"
        })
      }
    }

    const questions = await sqlite3All(
      `SELECT * FROM tests_preguntas_radio WHERE cod_test = '${data.test_id}' ORDER BY orden ASC`
    );

    if (questions.OK) {
      setQuestions(questions.OK);
      setAnswers(new Array(questions.OK.length).fill(null));
    }
  }

  useEffect(()=>{
    if (data) {
      loadTestData();
    }
  }, [data])

  return (
    <Grid container columns={{ xs: 4, md: 12 }} spacing={2}>
      <Grid item xs={12}>
        {
          data ? (
            <TestTitle title={data.nombre} color={'white'} />
          ):(
            null
          )
        }
      </Grid>
      <Grid item xs={12}>
        <div className="tests-container">
          {questions.map((question, index) => {
            return (
              <RadioQuestion
                question={question}
                key={index}
                onAnswerChange={(value) => handleAnswerChange(index, value)}
              />
            );
          })}
        </div>
      </Grid>
      <Grid item xs={12} className="lessons-button-container-center">
        <ButtomCustom onClick={handleSubmit} variant="contained" rounded>
          Guardar
        </ButtomCustom>
      </Grid>
      <AlertModal 
        open={openModalWelcome} 
        title={""} 
        content={parse(modalInitData.content)}
        buttonText={modalInitData.buttonText}
        onButtonClick={()=>{
          setOpenModalWelcome(false);
        }}
      />
      <AlertModal 
        open={openModalEnd} 
        title={"Título"} 
        content="Esta es una cosa rara. Esta es una cosa rara Esta es una cosa rara Esta es una cosa rara Esta es una cosa rara" 
        buttonText={"Aceptar"}
        onButtonClick={()=>{
          setOpenModalEnd(false);
        }}
      />
    </Grid>
  );
};

export default RadioButtonTest;
