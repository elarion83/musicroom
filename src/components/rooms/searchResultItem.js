import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { formatNumberToMinAndSec } from "../../services/utils";

const SearchResultItem = ({ duration = null,image, title,description = '', source, platformId, album = null, addedBy, uid, url, date = null, channelOrArtist = null, addItemToPlaylist }) => {
   
    return (
       <Grid className="searchResultItem new" item xs={6} sm={4} md={3} xl={2}>
        <Card sx={{ cursor:'pointer', position:'relative' }} title={title}
         onClick={(e) => addItemToPlaylist({title:title,deleted:false,channelOrArtist:channelOrArtist, source:source,description:description,duration: duration ? formatNumberToMinAndSec(duration): null, platformId:platformId, url:url, visuel:image, addedBy: addedBy, vote: {'up':0,'down':0}, hashId: uid})}>
            <CardMedia
                sx={{ width:'auto',height:'110px' }}
                image={image}
                title={title}
            />
            <CardContent className='resultBoxContent' sx={{bgcolor:'var(--white)',position:'relative',mt:'-42px', padding:'2px 5px 0px 5px !important',flexGrow:1}}>
                <Typography className="fontFamilyNunito" sx={{ ml:0, mb: 0, fontSize: '9px', fontWeight:'lighter'}}><b>{channelOrArtist} </b></Typography>

                <Typography gutterBottom component="div" fontSize='12px' sx={{p:0}} className="resulttitle max-lined max-line-3 varelaFontTitle">
                {title}
                </Typography>                           
                {duration != null && <Typography sx={{ padding:'0px 5px', fontSize: '10px',background:'var(--white)', position:'absolute', top:'-15px', right:'0px' }}><b>{formatNumberToMinAndSec(duration)} </b></Typography>}

            </CardContent>

             <Typography sx={{ padding:'0px 5px', fontSize: '10px', textTransform:'uppercase',background:'var(--white)', position:'absolute', top:'0px', right:'0px' }}><b>{date} </b></Typography>
        </Card>
    </Grid>
    )
};

export default SearchResultItem;