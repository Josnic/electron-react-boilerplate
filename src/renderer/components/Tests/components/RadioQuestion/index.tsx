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

const RadioQuestion = ({ question }) => {
  const [answer, setAnswer] = useState(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt((event.target as HTMLInputElement).value);
    setAnswer(value);
    //props.onAnswerChange(parseInt(value));
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

  return (
    <div className="question-container">
      <div className="question radio-question">
        {parse(question.pregunta)}
        <LightTooltip title={parse(question.informativo)}>
            <LiveHelpIcon color="disabled" sx={{ cursor: 'pointer' }} />
        </LightTooltip>
      </div>
      <div className="radio-container">
        <FormControl>
          <RadioGroup
            row
            name="row-radio-buttons-group"
            onChange={handleChange}
          >
            <FormControlLabel value="1" control={<Radio />} label="1" />
            <FormControlLabel value="2" control={<Radio />} label="2" />
            <FormControlLabel value="3" control={<Radio />} label="3" />
            <FormControlLabel value="4" control={<Radio />} label="4" />
            <FormControlLabel value="5" control={<Radio />} label="5" />
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  );
};

export default RadioQuestion;
