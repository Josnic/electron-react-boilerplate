import React, { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import IconButton from '@mui/material/IconButton';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import parse from 'html-react-parser';

const RadioQuestion = ({ question, scale, onAnswerChange }) => {
  const [answer, setAnswer] = useState(null);
  const [numRadios, setNumRadios] = useState(Array(scale.max).fill(0))
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt((event.target as HTMLInputElement).value);
    setAnswer(value);
    onAnswerChange(parseInt(value));
  };

  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} placement="top" />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.white,
      '&:before': {
        border: '1px solid #E6E8ED',
      },
    },
  }));

  const radios = () =>{
    const r = [];
    for (let i = scale.min; i <= scale.max; i++){
      r.push(<FormControlLabel value={i} control={<Radio />} label={i} />)
    }
    return r;
  }

  return (
    <div className="question-container">
      <div className="question radio-question">
        {parse(question.pregunta)}
        {
          question.informativo ? (
          <LightTooltip title={parse(question.informativo)}>
              <LiveHelpIcon color="disabled" sx={{ cursor: 'pointer' }} />
          </LightTooltip>
          ):(
            null
          )
        }
        
      </div>
      <div className="radio-container">
        <FormControl>
          <RadioGroup
            row
            name="row-radio-buttons-group"
            onChange={handleChange}
            key={question.pregunta}
          >
            {radios()}
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  );
};

export default RadioQuestion;
