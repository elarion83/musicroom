import { Box, Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { formatNumberToMinAndSec } from "../../services/utils";

const SearchResultItemNew = ({ duration,image, title, source, platformId, album = null, addedBy, uid, url, date = null, channelOrArtist = null, addItemToPlaylist }) => {
   
    return (
       <Grid className="searchResultItem new" item xs={6} sm={4} md={3} xl={2}>
        <Card sx={{ cursor:'pointer', position:'relative' }} title={title}
         onClick={(e) => addItemToPlaylist({title:title,deleted:false, source:source, platformId:platformId, url:url, visuel:image, addedBy: addedBy, vote: {'up':0,'down':0}, hashId: uid})}>
            <CardMedia
                sx={{ width:'auto',height:'110px' }}
                image={image}
                title={title}
            />
            <CardContent className='resultBoxContent' sx={{bgcolor:'var(--white)',position:'relative',mt:'-42px', padding:'5px 5px 0px 5px !important',flexGrow:1}}>
                <Typography className="fontFamilyNunito" sx={{ ml:0, mb: 0, fontSize: '9px', fontWeight:'lighter'}}><b>{channelOrArtist} </b></Typography>

                <Typography gutterBottom component="div" fontSize='12px'  className="resulttitle varelaFontTitle">
                {title}
                </Typography>
                <Box sx={{position:'relative'}}>
                    {duration != null && <Typography sx={{ ml:0, mb: 0, fontSize: '10px' }}><b>{formatNumberToMinAndSec(duration)} </b></Typography>}
                </Box>                                

            </CardContent>
            <Typography sx={{ padding:'0px 5px', fontSize: '10px', textTransform:'uppercase',background:'var(--white)', position:'absolute', top:'5px', right:'5px' }}><b>{date} </b></Typography>
        </Card>
    </Grid>
    )
};

export default SearchResultItemNew;