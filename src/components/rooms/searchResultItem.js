import { Card, CardContent, CardMedia, Grid, ListItemButton, ListItemText, Typography } from "@mui/material";

const SearchResultItem = ({ image, title, source, platformId, album = null, addedBy, uid, url, date = null, channelOrArtist = null, addItemToPlaylist }) => {
   
    return (
        <Grid className="searchResultItem" item xs={6} sm={4} md={3} xl={2}>
            <Card sx={{ maxWidth: 345, cursor:'pointer' }}
            onClick={(e) => addItemToPlaylist({title:title, source:source, platformId:platformId, url:url, visuel:image, addedBy: addedBy, vote: {'up':0,'down':0}, hashId: uid})}>
                <CardMedia
                    sx={{ height: 140 }}
                    image={image}
                    title={title}
                />
                <CardContent sx={{bgcolor:'var(--white)', flexGrow:1}}>
                    <Typography gutterBottom component="div" className="varelaFontTitle textEllipsis">
                    {title.substring(0, 50)}
                    </Typography>
                    <Typography>
                        {album != null && <Typography sx={{ ml:0, mb: 0, fontSize: '10px', textTransform:'uppercase' }}>Album <b>{album} </b></Typography>}
                        {date != null && <Typography sx={{ ml:0, mb: 0, fontSize: '10px', textTransform:'uppercase' }}>Ajouté le <b>{date} </b></Typography>}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    )
};

export default SearchResultItem;