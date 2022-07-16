import { Dialog, DialogContent, DialogTitle, Typography, IconButton, Box } from '@mui/material';
import React from 'react'
import CloseIcon from '@mui/icons-material/Close';

/* CODIGO EXTRAIDO DE MI PROYECTO - TEACHERSOFT */

export default function Popup(props) {

  const { title, children, openPopup, setOpenPopup, openPopupHandler, handleClose, size, noClose } = props;
  return (
    // Outer invisible box
    <Dialog open={openPopup} onClose={handleClose}
      maxWidth= {size ? `${size}` : "md"}
      fullWidth
      sx={{
        minHeight: "400px",
        zIndex: 999999,
        '& .MuiDialog-paper': {
          // position: 'absolute',
          top: 5
        }
      }}
    >
      <Box maxWidth = 'stretch'
          maxHeight = 'stretch'
          sx={{ backgroundColor: 'secondary.main' }}>
      <DialogTitle sx={{paddingRight: 0 }} color = 'secondary.contrastText'>
        <div style={{ display: 'flex', alignItems: "flexStart" }}>
          <Typography align = 'left' variant="h4" style={{flexGrow:1}}>
            {title}
          </Typography>
          { noClose ? <></>
            :
            <IconButton
              color="secondary_white"
              onClick={() => {openPopupHandler ? openPopupHandler.current = false : setOpenPopup(false)}}
            >
              <CloseIcon/>
            </IconButton>
          }
        </div>
      </DialogTitle>
      </Box>
      <DialogContent dividers>
        {children}
      </DialogContent>
    </Dialog>
  )
}