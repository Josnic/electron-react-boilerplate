import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import DOMPurify from 'dompurify';
import TextField from '@mui/material/TextField';
import ButtomCustom from '../ButtonRound';
import FormControl from '@mui/material/FormControl';
import parse from 'html-react-parser';

import { getPathCourseResource } from '../../utils/electronFunctions';
import { sqlite3All } from '../../helpers/Sqlite3Operations';

import "./styles.scss";

const FormQuestion = ({ data, courseCode }) => {
  const [formData, setFormData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [header, setHeader] = useState(null);
  const [footer, setFooter] = useState(null);

  const html = `lorem <b onmouseover="alert('mouseover');">ipsum  ioihio pohpioh pohjpoij pojpoj pohiop pohpoi pojhpoi pòjpo pojhpo pohpoi  umi psumv ipsum vv ipsum </b>`;
  const sanitizedData = () => ({
    __html: DOMPurify.sanitize(html),
  });

  const imagePaths = async (html, stringImages) => {
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
    }
    const path = courseCode + '.asar';
    if (form.OK && form.OK.length && form.OK.length == 1) {
      if (form.OK[0].encabezado && form.OK[0].encabezado != '') {
        let htmlHeader = form.OK[0].encabezado;
        if (form.OK[0].img_encabezado && form.OK[0].img_encabezado != '') {
          htmlHeader = await imagePaths(htmlHeader, form.OK[0].img_encabezado);
        }
        setHeader(htmlHeader);
      }

      if (form.OK[0].pie && form.OK[0].pie != '') {
        let htmlFooter = form.OK[0].pie;
        if (form.OK[0].img_pie && form.OK[0].img_pie != '') {
          htmlFooter = await imagePaths(htmlFooter, form.OK[0].img_pie);
        }
        setFooter(htmlFooter);
      }
    }
  };

  useEffect(() => {
    if (data) {
      loadFormDetails();
    }
  }, [data]);

  return (
    <Grid container columns={{ xs: 4, md: 12 }} spacing={2}>
      <Grid item xs={12}>
        {header ? <div>{parse(header)}</div> : null}
      </Grid>
      <Grid item xs={12}>
        <div className="questions-container">
            {
                questions && questions.length > 0 ? (
                    <>
                    {
                        questions.map((question) => (
                            <div key={question.id} className='question-container'>
                                <div className="question">
                                    <div>{parse(question.pregunta)}</div>
                                </div>
                                <div className="answer-container">
                                    <FormControl sx={{ minWidth: 120, width: '100%' }}>
                                    <TextField
                                        id="outlined-multiline-static"
                                        label=""
                                        multiline
                                        rows={4}
                                        defaultValue=""
                                    />
                                    </FormControl>
                                </div>
                            </div>
                        ))
                    }
                    </>
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
        <ButtomCustom variant="contained" rounded>
          Continuar
        </ButtomCustom>
      </Grid>
    </Grid>
  );
};

export default FormQuestion;
