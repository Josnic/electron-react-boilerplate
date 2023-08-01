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
import {
  sqlite3InsertBulk,
  sqlite3All,
  sqlite3Run,
} from '../../helpers/Sqlite3Operations';
import { useSelector } from 'react-redux';
import { getMysqlDate } from '../../utils/generals';
import { generateIamPdf } from '../../helpers/formPdf';
import { showToast } from '../../utils/toast';
import AlertModal from '../Tests/components/AlertModal';
import './styles.scss';

const FormQuestion = ({ data, courseCode, onFinalize, onContinue }) => {
  const [questions, setQuestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [openModalEnd, setOpenModalEnd] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [header, setHeader] = useState(null);
  const [footer, setFooter] = useState(null);
  const [formData, setFormData] = useState(null);
  const [formSaved, setFormSaved] = useState(false);
  const authState = useSelector((state) => state);
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

  const loadFormDetails = async () => {
    setFormSaved(false);
    const form = await sqlite3All(
      `SELECT * FROM formularios WHERE cod_formulario = '${data.cod_formulario}' LIMIT 1`
    );
    console.log(form);
    setFormData(form.OK[0]);
    const questions = await sqlite3All(
      `SELECT * FROM formularios_detalles WHERE cod_formulario = '${data.cod_formulario}' ORDER BY orden ASC`
    );

    const userId = authState && authState.auth.user ? authState.auth.user.email : 'test';

    const answersForm = await sqlite3All(
      `SELECT * FROM formulario_respuesta WHERE cod_formulario = '${data.cod_formulario}' AND user_id = '${userId}'`
    );

    console.log(answersForm);

    console.log(questions);
    if (questions.OK) {
      setQuestions(questions.OK);
      if (answersForm.OK && answersForm.OK.length > 0) {
        const answersTemp = [];
        for (let i = 0; i < questions.OK.length; i++) {
          const r = answersForm.OK.filter(
            (ele) => ele.id_pregunta == questions.OK[i].id_pregunta
          )[0];
          answersTemp.push({
            questionId: r.id_pregunta,
            answerText: r.respuesta,
            index: i,
          });
        }
        setAnswers(answersTemp);
      } else {
        //pregunta heredada
        const questionSAr = questions.OK.filter(
          (ele) => ele.id_pregunta_viene > 0
        );
        if (questionSAr.length > 0) {
          const respTemp = Array(questions.OK.length).fill({
            questionId: null,
            answerText: '',
            index: null,
          });
          const ids = questionSAr.map((ele) => ele.id_pregunta);
          const question2 = await sqlite3All(
            `SELECT * FROM formulario_respuesta WHERE cod_formulario = '${
              data.cod_formulario
            }' AND id_pregunta IN (${ids.join(',')})`
          );
          console.log(question2);
          if (question2.OK && question2.OK.length > 0) {
            for (let i = 0; i < question2.OK.length; i++) {
              const indext = questions.OK.findIndex(
                (ele) => ele.id_pregunta == question2.OK[i].id_pregunta
              );
              respTemp[indext] = {
                questionId: question2.OK[i].id_pregunta,
                answerText: question2.OK[i].respuesta,
                index: indext,
              };
            }
          }
          setAnswers(respTemp);
        } else {
          setAnswers(
            Array(questions.OK.length).fill({
              questionId: null,
              answerText: '',
              index: null,
            })
          );
        }
      }
    } else {
      setAnswers([]);
      setQuestions([]);
    }
    const path = courseCode;
    if (form.OK && form.OK.length && form.OK.length == 1) {
      if (form.OK[0].encabezado && form.OK[0].encabezado != '') {
        let htmlHeader = form.OK[0].encabezado;
        if (form.OK[0].img_encabezado && form.OK[0].img_encabezado != '') {
          htmlHeader = await imagePaths(
            htmlHeader,
            form.OK[0].img_encabezado,
            path
          );
        }
        setHeader(htmlHeader);
      } else {
        setHeader(null);
      }

      if (form.OK[0].pie && form.OK[0].pie != '') {
        let htmlFooter = form.OK[0].pie;
        if (form.OK[0].img_pie && form.OK[0].img_pie != '') {
          htmlFooter = await imagePaths(htmlFooter, form.OK[0].img_pie, path);
        }
        setFooter(htmlFooter);
      } else {
        setFooter(null);
      }
    }
  };

  useEffect(() => {
    if (data) {
      loadFormDetails();
    }
  }, [data]);

  useEffect(() => {
    setAnswers([]);
    setQuestions([]);
    setHeader(null);
    setFooter(null);
    setFormSaved(false);
  }, []);

  useEffect(() => {
    console.log(answers);
  }, [answers]);

  const handleAnswer = (event, index) => {
    const oldState = JSON.parse(JSON.stringify(answers));
    oldState[index].questionId = questions[index].id_pregunta;
    oldState[index].answerText = event.target.value.trim();
    oldState[index].index = index;
    setAnswers(oldState);
  };

  const tranformDataToPdf = () => {
    const array = [];

    for (let i = 0; i < answers.length; i++) {
      array.push({
        question: questions[answers[i].index].pregunta,
        answer: answers[i].answerText,
      });
    }

    return array;
  };

  const saveForm = async () => {
    const empty = answers.filter((ele) => ele.answerText == '');
    if (empty.length > 0) {
      showToast('Completa todo el formulario');
    } else {
      setOpen(true);

      const userId =
        authState && authState.auth.user ? authState.auth.user.email : 'test';
      const currentDate = getMysqlDate();
      const arrayValues = [];

      for (let i = 0; i < answers.length; i++) {
        arrayValues.push([
          userId,
          formData.cod_formulario,
          answers[i].questionId,
          answers[i].answerText,
          currentDate,
        ]);
      }

      const deleteBefore = await sqlite3Run(
        `DELETE FROM formulario_respuesta WHERE cod_formulario = '${data.cod_formulario}' AND user_id = '${userId}'`,
        []
      );
      const result = await sqlite3InsertBulk(
        'INSERT INTO formulario_respuesta VALUES (?,?,?,?,?)',
        arrayValues
      );

      const validate = await sqlite3All(`SELECT * FROM sublecciones_vistas WHERE user_id = '${userId}' AND subleccion_id = '${data.id}'`)
   
      if (validate.OK){
        if (validate.OK.length > 0){
          const result_sublesson = await sqlite3Run(
            `UPDATE sublecciones_vistas SET num_vista = num_vista + 1, ultima_fecha = '${getMysqlDate()}' WHERE user_id = '${userId}' AND subleccion_id = '${data.id}'`, 
            []
          );
        }else{
          const result_sublesson = await sqlite3Run(
            "INSERT INTO sublecciones_vistas VALUES (?,?,?,?)", 
            [userId, data.id, getMysqlDate(), 1]
          );
        }
      }

      console.log(result);

      setTimeout(() => {
        setOpen(false);
        setFormSaved(true);
        onFinalize();
        if (formData.texto_boton && formData.texto_boton != '') {
          setOpenModalEnd(true);
        }
      }, 1000);
    }
  };

  const ButtonDownload = () => {
    return (
      <ButtomCustom
        variant="contained"
        onClick={async () => {
          const title =
            data.tipo == 'T2'
              ? 'Yo Soy'
              : data.tipo == 'C'
              ? 'MI PROYECTO DE VIDA'
              : '';
          await generateIamPdf(title, tranformDataToPdf());
        }}
        rounded
      >
        {formData.texto_boton}
      </ButtomCustom>
    );
  };

  return (
    <Grid container columns={{ xs: 4, md: 12 }} spacing={2}>
      <OverlayLoader open={open} />
      <Grid item xs={12}>
        {header ? <div>{parse(header)}</div> : null}
      </Grid>
      <Grid item xs={12}>
        <div className="questions-container" key={data.cod_formulario}>
          {questions && questions.length > 0 ? (
            <div key={'container'}>
              {questions.map((question, index) => (
                <div key={question.id_pregunta} className="question-container-form">
                  <div className="question">
                    <div>{parse(question.pregunta)}</div>
                  </div>
                  <div className="answer-container" key={'answer' + index}>
                    <FormControl sx={{ minWidth: 120, width: '95%' }}>
                      <TextField
                        id="outlined-multiline-static"
                        label=""
                        multiline={
                          question.unilinea && question.unilinea == 1
                            ? false
                            : true
                        }
                        key={question.id_pregunta}
                        rows={3}
                        defaultValue={
                          answers[index] && answers[index].answerText
                            ? answers[index].answerText
                            : ''
                        }
                        onChange={(event) => {
                          handleAnswer(event, index);
                        }}
                      />
                    </FormControl>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </Grid>

      <Grid item xs={12}>
        {footer ? <div>{parse(footer)}</div> : null}
      </Grid>

      <Grid item xs={12} className="lessons-button-container-center">
        {!formSaved ? (
          <ButtomCustom
            variant="contained"
            onClick={() => {
              saveForm();
            }}
            rounded
          >
            Guardar
          </ButtomCustom>
        ) : (
          <ButtomCustom
            variant="contained"
            onClick={() => {
              onContinue();
            }}
            rounded
          >
            Continuar
          </ButtomCustom>
        )}
      </Grid>
      <ToastContainer />
      {formData && formData.texto_boton && formData.texto_boton != '' ? (
        <AlertModal
          open={openModalEnd}
          title={''}
          content={ButtonDownload()}
          buttonText={'Cerrar'}
          onButtonClick={() => {
            setOpenModalEnd(false);
          }}
        />
      ) : null}
    </Grid>
  );
};

export default FormQuestion;
