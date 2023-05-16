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
import '../styles.scss';

const SelfAppraisal = ({ data }) => {
  
  const [answers, setAnswers] = useState(Array(10).fill(null));
  const [questions, setQuestions] = useState(Array(10).fill('Pregunta'));
  const [openModalWelcome, setOpenModalWelcome] = useState(true);
  const [openModalEnd, setOpenModalEnd] = useState(false);

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

  return (
    <Grid container columns={{ xs: 4, md: 12 }} spacing={2}>
      <Grid item xs={12}>
        <TestTitle title={'Autoevaluación'} color={'white'} />
      </Grid>
      <Grid item xs={12}>
        <div className="tests-container">
          {questions.map((question, index) => {
            return (
              <RadioQuestion
                key={index}
                onAnswerChange={(value) => handleAnswerChange(index, value)}
              />
            );
          })}
        </div>
      </Grid>
      <Grid item xs={12} className="lessons-button-container-center">
        <ButtomCustom onClick={handleSubmit} variant="contained" rounded>
          Continuar
        </ButtomCustom>
      </Grid>
      <AlertModal 
        open={openModalWelcome} 
        title={"Título"} 
        content="Esta es una cosa rara. Esta es una cosa rara Esta es una cosa rara Esta es una cosa rara Esta es una cosa rara" 
        buttonText={"Autoevaluación"}
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

export default SelfAppraisal;
