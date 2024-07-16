
import React from "react";
import { v4 as uuid } from 'uuid';
import dateFormat from "dateformat";
import { Box } from "@mui/system";
import { Alert, AlertTitle, Container, Grid, Typography } from "@mui/material";
import { enablersDurationToReadable, getArtistsSpotify, goToSpotifyConnectUrl, isEmpty } from "../../../../services/utils";
import SpotifyConnectButton from "../../../generalsTemplates/buttons/SpotifyConnectButton";
import SearchResultItem from "../../SearchResultItem";
import { withTranslation } from "react-i18next";

const SpotifyTab = ({ t, showResult,mediaSearchResultSpotify, spotifyLinked, spotifyTopTracks, spotifyTrendsTracks,addingObject, spotifyUserDatas,currentUser, handleCheckAndAddObjectToPlaylistFromObject  }) => {
    return(
        <Box >
            {showResult ? (
                    <>
                        {isEmpty(mediaSearchResultSpotify) ? (
                                <> 
                                    {spotifyLinked ? (
                                        t('GeneralNoResult')
                                    ) : ( 
                                        <SpotifyConnectButton 
                                            text='Activer la recherche Spotify'
                                            clickFunc={goToSpotifyConnectUrl}
                                            user={currentUser}
                                        />
                                    )}
                                </>
                            ) : (
                                <Grid item xs={12}>
                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mt: 0 }}>
                                        {mediaSearchResultSpotify.map(function (media, idsp) {
                                            return (
                                                <SearchResultItem
                                                    key={idsp}
                                                    image={media.album.images[0].url}
                                                    title={media.name+ ' - '+media.artists[0].name}
                                                    source='spotify'
                                                    uid={uuid().slice(0, 10).toLowerCase()}
                                                    platformId={media.uri}
                                                    addedBy={addingObject.addedBy}
                                                    url={media.uri}
                                                    duration={enablersDurationToReadable(media.duration_ms, 'spotify')}
                                                    date={dateFormat(media.album.release_date, 'd mmm yyyy')}
                                                    channelOrArtist={getArtistsSpotify(media.artists)}
                                                    addItemToPlaylist={handleCheckAndAddObjectToPlaylistFromObject}
                                                />)
                                        })}
                                    </Grid>
                                </Grid>
                            )
                        }
                    </>
                ) : (
                    <>
                        {spotifyLinked ? ( // is room linked to spotify ?
                            <>
                                {spotifyUserDatas.connected ? (
                                        <>
                                            <Grid item xs={12}>
                                                <Typography variant="h6" sx={{mt:1, ml:1}} className='colorWhite 'gutterBottom>
                                                    {t('ModalAddMediaSpotifyRecommTitle')}
                                                </Typography>
                                                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mt: 0 }}>
                                                    {spotifyTopTracks.map(function (media, idsp) {
                                                        return (
                                                            <SearchResultItem
                                                                key={idsp}
                                                                image={media.album.images[0].url}
                                                                title={media.name+ ' - '+media.artists[0].name}
                                                                source='spotify'
                                                                uid={uuid().slice(0, 10).toLowerCase()}
                                                                platformId={media.uri}
                                                                addedBy={addingObject.addedBy}
                                                                url={media.uri}
                                                                duration={enablersDurationToReadable(media.duration_ms, 'spotify')}
                                                                date={dateFormat(media.album.release_date, 'd mmm yyyy')}
                                                                channelOrArtist={getArtistsSpotify(media.artists)}
                                                                addItemToPlaylist={handleCheckAndAddObjectToPlaylistFromObject}
                                                            />)
                                                    })}
                                                </Grid>
                                            </Grid>
                                        </>
                                    ) : (
                                        <Grid item xs={12} sx={{pt:1}}>
                                        
                                            <Alert severity="info" variant="filled" sx={{mt:1,mb:1 }} className="animate__animated bordLight animate__fadeInUp animate__slow texturaBgButton bord2  bordSolid " onClick={(e) => goToSpotifyConnectUrl()} >
                                                <AlertTitle sx={{margin:0}}>Connexion nécessaire pour accéder à vos favoris. </AlertTitle>
                                            </Alert>
                                            <SpotifyConnectButton 
                                                text='Mon compte spotify'
                                                clickFunc={goToSpotifyConnectUrl}
                                                user={currentUser}
                                            />
                                            {!isEmpty(spotifyTrendsTracks) &&
                                                <Typography variant="h6" sx={{mt:1, ml:1}} className='colorWhite 'gutterBottom>
                                                    {t('GeneralTrendings')}
                                                </Typography>
                                            }
                                            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mt: 0 }}>
                                                {spotifyTrendsTracks.map(function (track, idsp) {
                                                    let media = track.track;
                                                    return (
                                                        <SearchResultItem
                                                            key={idsp}
                                                            image={media.album.images[0].url}
                                                            title={media.name+ ' - '+media.artists[0].name}
                                                            source='spotify'
                                                            uid={uuid().slice(0, 10).toLowerCase()}
                                                            platformId={media.uri}
                                                            addedBy={addingObject.addedBy}
                                                            url={media.uri}
                                                            duration={enablersDurationToReadable(media.duration_ms, 'spotify')}
                                                            date={dateFormat(media.album.release_date, 'd mmm yyyy')}
                                                            channelOrArtist={getArtistsSpotify(media.artists)}
                                                            addItemToPlaylist={handleCheckAndAddObjectToPlaylistFromObject}
                                                        />)
                                                })}
                                            </Grid>
                                        </Grid>
                                    )
                                }
                            </>
                        ) : (
                            <Container sx={{padding:'1em 2em'}}>
                                <SpotifyConnectButton 
                                    text='Activer la recherche'
                                    clickFunc={goToSpotifyConnectUrl}
                                    user={currentUser}
                                />
                                
                                <Alert severity="info" variant="filled" sx={{mt:1}}className="animate__animated bordLight animate__fadeInUp animate__slow texturaBgButton bord2  bordSolid " onClick={(e) => goToSpotifyConnectUrl()} >
                                    <AlertTitle>Recherche sur Spotify</AlertTitle>
                                    <Typography fontSize="small" component="p">
                                        Active la recherche via Spotify pendant 60 minutes.
                                    </Typography>
                                </Alert>
                            </Container>    
                            )
                        }
                    </>
                )
            }
        </Box>
    )
};

export default withTranslation()(SpotifyTab);