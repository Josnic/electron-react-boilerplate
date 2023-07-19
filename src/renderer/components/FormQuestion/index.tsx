import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import DOMPurify from 'dompurify';
import TextField from '@mui/material/TextField';
import ButtomCustom from '../ButtonRound';
import FormControl from '@mui/material/FormControl';
import parse from 'html-react-parser';
import { ToastContainer } from 'react-toastify';
import OverlayLoader from '../../components/OverlayLoader';
import { getPathCourseResource } from '../../utils/electronFunctions';
import { sqlite3All } from '../../helpers/Sqlite3Operations';
import { showToast } from '../../utils/toast';

import "./styles.scss";

const FormQuestion = ({ data, courseCode }) => {
  const [questions, setQuestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [header, setHeader] = useState(null);
  const [footer, setFooter] = useState(null);

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

  const loadFormDetails = async () => {
    const form = await sqlite3All(
      `SELECT * FROM formularios WHERE cod_formulario = '${data.cod_formulario}' LIMIT 1`
    );
    const questions = await sqlite3All(
      `SELECT * FROM formularios_detalles WHERE cod_formulario = '${data.cod_formulario}' ORDER BY orden ASC`
    );
    console.log(questions)
    if (questions.OK) {
        setQuestions(questions.OK);
        setAnswers(Array(questions.OK.length).fill({
          questionId: null,
          answerText: ""
        }))
    }else{
      setQuestions([]);
    }
    const path = courseCode;
    if (form.OK && form.OK.length && form.OK.length == 1) {
      if (form.OK[0].encabezado && form.OK[0].encabezado != '') {
        let htmlHeader = form.OK[0].encabezado;
        if (form.OK[0].img_encabezado && form.OK[0].img_encabezado != '') {
          htmlHeader = await imagePaths(htmlHeader, form.OK[0].img_encabezado, path);
        }
        setHeader(htmlHeader);
      }else{
        setHeader(null);
      }

      if (form.OK[0].pie && form.OK[0].pie != '') {
        let htmlFooter = form.OK[0].pie;
        if (form.OK[0].img_pie && form.OK[0].img_pie != '') {
          htmlFooter = await imagePaths(htmlFooter, form.OK[0].img_pie, path);
        }
        setFooter(htmlFooter);
      }else{
        setFooter(null);
      }
    }
  };

  useEffect(() => {
    if (data) {
      loadFormDetails();
    }
  }, [data]);

  useEffect(()=>{
    setHeader(null);
    setFooter(null);
  },[])


  useEffect(()=>{
    console.log(answers)
  },[answers])

  const handleAnswer = (event, index) => {
    const oldState = JSON.parse(JSON.stringify(answers));
    oldState[index].questionId = questions[index].id_pregunta;
    oldState[index].answerText = (event.target.value).trim()
    setAnswers(oldState);
  }

  const saveForm = async()=> {
    const empty = answers.filter(ele => ele.answerText == "");
    if (empty.length > 0){
      showToast("Completa todo el formulario");
    }else{
      setOpen(true);

      setTimeout(()=>{
        setOpen(false);
      },1000)
    }
  }

  return (
    <Grid container columns={{ xs: 4, md: 12 }} spacing={2}>
      <OverlayLoader open={open} />
      <Grid item xs={12}>
        {header ? <div>{parse(header)}</div> : null}
      </Grid>
      <Grid item xs={12}>
        <div className="questions-container">
            {
                questions && questions.length > 0 ? (
                    <div key={"container"}>
                    {
                        questions.map((question, index) => (
                            <div key={question.id} className='question-container-form'>
                                <div className="question">
                                    <div>{parse(question.pregunta)}</div>
                                </div>
                                <div className="answer-container" key={"answer"+index}>
                                    <FormControl sx={{ minWidth: 120, width: '95%' }}>
                                      <TextField
                                          id="outlined-multiline-static"
                                          label=""
                                          multiline
                                          rows={3}
                                          defaultValue=""
                                          onChange={(event)=> {
                                            handleAnswer(event, index);
                                          }}
                                      />
                                    </FormControl>
                                </div>
                            </div>
                        ))
                    }
                    </div>
                ):(
                    null
                )
            }
        </div>
      </Grid>

      <Grid item xs={12}>
        {footer ? <div>{parse(footer)}</div> : null}
      </Grid>

      <Grid item xs={12} className="lessons-button-container-center">
        <ButtomCustom variant="contained" onClick={()=>{saveForm()}} rounded>
          Continuar
        </ButtomCustom>
      </Grid>
      <ToastContainer />
    </Grid>
  );
};

export default FormQuestion;
