import * as React from 'react';
import MuiButton from '@mui/material/Button';
import { styled } from '@mui/material/styles';

type ButtonProps = {
  rounded?: boolean;
};
const options = {
  shouldForwardProp: (prop) => prop !== 'rounded',
};
const Button = styled(
  MuiButton,
  options,
)<ButtonProps>(({ theme, rounded }) => ({
  borderRadius: rounded ? '24px' : null,
}));

export default Button;