import { Button, DialogActions, DialogTitle, Typography } from "@mui/material";
import { withTranslation } from "react-i18next";
import i18n from "i18next";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CloseIcon from '@mui/icons-material/Close';

const ModalsFooter = ({
    backButton = true, 
    backButtonText = i18n.t('GeneralBack'), 
    backFunc, 
    secondButton = true,
    secondButtonText = i18n.t('GeneralLeave'),
    secondButtonFunc, 
    }) => {
    return(
        
        <DialogActions sx={{justifyContent:'space-between'}}>
            {backButton && 
            <Button startIcon={<ArrowBackIosNewIcon sx={{fontSize:'1em !important', mt:'-2px'}} className="colorWhite" />} size="small" className="texturaBgButton varelaFontTitle" variant="contained" color="success" onClick={(e) => backFunc()}>
                {backButtonText}
            </Button>
            }
            {secondButton &&
                <Button  startIcon={<CloseIcon sx={{fontSize:'1.2em !important', mt:'-2px'}} className="colorWhite" />} size="small" className="texturaBgButton varelaFontTitle"  variant="contained" color="error" onClick={(e) => secondButtonFunc()}>
                    {secondButtonText}
                </Button>
            }
        </DialogActions>
    )
};

export default withTranslation()(ModalsFooter);