import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { Box, Typography } from '@mui/material';
import { withTranslation } from "react-i18next";
import SwipeUpIcon from '@mui/icons-material/SwipeUp';
const RoomTutorial = ({layout,slideOutProp}) => {
    return(
        <>
        <Box    
        sx={{bottom:slideOutProp}}
            className={"roomTutorialContainer "+layout+" phoneAndTablet animate__animated animate__fadeInUp animate__slow"}>
            <Typography className="fontFamilyNunito" 
            >Swipe pour rechercher ! </Typography>
            <SwipeUpIcon className="SlideUp"/>
        </Box>
        <Box 
        sx={{bottom:slideOutProp}}
            className="roomTutorialContainer desktop animate__animated animate__fadeInUp animate__slow">
            <Typography className="fontFamilyNunito" sx={{mt:2}}>Clique pour rechercher ! </Typography>
            <KeyboardDoubleArrowDownIcon className="ClickUp"/>
        </Box>
        </>
    )
};

export default withTranslation()(RoomTutorial);