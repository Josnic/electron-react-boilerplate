import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import DOMPurify from 'dompurify';
import TextField from '@mui/material/TextField';
import ButtomCustom from '../../ButtonRound';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DownloadIcon from '@mui/icons-material/Download';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import FormControlLabel from '@mui/material/FormControlLabel';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import RadioQuestion from '../components/RadioQuestion';
import AlertModal from '../components/AlertModal';
import TestTitle from '../TestTitle';
import BarChart from '../../BarChart';
import parse from 'html-react-parser';
import { useSelector } from 'react-redux';
import { getPathCourseResource } from '../../../utils/electronFunctions';
import { sqlite3All, sqlite3Run, sqlite3InsertBulk } from '../../../helpers/Sqlite3Operations';
import exportDiscPdf from '../../../helpers/ExportPDF';
import { ToastContainer } from 'react-toastify';
import OverlayLoader from '../../OverlayLoader';
import { showToast } from '../../../utils/toast';
import { getMysqlDate } from '../../../utils/generals';
import '../styles.scss';

const RadioButtonTest = ({ data, courseCode, onFinalize, onContinue }) => {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [openModalWelcome, setOpenModalWelcome] = useState(true);
  const [openModalEnd, setOpenModalEnd] = useState(false);
  const [currentTest, setTest] = useState(null);
  const [categories, setCategories] = useState([]);
  const categoryResponseArray = useRef([]);
  const [testSaved, setTestSaved] = useState(false);
  const [unitLessons, setUnitLessons] = useState([]);
  const [maxWidthModal, setWidthModal] = useState("sm");
  const radarChartRef = useRef(null);
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

  const authState = useSelector((state) => state);

  const getLessons = async(units) => {
    console.log(`SELECT nombre, cod_unidad  FROM lecciones WHERE cod_unidad IN(${units.join("','")})`)
    const getLessonsName = await sqlite3All(
      `SELECT nombre, cod_unidad  FROM lecciones WHERE cod_unidad IN('${units.join("','")}')`
    );
    console.log(getLessonsName)
    if (getLessonsName.OK){
      setUnitLessons(getLessonsName.OK);
    }
  }


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
      const orderType = testData.preguntas_aleatorias == 1 ? ` ORDER BY RANDOM() ` : ` ORDER BY tests_preguntas_radio.orden ASC`;

      switch (testData.cod_test) {
        case 'COVI_Autoevaluacion':
          category = `unidades.nombre AS category`;
          break;

        default:
          category = `tests_categorias_preguntas.nombre AS category`;
        
      }

      const questions = await sqlite3All(
        `SELECT tests_preguntas_radio.id,
        tests_preguntas_radio.pregunta, 
        tests_preguntas_radio.informativo,
        tests_preguntas_radio.negativo,
        tests_preguntas_radio.unidad AS unidad_cod,
        tests_preguntas_radio.disc,
        unidades.nombre AS unidad,
        ${category}
        FROM tests_preguntas_radio 
        LEFT JOIN unidades ON unidades.cod_unidad = tests_preguntas_radio.unidad
        LEFT JOIN tests_categorias_preguntas ON tests_categorias_preguntas.cod_categoria = tests_preguntas_radio.categoria
        WHERE tests_preguntas_radio.cod_test = '${data.test_id}' ${orderType}`
      );

      const userId = authState && authState.user ? authState.user.email : 'test';

      const answersTest = await sqlite3All(
        `SELECT * FROM test_radio_respuestas WHERE cod_test = '${data.test_id}' AND user_id = '${userId}'`
      );
      
      console.log(questions.OK.filter(ele => ele.category == null));
      console.log(answersTest);

      if (questions.OK) {
        setQuestions(questions.OK);

        if (answersTest.OK && answersTest.OK.length > 0) {
          const answersTemp = [];
          for (let i = 0; i < questions.OK.length; i++) {
            const r = answersTest.OK.filter(
              (ele) => ele.id_pregunta == questions.OK[i].id
            )[0];
            answersTemp.push({
              category: questions.OK[i].category,
              value: r.valor,
            });
          }
          setAnswers(answersTemp);
        }else{
          setAnswers(
            new Array(questions.OK.length).fill({
              category: '',
              value: 0,
            })
          );
        }
        
        const categoryArray = [
          ...new Set(
            questions.OK.map((ele, index) => {
              return ele.category;
            })
          ),
        ];
        if (testData.cod_test == "COVI_Autoevaluacion"){
          getLessons([
            ...new Set(
              questions.OK.map((ele, index) => {
                return ele.unidad_cod;
              })
            ),
          ]);
        }
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
      content: auevResponse(),
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
                return b.value - a.value;
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

  const auevResponse = () => {
    const category = JSON.parse(JSON.stringify(categoryResponseArray.current)).sort(function (a, b) {
      return a.value - b.value;
    })[0].category;

    const unit = questions.filter(ele => ele.category == category)

    const lessons = unitLessons.filter(ele => ele.cod_unidad == unit[0].unidad_cod)

    return (
      <>
      <Typography variant="subtitle2" gutterBottom>
        Tus respuestas indican que debes enfocar mayor atención en la unidad {category} donde se tocarán los siguientes temas:
      </Typography>
      {
        lessons && lessons.length && lessons.length > 0 ? (
          <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        >
          {lessons.map((lesson, index) => (
            <ListItem
              key={index}
              disableGutters
            >
              <ListItemText primary={`${lesson.nombre}`} />
            </ListItem>
          ))}
        </List>
        ):(
          null
        )
      }
      </>
      
    )
  }

  const asertividadResponse = () => {
    const sumAnswer = answers.reduce((accumulator, object) => {
      return accumulator + object.value;
    }, 0);
    let msg = "";
    if (sumAnswer > 40){
      msg = "Necesitas mejorar tu nivel de asertividad";
    }
    if (sumAnswer >= 40 && sumAnswer <= 52){
      msg = "Enhorabuena, ¡Tienes un buen nivel de asertividad!, aunque necesitas ejercitarlo habitualmente";
    }

    if (sumAnswer >= 53) {
      msg = "¡Excelente! Tienes un muy buen nivel de asertividad, enseña a otros a avanzar";
    }
    return (
      <>
      <Typography variant="subtitle2" gutterBottom>
        {msg}
      </Typography>
      </>
      
    )
  }

  const INEMhabsocioemocResponse = () => {
    const arrayToShow = JSON.parse(JSON.stringify(categoryResponseArray.current));
    arrayToShow.sort((a,b) => b.value - a.value)
    return (
      <>
      <Typography variant="subtitle2" gutterBottom>
        {"21 a 25: Alto. Felicitaciones por tu alto nivel"}
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        {"16 a 20: Medio. Continúa potenciando el desarrollo de esta habilidad para aumentar tu bienestar emocional."}
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        {"5 a 15: Bajo. Existe oportunidad de mejorar este nivel y crecer en tus habilidades sociales."}
      </Typography>
      <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        >
          {arrayToShow && arrayToShow.map((value, index) => (
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
      </>
      
    )
  }

  const INEMnecesidadesResponse = () => {
    const arrayToShow = categoryResponseArray.current.filter(ele => ele.value < 24);
    let msg = "Eres emocionalmente sano. No es necesario trabajar en el taller práctico del Paso 2";
    if (arrayToShow.length > 0){
      const arCatText = arrayToShow.map(ele => ele.category);
      msg = "Desarrolla el taller práctico del Paso 2 para sanar tu(s) necesidad(es) de " + arCatText.join(",")
    }
    return (
      <>
      <Typography variant="subtitle2" gutterBottom>
        {msg}
      </Typography>
      </>
      
    )
  }

  const INEMautogestionResponse = () => {
    const sumAnswer = answers.reduce((accumulator, object) => {
      return accumulator + object.value;
    }, 0);

    const average = parseInt(sumAnswer / answers.length)
    return (
      <>
      {
        average < 3 ? (
          <>
            <Typography variant="subtitle2" gutterBottom>
              {"Necesitas mejorar tu autogestión emocional"}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {"¡Juntos vamos a trabajar en eso!"}
            </Typography>
          </>
        ):(
          null
        )
      }
      {
        average >= 3 && average <= 4 ? (
          <>
            <Typography variant="subtitle2" gutterBottom>
              {"Tienes una buena autogestión emocional, pero"}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {"¡Juntos podremos potenciarla!"}
            </Typography>
          </>
        ):(
          null
        )
      }

      {
        average > 4 ? (
          <>
            <Typography variant="subtitle2" gutterBottom>
              {"!Felicidades tienes una excelente autogestión emocional"}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {"No pierdas esta oportunidad de mejorarla!"}
            </Typography>
          </>
        ):(
          null
        )
      }
      
      </>
      
    )
  }

  const downloadDISCFile = async(type, str) => {

    const filePath = type == "course" ? `/disc.asar/${courseCode}/DISC_${str}.pdf` : `/disc.asar/Nivel_DISC_${str}.pdf`

    const userFullName = authState && authState.user ? authState.user.nombre_completo : 'test';

    const objText = {
      nombre_usuario: userFullName
    }

    const arObjImage = [];
    if (type == "level") {
      const img = await radarChartRef.current.getBase64Image()
      arObjImage.push({
        grafico_disc: img.imgURI,
        type: "png"
      })
    }

    exportDiscPdf(objText, arObjImage, filePath);
   
  }

  const TestDISCResponse = () => {
    const DISC = {
      D: 0,
      I: 0,
      S: 0,
      C: 0
    }

    for (let i = 0; i < answers.length; i++){
      if (answers[i].value >= 3){
        const discLetterArray = questions[i].disc.replace(/ /g,"").split(",");
        for (let j = 0; j < discLetterArray.length; j++) {
          DISC[discLetterArray[j]] = DISC[discLetterArray[j]] + answers[i].value;
        }
      }
    }

    const sortableDISC = Object.entries(DISC)
    .sort(([,a],[,b]) => b - a)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    const newKeys = Object.keys(sortableDISC);

    return (
      <>
      <Container maxWidth="sm">
      <Box>
        <BarChart 
          ref={radarChartRef}
          title={'DISC'}
          series={[
            {
              name: "",
              data: Object.values(DISC)
            }
          ]}
          categories={['D','I','S','C']}
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={()=>{
            downloadDISCFile("level", `${newKeys[0]}${newKeys[1]}`)
        }} startIcon={<DownloadIcon />} variant="contained">Descargar Nivel DISC</Button>
        <Button onClick={()=>{
            downloadDISCFile("course", `${newKeys[0]}`)
        }} startIcon={<DownloadIcon />} variant="contained">Descargar DISC {newKeys[0]}</Button>
      </Box>
      </Container>
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

  const INEM_asertividad_Response = async() => {
    setModalEndData({
      title: 'NIVEL DE ASERTIVIDAD',
      content: asertividadResponse(),
      buttonText: 'Aceptar',
    });
    setOpenModalEnd(true);
  }

  const INEM_hab_socioemoc_Response = async() => {
    setModalEndData({
      title: 'NIVEL DE HABILIDADES SOCIOEMOCIONALES',
      content: INEMhabsocioemocResponse(),
      buttonText: 'Aceptar',
    });
    setOpenModalEnd(true);
  }

  const INEM_necesidades_Response = async() => {
    setModalEndData({
      title: 'NECESIDADES',
      content: INEMnecesidadesResponse(),
      buttonText: 'Aceptar',
    });
    setOpenModalEnd(true);
  }

  const INEM_autogestion_Response = async() => {
    setModalEndData({
      title: 'AUTOGESTIÓN',
      content: INEMautogestionResponse(),
      buttonText: 'Aceptar',
    });
    setOpenModalEnd(true);
  }

  const Test_DISC_Response = async() => {
    setWidthModal("lg");
    setModalEndData({
      title: 'NIVEL DISC',
      content: TestDISCResponse(),
      buttonText: 'Cerrar',
    });
    setOpenModalEnd(true);
  }
  

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

  const insertDataTest = async () => {

    const userId =
        authState && authState.user ? authState.user.email : 'test';
      const currentDate = getMysqlDate();
      const arrayValues = [];

      for (let i = 0; i < answers.length; i++) {
        arrayValues.push([
          userId,
          currentTest.cod_test,
          questions[i].id,
          answers[i].value,
          currentDate,
        ]);
      }

    const deleteBefore = await sqlite3Run(
      `DELETE FROM test_radio_respuestas WHERE cod_test = '${currentTest.cod_test}' AND user_id = '${userId}'`,
      []
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

    const result = await sqlite3InsertBulk(
      'INSERT INTO test_radio_respuestas VALUES (?,?,?,?,?)',
      arrayValues
    );

    onFinalize(true);
    console.log(deleteBefore, result, result_sublesson)
  }


  const saveTest = async () => {
    const empty = answers.filter((ele) => ele.value == 0);
    if (empty.length > 0) {
      showToast('Completa todo el formulario');
    } else {
      setOpen(true);
      await insertDataTest();
      switch (currentTest.cod_test) {
        case 'COVI_Autoevaluacion':
          resultByCategory();
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

          case "INEM_asertividad":
            resultByCategory();
            INEM_asertividad_Response();
          break;

          case "INEM_hab_socioemoc":
            resultByCategory();
            INEM_hab_socioemoc_Response();
          break;

          case "INEM_necesidades":
            resultByCategory();
            INEM_necesidades_Response();
          break;

          case "INEM_autogestion":
            INEM_autogestion_Response();
          break;

          case "Test_DISC":
            Test_DISC_Response();
          break;
      }

      setTimeout(() => {
        setOpen(false);
        setTestSaved(true);
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
                    defaultValue={answers[index] && answers[index].value ? answers[index].value: null}
                    onAnswerChange={(value) => handleAnswerChange(index, question.category, value)}
                  />
                );
              })}
            </div>
          </Grid>
          <Grid item xs={12} className="lessons-button-container-center">
            {
              !testSaved ? (
                <ButtomCustom onClick={saveTest} variant="contained" rounded>
                  Guardar
                </ButtomCustom>
              ):(
                <ButtomCustom onClick={onContinue} variant="contained" rounded>
                  Continuar
                </ButtomCustom>
              )
            }
            
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
              setWidthModal("sm");
              setOpenModalEnd(false);
              radarChartRef.current = null;
            }}
            maxWidth={maxWidthModal}
          />
        </>
      ) : null}
      <ToastContainer />
    </Grid>
  );
};

export default RadioButtonTest;
