import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3)
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.mode === "light" ? "#FFF6E7" : "#FFF6E7",
    border: "1px solid #FFA000",
    fontSize: 14,
    fontWeight: 500,
    minWidth: "100%",
    fontFamily: ['Roboto', 'Arial'].join(','),
    padding: "5px 12px",
    margin: "4px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow"
    ]),
    // Use the system font instead of the default Roboto font.
  }
}));

const CustomTextField = styled((props) => (
  <TextField InputProps={{ disableUnderline: true }} {...props} />
))(({ theme }) => ({
  '& .MuiFilledInput-root': {
    border: '1px solid #FFA000',
    overflow: 'hidden',
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 500,
    minWidth: "100%",
    backgroundColor: theme.palette.mode === 'light' ? '#FFF6E7' : '#FFF6E7',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '&.Mui-focused': {
      backgroundColor: 'transparent',
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

export default function CustomizedInputs(props) {
  const { label, value, id, readOnly } = props;

  return (
    <>
    {readOnly ?
      <>
      {label === null ?? 
        <InputLabel shrink htmlFor="bootstrap-input">
          Bootstrap
        </InputLabel>
      }
        <BootstrapInput 
          defaultValue={value ? value : 'Input text here...'} 
          id={id ? id : 'reddit-input'} 
          style ={{width: '100%'}}
          
        />
      </>
      :
      <CustomTextField
        label={label ? label : ' '}
        defaultValue={value ? value : 'Input text here...'}
        id={id ? id : 'reddit-input'}
        variant="filled"
        style={{}}
        fullWidth
      />
    }
    </>
  );
}