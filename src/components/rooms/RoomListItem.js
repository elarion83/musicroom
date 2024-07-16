import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { getCleanRoomId } from "../../services/utilsRoom";
import { withTranslation } from "react-i18next";
import { timestampToDateoptions } from "../../services/utilsArray";
import { getReadeableDistance } from "../../services/utils";
import { DateRange, LocationOn, PlaylistPlay } from "@mui/icons-material";

const RoomListItem = ({t,key, room,joinRoom, layout = "userList"}) => {
    var cleanRoomId = getCleanRoomId(room.id);
    var createdDate = new Date(room.creationTimeStamp).toLocaleDateString('fr-FR', timestampToDateoptions);
    var thumbUrl = room.playlistEmpty ? 'img/logo__new.png' : room.playlistUrls[room.playing].visuel;

    return (
        <Grid item xs={12} sm={6} md={4} lg={4} key={key} onClick={(e) => joinRoom(cleanRoomId)} sx={{flexShrink:0,flexGrow:0,pl:0,pr:0, cursor:'pointer'}} className="animate__animated animate__fadeIn
animate__fast">
            <Card className="card" sx={{position:'relative',height:'110px', width:'96% !important',mb:0.5, ml:'auto', mr:'auto'}}>
                <CardMedia
                    className="card-media"
                    image={thumbUrl}
                    title="Playlist Thumbnail"
                    sx={{height:'110px',position:'absolute', top:0, left:0, width:'100%'}}
                />
                <CardContent sx={{display:'flex',flexWrap:'wrap',position:'absolute', height:'100%',top:0,left:0, width:'100%',padding:'0 !important', justifyContent:'space-evenly', bgcolor:'rgba(0,0,0,0.8)'}}  className='animate__animated animate__fadeInUp animate__fast'>
                    <Typography 
                        sx={{flexBasis:'100%',bgcolor:'var(--main-color-transp)', maxHeight: '25px', textAlign:'center'}} 
                        className="colorWhite varelaFontTitle textCapitalize animate__animated animate__fadeInDown texturaBgButton animate__delay-1s animate__fast">
                        {room.id}
                    </Typography>
                    {layout === 'userList' &&  
                        <>
                            <Grid sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                <DateRange className='colorWhite' fontSize="medium" />
                                <Typography className='colorWhite fontFamilyNunito' variant="caption">
                                    {createdDate}
                                </Typography>
                            </Grid>
                            <Grid sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                <PlaylistPlay className='colorWhite' fontSize="medium" />
                                <Typography className='colorWhite fontFamilyNunito' variant="caption">
                                    {room.playlistUrls.length}
                                </Typography>
                            </Grid>
                        </>
                    }
                    {layout === 'nearbyList' &&  <Grid sx={{display:'flex', width:'100%', flexDirection:'column', alignItems:'center'}}>
                            <LocationOn className='colorWhite' fontSize="medium" sx={{mb:0.5}} />
                            <Typography className='colorWhite fontFamilyNunito' sx={{textAlign:'center', pl:1, pr:1}} fontSize='small'>
                                à <span>{getReadeableDistance(room.distance)}</span> de vous.
                            </Typography>
                        </Grid>
                    }
                </CardContent>
              
            </Card>
        </Grid>
       
    )
};

export default withTranslation()(RoomListItem);