import * as React from 'react';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import parse from 'html-react-parser';

const TrueFalseQuestion = ({ question, scale, onAnswerChange }) => {
  const [alignment, setAlignment] = React.useState<string | null>(null);

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    onAnswerChange(newAlignment);
    setAlignment(newAlignment);
  };

  return (
    <div className="question-container">
      <div className="question toggle-question">
        {parse(question.pregunta)}
        {question.informativo ? (
          <LightTooltip title={parse(question.informativo)}>
            <LiveHelpIcon color="disabled" sx={{ cursor: 'pointer' }} />
          </LightTooltip>
        ) : null}
      </div>
      <div className="toggle-container">
        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={handleAlignment}
          color="primary"
        >
          <ToggleButton value="1">Verdadero</ToggleButton>
          <ToggleButton value="0">Falso</ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
  );
};

export default TrueFalseQuestion;
